import socket
import time
import unittest
from unittest.mock import patch

from fastapi.testclient import TestClient

import main


def public_dns_result(host, port, type):
    return [
        (socket.AF_INET, socket.SOCK_STREAM, socket.IPPROTO_TCP, "", ("93.184.216.34", port))
    ]


class TestNoticeUrlValidation(unittest.TestCase):
    def setUp(self):
        self.admin_override = lambda: {"id": "admin-id", "email": "admin@example.com"}
        main.app.dependency_overrides[main.get_current_admin] = self.admin_override
        self.client = TestClient(main.app)
        self.dns_patch = patch("main.socket.getaddrinfo", side_effect=public_dns_result)
        self.upsert_patch = patch.object(main.db, "upsert_notice")
        self.fetch_patch = patch.object(main.db, "fetch_notice_by_id")
        self.update_patch = patch.object(main.db, "update_notice_by_id")
        self.flush_patch = patch.object(main, "flush_cache")
        self.dns_patch.start()
        self.upsert = self.upsert_patch.start()
        self.fetch = self.fetch_patch.start()
        self.update = self.update_patch.start()
        self.flush_patch.start()

    def tearDown(self):
        self.flush_patch.stop()
        self.update_patch.stop()
        self.fetch_patch.stop()
        self.upsert_patch.stop()
        self.dns_patch.stop()
        main.app.dependency_overrides.pop(main.get_current_admin, None)

    def test_valid_https_url_passes_on_create_alias(self):
        response = self.client.post(
            "/api/posts/create",
            json={
                "title": "Test notice",
                "content": "Notice content",
                "apply_url": "https://apply.example.com/form",
                "pdf_url": "https://docs.example.com/notice.pdf",
            },
        )

        self.assertEqual(response.status_code, 200, response.text)
        record = self.upsert.call_args.args[0]
        self.assertEqual(record["apply_url"], "https://apply.example.com/form")
        self.assertEqual(record["pdf_url"], "https://docs.example.com/notice.pdf")

    def test_invalid_schemes_localhost_and_private_ip_are_rejected(self):
        invalid_urls = (
            "javascript:alert(1)",
            "file:///etc/passwd",
            "http://localhost/path",
            "https://192.168.1.25/path",
        )

        for url in invalid_urls:
            with self.subTest(url=url):
                with self.assertRaises(main.HTTPException) as raised:
                    main.validate_safe_url(url, "apply_url")
                self.assertEqual(raised.exception.status_code, 422)
                self.assertIn("apply_url", raised.exception.detail)
                self.assertTrue(raised.exception.detail.split(": ", 1)[1])

    def test_dns_resolving_to_private_ip_is_rejected(self):
        private_dns = patch(
            "main.socket.getaddrinfo",
            return_value=[
                (
                    socket.AF_INET,
                    socket.SOCK_STREAM,
                    socket.IPPROTO_TCP,
                    "",
                    ("10.0.0.8", 443),
                )
            ],
        )
        with private_dns:
            with self.assertRaises(main.HTTPException) as raised:
                main.validate_safe_url("https://internal.example.com", "pdf_url")

        self.assertEqual(raised.exception.status_code, 422)
        self.assertIn("pdf_url", raised.exception.detail)
        self.assertIn("Private", raised.exception.detail)

    def test_dns_failure_and_timeout_return_clear_validation_errors(self):
        with patch("main.socket.getaddrinfo", side_effect=socket.gaierror("DNS failure")):
            with self.assertRaises(main.HTTPException) as failed:
                main.validate_safe_url("https://unresolvable.example.com", "apply_url")
        self.assertIn("Hostname could not be resolved safely", failed.exception.detail)

        with (
            patch("main.URL_DNS_TIMEOUT_SECONDS", 0.01),
            patch(
                "main.socket.getaddrinfo",
                side_effect=lambda *args, **kwargs: time.sleep(0.05),
            ),
        ):
            with self.assertRaises(main.HTTPException) as timed_out:
                main.validate_safe_url("https://slow.example.com", "pdf_url")
        self.assertIn("pdf_url", timed_out.exception.detail)
        self.assertIn("timed out", timed_out.exception.detail)

    def test_empty_optional_urls_are_allowed(self):
        response = self.client.post(
            "/api/admin/posts",
            json={"title": "Test notice", "content": "Notice content", "apply_url": "", "pdf_url": None},
        )

        self.assertEqual(response.status_code, 200, response.text)
        record = self.upsert.call_args.args[0]
        self.assertIsNone(record["apply_url"])
        self.assertIsNone(record["pdf_url"])

    def test_create_rejects_bad_url_before_saving(self):
        response = self.client.post(
            "/api/admin/posts",
            json={
                "title": "Test notice",
                "content": "Notice content",
                "pdf_url": "file:///tmp/notice.pdf",
            },
        )

        self.assertEqual(response.status_code, 422)
        self.assertIn("pdf_url", response.json()["detail"])
        self.assertIn("http(s)", response.json()["detail"])
        self.upsert.assert_not_called()

    def test_update_validates_urls_before_writing(self):
        self.fetch.return_value = {"id": "post-1", "slug": "test-post"}
        response = self.client.put(
            "/api/admin/posts/post-1",
            json={"apply_url": "http://localhost/apply"},
        )

        self.assertEqual(response.status_code, 422)
        self.assertIn("apply_url", response.json()["detail"])
        self.update.assert_not_called()

    def test_update_rejects_private_pdf_url_before_writing(self):
        self.fetch.return_value = {"id": "post-1", "slug": "test-post"}
        response = self.client.put(
            "/api/admin/posts/post-1",
            json={"pdf_url": "https://10.1.2.3/document.pdf"},
        )

        self.assertEqual(response.status_code, 422)
        self.assertIn("pdf_url", response.json()["detail"])
        self.update.assert_not_called()

    def test_update_accepts_valid_url_and_writes_normalized_value(self):
        self.fetch.return_value = {"id": "post-1", "slug": "test-post"}
        self.update.return_value = {"id": "post-1", "apply_url": "https://apply.example.com"}

        response = self.client.put(
            "/api/admin/posts/post-1",
            json={"apply_url": "  https://apply.example.com  "},
        )

        self.assertEqual(response.status_code, 200, response.text)
        self.update.assert_called_once_with(
            "post-1", {"apply_url": "https://apply.example.com"}
        )


if __name__ == "__main__":
    unittest.main()
