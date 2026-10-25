import unittest
from unittest.mock import patch

from fastapi.testclient import TestClient

import main


class TestAdminPostCategories(unittest.TestCase):
    def setUp(self):
        self.posts = {}
        self.next_id = 1
        main.app.dependency_overrides[main.get_current_admin] = lambda: {
            "id": "admin-id",
            "email": "admin@example.com",
        }
        self.client = TestClient(main.app)
        self.patches = [
            patch.object(main.db, "upsert_notice", side_effect=self.upsert_notice),
            patch.object(main.db, "fetch_notice_by_id", side_effect=self.fetch_notice),
            patch.object(main.db, "update_notice_by_id", side_effect=self.update_notice),
            patch.object(main, "flush_cache"),
            patch.object(main, "send_telegram_alert"),
        ]
        for mocked in self.patches:
            mocked.start()

    def tearDown(self):
        for mocked in reversed(self.patches):
            mocked.stop()
        main.app.dependency_overrides.pop(main.get_current_admin, None)

    def upsert_notice(self, record):
        post_id = str(self.next_id)
        self.next_id += 1
        self.posts[post_id] = {"id": post_id, **record}

    def fetch_notice(self, post_id):
        return self.posts.get(post_id)

    def update_notice(self, post_id, updates):
        self.posts[post_id].update(updates)
        return self.posts[post_id]

    def test_create_then_title_update_preserves_each_supported_category(self):
        for category in ("jobs", "admit_card", "results", "schemes"):
            with self.subTest(category=category):
                created = self.client.post(
                    "/api/admin/posts",
                    json={
                        "title": f"{category} notice",
                        "category": category,
                        "content": "Notice content",
                    },
                )
                self.assertEqual(created.status_code, 200, created.text)

                post_id = next(
                    post_id
                    for post_id, post in self.posts.items()
                    if post["slug"] == created.json()["slug"]
                )
                updated = self.client.put(
                    f"/api/admin/posts/{post_id}",
                    json={"title": f"Updated {category} notice"},
                )

                self.assertEqual(updated.status_code, 200, updated.text)
                self.assertEqual(updated.json()["data"]["category"], category)

    def test_update_rejects_invalid_category(self):
        response = self.client.put(
            "/api/admin/posts/1",
            json={"category": "not-a-category"},
        )

        self.assertEqual(response.status_code, 422)
        self.assertIn("category", response.json()["detail"][0]["loc"])
        self.assertIn("schemes", response.json()["detail"][0]["msg"])

    def test_status_update_does_not_change_category(self):
        post_id = "status-post"
        self.posts[post_id] = {"id": post_id, "slug": "status-post", "category": "schemes"}

        response = self.client.post(
            f"/api/admin/posts/{post_id}/status",
            json={"status": "archived"},
        )

        self.assertEqual(response.status_code, 200, response.text)
        self.assertEqual(self.posts[post_id]["category"], "schemes")
        self.assertEqual(self.posts[post_id]["status"], "archived")
        main.db.update_notice_by_id.assert_called_once_with(
            post_id, {"status": "archived"}
        )


if __name__ == "__main__":
    unittest.main()
