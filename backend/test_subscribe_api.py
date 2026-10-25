import unittest
from unittest.mock import patch

from fastapi import HTTPException
from fastapi.testclient import TestClient

import main


class FakeSubscribersTable:
    def __init__(self):
        self.emails = set()
        self.pending_email = None
        self.fail = False

    def upsert(self, record, on_conflict):
        if on_conflict != "email":
            raise AssertionError(f"Unexpected conflict target: {on_conflict}")
        self.pending_email = record["email"]
        return self

    def execute(self):
        if self.fail:
            raise RuntimeError("Database unavailable")
        self.emails.add(self.pending_email)
        return None


class FakeDatabaseClient:
    def __init__(self):
        self.subscribers = FakeSubscribersTable()

    def table(self, table_name):
        if table_name != "subscribers":
            raise AssertionError(f"Unexpected table: {table_name}")
        return self.subscribers


class TestSubscribeApi(unittest.TestCase):
    def setUp(self):
        self.database = FakeDatabaseClient()
        self.database_patch = patch.object(main.db, "get_db", return_value=self.database)
        self.rate_limit_patch = patch.object(main, "enforce_rate_limit")
        self.database_patch.start()
        self.rate_limit = self.rate_limit_patch.start()
        self.client = TestClient(main.app)

    def tearDown(self):
        self.rate_limit_patch.stop()
        self.database_patch.stop()

    def test_valid_email_is_normalized_and_saved(self):
        response = self.client.post(
            "/api/subscribe",
            json={"email": "  Subscriber@Example.COM  "},
        )

        self.assertEqual(response.status_code, 200, response.text)
        self.assertEqual(
            response.json(),
            {"success": True, "message": "Subscription successful."},
        )
        self.assertEqual(self.database.subscribers.emails, {"subscriber@example.com"})
        self.rate_limit.assert_called_once()
        self.assertEqual(self.rate_limit.call_args.kwargs["scope"], "subscribe")

    def test_duplicate_email_returns_same_success_without_duplicate_record(self):
        first = self.client.post(
            "/api/subscribe",
            json={"email": "subscriber@example.com"},
        )
        duplicate = self.client.post(
            "/api/subscribe",
            json={"email": " Subscriber@Example.com "},
        )

        self.assertEqual(first.status_code, 200, first.text)
        self.assertEqual(duplicate.status_code, 200, duplicate.text)
        self.assertEqual(first.json(), duplicate.json())
        self.assertEqual(self.database.subscribers.emails, {"subscriber@example.com"})

    def test_invalid_email_returns_validation_error(self):
        for email in ("not-an-email", "user@localhost", "a" * 250 + "@example.com"):
            with self.subTest(email=email):
                response = self.client.post("/api/subscribe", json={"email": email})
                self.assertEqual(response.status_code, 422)

        self.assertFalse(self.database.subscribers.emails)
        self.rate_limit.assert_not_called()

    def test_rate_limit_exceeded_returns_429(self):
        self.rate_limit.side_effect = HTTPException(
            status_code=429,
            detail="Too many requests. Please try again shortly.",
        )

        response = self.client.post(
            "/api/subscribe",
            json={"email": "subscriber@example.com"},
        )

        self.assertEqual(response.status_code, 429)
        self.assertEqual(response.json()["detail"], "Too many requests. Please try again shortly.")
        self.assertFalse(self.database.subscribers.emails)

    def test_database_failure_returns_explicit_error(self):
        self.database.subscribers.fail = True

        response = self.client.post(
            "/api/subscribe",
            json={"email": "subscriber@example.com"},
        )

        self.assertEqual(response.status_code, 503)
        self.assertIn("temporarily unavailable", response.json()["detail"])
        self.assertNotIn("success", response.json())


if __name__ == "__main__":
    unittest.main()
