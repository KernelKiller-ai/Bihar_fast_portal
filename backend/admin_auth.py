"""Shared dynamic admin authentication dependency.

Lives in its own module so both backend.main (posts admin) and
backend.quiz_router (quiz admin) can import it without a circular import
(main.py imports quiz_router at startup).

Auth flow (Supabase JWT + profiles.role):
  1. Extract the Bearer JWT from the Authorization header.
  2. Verify it against Supabase Auth (supabase.auth.get_user(token)).
  3. Load the caller's row from the `profiles` table and require
     role in {admin, creator}.
  4. Invalid token / missing profile / insufficient role => 403 Forbidden.
"""

import hmac
import logging
import os
from typing import Any, Dict, Optional

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from database import SUPABASE_URL, SUPABASE_KEY, get_service_db, get_db
from rate_limiter import enforce_rate_limit
from supabase import create_client

logger = logging.getLogger("biharfast_admin_auth")

bearer_scheme = HTTPBearer(auto_error=False)

ADMIN_ROLES = {"admin", "creator"}
ADMIN_API_TOKEN = os.getenv("ADMIN_API_TOKEN", "").strip()


def get_current_admin(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
) -> Dict[str, Any]:
    """Dynamic admin authentication via Supabase Auth + profiles.role.

    Returns a dict with the admin's verified id/role so route handlers can
    attach author attribution and audit trails.
    """
    enforce_rate_limit(request, limit=30, window_seconds=60, scope="admin")

    if not credentials or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin authentication required.",
        )

    token = credentials.credentials.strip()
    if not token:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin authentication required.",
        )

    # Allow legacy static token if configured (e.g. CLI scripts / tests)
    if ADMIN_API_TOKEN and hmac.compare_digest(token, ADMIN_API_TOKEN):
        return {
            "id": "admin-static-token",
            "email": "admin@biharfast.in",
            "role": "admin",
            "full_name": "System Administrator",
        }

    supabase = get_service_db() or get_db()
    if not supabase or not SUPABASE_URL or not SUPABASE_KEY:
        # Fail closed: no way to verify identity means no admin access.
        logger.error("Supabase unavailable for admin verification (fail-closed)")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication service unavailable. Try again shortly.",
        )

    # 1. Verify the JWT with Supabase Auth.
    try:
        auth_client = create_client(SUPABASE_URL, SUPABASE_KEY)
        auth_client.postgrest.auth(token)
        result = auth_client.auth.get_user(token)
        user = result.user if result else None
    except Exception as e:
        logger.warning(f"Admin JWT verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid or expired admin session.",
        )

    if not user or not user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid or expired admin session.",
        )

    # 2. Load the profile and check the role.
    try:
        profile_res = (
            supabase.table("profiles")
            .select("id, role, full_name")
            .eq("id", str(user.id))
            .limit(1)
            .execute()
        )
        profile = profile_res.data[0] if profile_res.data else None
    except Exception as e:
        logger.error(f"Admin profile lookup failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication service unavailable. Try again shortly.",
        )

    if not profile or str(profile.get("role") or "").lower() not in ADMIN_ROLES:
        logger.warning(
            f"Non-admin user {user.id} attempted admin action on {request.url.path}"
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to perform this action.",
        )

    return {
        "id": str(user.id),
        "email": user.email,
        "role": str(profile.get("role")).lower(),
        "full_name": profile.get("full_name") or "",
    }
