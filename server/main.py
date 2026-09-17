"""只用于私有构建的 PIN 鉴权服务器。

进程内会话和限流适合单进程家庭部署。多 worker/多实例部署必须改用共享会话存储，
并在可信反向代理层实施限流；不能把前端 PIN 页面当作访问控制。
"""

import hashlib
import hmac
import json
import os
import re
import secrets
import time
from collections import defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Callable
from urllib.parse import parse_qs

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.middleware.base import BaseHTTPMiddleware

COOKIE_NAME = "health_auth"
NO_STORE_HEADERS = {
    "Cache-Control": "private, no-store, max-age=0",
    "Pragma": "no-cache",
    "Vary": "Cookie",
}
PIN_PATTERN = re.compile(r"^[0-9]{6}$")


@dataclass(frozen=True)
class Settings:
    pin_hash: str
    auth_secret: str
    cookie_secure: bool = True
    session_ttl_seconds: int = 30 * 24 * 3600
    dist_dir: Path = Path(__file__).resolve().parent.parent / "dist-private"

    @classmethod
    def from_env(cls) -> "Settings":
        pin_hash = os.environ.get("PIN_HASH", "")
        auth_secret = os.environ.get("AUTH_SECRET", "")
        if not re.fullmatch(r"[0-9a-f]{64}", pin_hash):
            raise RuntimeError("必须通过 PIN_HASH 提供六位 PIN 的 SHA-256 十六进制哈希")
        if len(auth_secret) < 32 or len(set(auth_secret)) < 8:
            raise RuntimeError("AUTH_SECRET 必须至少 32 字符且具有足够随机性")
        ttl = int(os.environ.get("SESSION_TTL_SECONDS", str(30 * 24 * 3600)))
        if ttl < 60 or ttl > 30 * 24 * 3600:
            raise RuntimeError("SESSION_TTL_SECONDS 必须在 60 秒到 30 天之间")
        dist = Path(os.environ.get("HEALTH_DIST_DIR", str(Path(__file__).resolve().parent.parent / "dist-private"))).resolve()
        return cls(pin_hash, auth_secret, os.environ.get("COOKIE_SECURE", "true").lower() == "true", ttl, dist)


class SessionStore:
    def __init__(self, ttl_seconds: int, secret: str, clock: Callable[[], float] = time.time):
        self.ttl_seconds = ttl_seconds
        self.secret = secret.encode("utf-8")
        self.clock = clock
        self.sessions: dict[str, float] = {}

    def _key(self, token: str) -> str:
        return hmac.new(self.secret, token.encode("utf-8"), hashlib.sha256).hexdigest()

    def create(self) -> str:
        self.cleanup()
        token = secrets.token_urlsafe(32)
        self.sessions[self._key(token)] = self.clock() + self.ttl_seconds
        return token

    def valid(self, token: str) -> bool:
        key = self._key(token)
        expires_at = self.sessions.get(key)
        if expires_at is None:
            return False
        if expires_at <= self.clock():
            self.sessions.pop(key, None)
            return False
        return True

    def revoke(self, token: str) -> None:
        self.sessions.pop(self._key(token), None)

    def revoke_all(self) -> None:
        self.sessions.clear()

    def cleanup(self) -> None:
        now = self.clock()
        for token, expires_at in list(self.sessions.items()):
            if expires_at <= now:
                self.sessions.pop(token, None)


class FailureLimiter:
    def __init__(self, clock: Callable[[], float] = time.time):
        self.clock = clock
        self.failures: dict[str, list[float]] = defaultdict(list)

    def limited(self, ip: str) -> bool:
        now = self.clock()
        recent = [item for item in self.failures.get(ip, []) if now - item < 900]
        if recent:
            self.failures[ip] = recent
        else:
            self.failures.pop(ip, None)
        return len(recent) >= 5

    def add(self, ip: str) -> None:
        if len(self.failures) > 10_000:
            self.failures.clear()
        self.failures[ip].append(self.clock())

    def clear(self, ip: str) -> None:
        self.failures.pop(ip, None)


PIN_PAGE = """<!doctype html><html lang="zh-CN"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>健康看板</title><style>body{font-family:system-ui;margin:0;min-height:100vh;display:grid;
place-items:center;background:#fafaf8;color:#2c2824}form{display:grid;gap:16px;width:min(320px,80vw)}
input,button{font:inherit;padding:14px;border-radius:12px}input{border:1px solid #e8e5e0}
button{border:0;background:#3b9b6f;color:white}</style>
<form method="post" action="/api/verify"><h1>健康看板</h1><label>访问 PIN
<input name="pin" inputmode="numeric" type="password" minlength="6" maxlength="6" required></label>
<button type="submit">进入</button></form></html>"""


class SpaFiles(StaticFiles):
    async def get_response(self, path, scope):
        try:
            return await super().get_response(path, scope)
        except StarletteHTTPException as error:
            if error.status_code == 404 and scope["method"] in {"GET", "HEAD"} and not path.startswith("api/"):
                return await super().get_response("index.html", scope)
            raise


def create_app(settings: Settings, sessions: SessionStore | None = None, clock: Callable[[], float] = time.time) -> FastAPI:
    if not settings.dist_dir.is_dir():
        raise RuntimeError(f"未找到私有构建目录 {settings.dist_dir}，请先运行 npm run build-private")
    bundles = "\n".join(
        file.read_text(encoding="utf-8", errors="ignore")
        for file in settings.dist_dir.rglob("*.js")
        if file.is_file()
    )
    if not re.search(r'(?:"mode"|mode)\s*:\s*["\'`]private["\'`]', bundles):
        raise RuntimeError("构建产物缺少 private 模式证明；拒绝托管可能误放的公开或未知 bundle")
    session_store = sessions or SessionStore(settings.session_ttl_seconds, settings.auth_secret, clock)
    limiter = FailureLimiter(clock)
    application = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)

    def authenticated(request: Request) -> bool:
        token = request.cookies.get(COOKIE_NAME, "")
        return bool(token) and session_store.valid(token)

    class AuthMiddleware(BaseHTTPMiddleware):
        async def dispatch(self, request: Request, call_next):
            public = request.url.path == "/api/verify"
            if not public and not authenticated(request):
                if request.url.path.startswith("/api/"):
                    return JSONResponse({"detail": "未认证或会话已过期"}, status_code=401, headers=NO_STORE_HEADERS)
                return HTMLResponse(PIN_PAGE, status_code=401, headers=NO_STORE_HEADERS)
            response = await call_next(request)
            for key, value in NO_STORE_HEADERS.items():
                response.headers[key] = value
            return response

    application.add_middleware(AuthMiddleware)

    async def read_pin(request: Request) -> tuple[str | None, bool]:
        content_type = request.headers.get("content-type", "")
        if "application/json" in content_type:
            try:
                payload = json.loads((await request.body()).decode("utf8"))
            except (UnicodeDecodeError, json.JSONDecodeError):
                return None, True
            return (payload.get("pin") if isinstance(payload, dict) else None), True
        try:
            values = parse_qs((await request.body()).decode("utf8"), keep_blank_values=True)
        except UnicodeDecodeError:
            return None, False
        return values.get("pin", [None])[0], False

    @application.post("/api/verify")
    async def verify(request: Request):
        ip = request.client.host if request.client else "unknown"
        if limiter.limited(ip):
            return JSONResponse({"detail": "尝试次数过多，请稍后再试"}, status_code=429, headers=NO_STORE_HEADERS)
        pin, wants_json = await read_pin(request)
        if not isinstance(pin, str) or not PIN_PATTERN.fullmatch(pin):
            limiter.add(ip)
            return JSONResponse({"detail": "PIN 必须是六位数字字符串"}, status_code=400, headers=NO_STORE_HEADERS)
        candidate = hashlib.sha256(pin.encode("ascii")).hexdigest()
        if not hmac.compare_digest(candidate, settings.pin_hash):
            limiter.add(ip)
            return JSONResponse({"detail": "PIN 不正确"}, status_code=401, headers=NO_STORE_HEADERS)
        limiter.clear(ip)
        token = session_store.create()
        response = JSONResponse({"ok": True}, headers=NO_STORE_HEADERS) if wants_json else RedirectResponse("/", status_code=303, headers=NO_STORE_HEADERS)
        response.set_cookie(COOKIE_NAME, token, httponly=True, secure=settings.cookie_secure, samesite="strict", max_age=settings.session_ttl_seconds, path="/")
        return response

    @application.get("/api/check")
    async def check():
        return {"ok": True}

    @application.post("/api/logout")
    async def logout(request: Request):
        session_store.revoke(request.cookies.get(COOKIE_NAME, ""))
        response = JSONResponse({"ok": True}, headers=NO_STORE_HEADERS)
        response.delete_cookie(COOKIE_NAME, path="/")
        return response

    @application.post("/api/sessions/revoke-all")
    async def revoke_all():
        session_store.revoke_all()
        response = JSONResponse({"ok": True}, headers=NO_STORE_HEADERS)
        response.delete_cookie(COOKIE_NAME, path="/")
        return response

    application.mount("/", SpaFiles(directory=settings.dist_dir, html=True), name="dashboard")
    application.state.session_store = session_store
    return application


app = create_app(Settings.from_env())
