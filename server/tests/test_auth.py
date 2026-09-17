import hashlib
import os
import tempfile
import unittest
from pathlib import Path

_IMPORT_DIST = Path(tempfile.mkdtemp(prefix="health-server-import-"))
(_IMPORT_DIST / "index.html").write_text("PRIVATE APP", encoding="utf-8")
(_IMPORT_DIST / "mode.js").write_text('const metadata={mode:"private"}', encoding="utf-8")
TEST_SECRET = "".join(["test-only-", "random-secret-", "material-1234567890"])
os.environ["PIN_HASH"] = hashlib.sha256(b"123456").hexdigest()
os.environ["AUTH_SECRET"] = TEST_SECRET
os.environ["COOKIE_SECURE"] = "false"
os.environ["HEALTH_DIST_DIR"] = str(_IMPORT_DIST)

from fastapi.testclient import TestClient

from server.main import COOKIE_NAME, SessionStore, Settings, create_app


class MutableClock:
    def __init__(self):
        self.now = 1_800_000_000.0

    def __call__(self):
        return self.now


class AuthTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="health-server-")
        self.dist = Path(self.temp.name)
        (self.dist / "index.html").write_text("PRIVATE APP", encoding="utf-8")
        (self.dist / "asset.js").write_text('const metadata={mode:"private"};PRIVATE DATA', encoding="utf-8")
        self.clock = MutableClock()
        self.settings = Settings(
            pin_hash=hashlib.sha256(b"123456").hexdigest(),
            auth_secret=TEST_SECRET,
            cookie_secure=False,
            session_ttl_seconds=120,
            dist_dir=self.dist,
        )
        self.sessions = SessionStore(120, self.settings.auth_secret, self.clock)
        self.client = TestClient(create_app(self.settings, self.sessions, self.clock))

    def tearDown(self):
        self.client.close()
        self.temp.cleanup()

    def login(self, client=None):
        target = client or self.client
        response = target.post("/api/verify", json={"pin": "123456"})
        self.assertEqual(response.status_code, 200)
        return response.cookies.get(COOKIE_NAME)

    def test_each_login_gets_a_unique_server_side_session(self):
        first = self.login()
        second_client = TestClient(create_app(self.settings, self.sessions, self.clock))
        try:
            second = self.login(second_client)
        finally:
            second_client.close()
        self.assertNotEqual(first, second)
        self.assertTrue(self.sessions.valid(first))
        self.assertTrue(self.sessions.valid(second))

    def test_expired_cookie_cannot_be_replayed(self):
        token = self.login()
        self.clock.now += 121
        response = self.client.get("/asset.js", cookies={COOKIE_NAME: token})
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.headers["cache-control"], "private, no-store, max-age=0")

    def test_logout_and_revoke_all_invalidate_sessions(self):
        first = self.login()
        response = self.client.post("/api/logout")
        self.assertEqual(response.status_code, 200)
        self.assertFalse(self.sessions.valid(first))
        second = self.login()
        self.client.post("/api/sessions/revoke-all")
        self.assertFalse(self.sessions.valid(second))

    def test_invalid_json_pin_types_are_400_not_500(self):
        for payload in ({"pin": 123456}, {"pin": None}, {"pin": []}):
            response = self.client.post("/api/verify", json=payload)
            self.assertEqual(response.status_code, 400)
        malformed = self.client.post("/api/verify", content=b'{"pin":', headers={"content-type": "application/json"})
        self.assertEqual(malformed.status_code, 400)

    def test_static_assets_are_protected_and_never_cached(self):
        anonymous = self.client.get("/asset.js")
        self.assertEqual(anonymous.status_code, 401)
        self.assertEqual(anonymous.headers["cache-control"], "private, no-store, max-age=0")
        self.login()
        protected = self.client.get("/asset.js")
        self.assertEqual(protected.status_code, 200)
        self.assertIn("PRIVATE DATA", protected.text)
        self.assertEqual(protected.headers["cache-control"], "private, no-store, max-age=0")
        self.assertEqual(protected.headers["vary"], "Cookie")

    def test_unknown_api_does_not_fall_back_to_spa(self):
        self.login()
        response = self.client.get("/api/not-found")
        self.assertEqual(response.status_code, 404)
        self.assertNotIn("PRIVATE APP", response.text)

    def test_server_refuses_bundle_without_private_mode_proof(self):
        with tempfile.TemporaryDirectory(prefix="health-demo-bundle-") as directory:
            dist = Path(directory)
            (dist / "index.html").write_text("DEMO APP", encoding="utf-8")
            (dist / "asset.js").write_text('const metadata={mode:"demo"}', encoding="utf-8")
            unsafe = Settings(
                pin_hash=self.settings.pin_hash,
                auth_secret=self.settings.auth_secret,
                cookie_secure=False,
                session_ttl_seconds=120,
                dist_dir=dist,
            )
            with self.assertRaisesRegex(RuntimeError, "private 模式证明"):
                create_app(unsafe)


if __name__ == "__main__":
    unittest.main()
