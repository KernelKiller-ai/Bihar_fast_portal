import hashlib
import os
import threading
import time
from collections import defaultdict, deque
from typing import Deque, Dict

from fastapi import HTTPException, Request, status
from upstash_redis import Redis
from dotenv import load_dotenv

load_dotenv(override=False)

UPSTASH_URL = os.getenv("UPSTASH_REDIS_REST_URL")
UPSTASH_TOKEN = os.getenv("UPSTASH_REDIS_REST_TOKEN")
TRUST_PROXY_HEADERS = os.getenv("TRUST_PROXY_HEADERS", "false").lower() == "true"

redis = None
if UPSTASH_URL and UPSTASH_TOKEN:
    try:
        redis = Redis(url=UPSTASH_URL, token=UPSTASH_TOKEN)
    except Exception:
        redis = None

_local_lock = threading.Lock()
_local_windows: Dict[str, Deque[float]] = defaultdict(deque)
_MAX_LOCAL_KEYS = 10_000


def get_client_ip(request: Request) -> str:
    if TRUST_PROXY_HEADERS:
        forwarded_ip = request.headers.get("cf-connecting-ip") or request.headers.get("x-forwarded-for")
        if forwarded_ip:
            return forwarded_ip.split(",")[0].strip()
    return request.client.host if request.client else "unknown-client"


def _local_allow(key: str, limit: int, window_seconds: int, now: float) -> bool:
    with _local_lock:
        if len(_local_windows) >= _MAX_LOCAL_KEYS and key not in _local_windows:
            oldest_key = min(_local_windows, key=lambda item: _local_windows[item][-1] if _local_windows[item] else 0)
            _local_windows.pop(oldest_key, None)

        window = _local_windows[key]
        cutoff = now - window_seconds
        while window and window[0] <= cutoff:
            window.popleft()
        if len(window) >= limit:
            return False
        window.append(now)
        return True


def enforce_rate_limit(request: Request, limit: int, window_seconds: int, scope: str) -> None:
    client_ip = get_client_ip(request)
    identifier = hashlib.sha256(client_ip.encode("utf-8")).hexdigest()[:32]
    key = f"rate:{scope}:{identifier}"
    now = time.time()

    if redis:
        try:
            count = int(redis.incr(key))
            if count == 1:
                redis.expire(key, window_seconds)
            if count <= limit:
                return
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again shortly.",
                headers={"Retry-After": str(window_seconds)},
            )
        except HTTPException:
            raise
        except Exception:
            # Redis outages should not take public read APIs offline.
            pass

    if not _local_allow(key, limit, window_seconds, now):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many requests. Please try again shortly.",
            headers={"Retry-After": str(window_seconds)},
        )
