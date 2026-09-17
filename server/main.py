"""可选的 PIN 鉴权静态服务器。

只在部署真实健康数据时启用。PIN 明文、PIN_HASH 和 AUTH_SECRET 都不得写入仓库。
"""

import hashlib
import hmac
import os
import time
from collections import defaultdict
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.middleware.base import BaseHTTPMiddleware

PIN_HASH = os.environ.get("PIN_HASH", "")
AUTH_SECRET = os.environ.get("AUTH_SECRET", "")
COOKIE_SECURE = os.environ.get("COOKIE_SECURE", "true").lower() == "true"

if not PIN_HASH or len(AUTH_SECRET) < 32:
    raise RuntimeError("必须通过环境变量提供 PIN_HASH 和至少 32 字符的 AUTH_SECRET")

app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)
failures: dict[str, list[float]] = defaultdict(list)


def expected_token() -> str:
    return hmac.new(AUTH_SECRET.encode(), PIN_HASH.encode(), hashlib.sha256).hexdigest()


def authenticated(request: Request) -> bool:
    token = request.cookies.get("health_auth", "")
    return bool(token) and hmac.compare_digest(token, expected_token())


def rate_limited(ip: str) -> bool:
    now = time.time()
    failures[ip] = [item for item in failures[ip] if now - item < 900]
    return len(failures[ip]) >= 5


PIN_PAGE = """<!doctype html><html lang="zh-CN"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>健康看板</title><style>body{font-family:system-ui;margin:0;min-height:100vh;display:grid;
place-items:center;background:#fafaf8;color:#2c2824}form{display:grid;gap:16px;width:min(320px,80vw)}
input,button{font:inherit;padding:14px;border-radius:12px}input{border:1px solid #e8e5e0}
button{border:0;background:#3b9b6f;color:white}</style>
<form method="post" action="/api/verify"><h1>健康看板</h1><label>访问 PIN
<input name="pin" inputmode="numeric" type="password" minlength="6" maxlength="6" required></label>
<button type="submit">进入</button></form></html>"""


class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.url.path in {"/api/verify", "/api/check"}:
            return await call_next(request)
        if not authenticated(request):
            return HTMLResponse(PIN_PAGE, headers={"Cache-Control": "no-store"})
        return await call_next(request)


app.add_middleware(AuthMiddleware)


@app.post("/api/verify")
async def verify(request: Request, response: Response):
    ip = request.client.host if request.client else "unknown"
    if rate_limited(ip):
        raise HTTPException(429, "尝试次数过多，请稍后再试")

    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        payload = await request.json()
        pin = payload.get("pin", "") if isinstance(payload, dict) else ""
    else:
        form = await request.form()
        pin = str(form.get("pin", ""))

    candidate = hashlib.sha256(pin.encode()).hexdigest()
    if not hmac.compare_digest(candidate, PIN_HASH):
        failures[ip].append(time.time())
        raise HTTPException(401, "PIN 不正确")

    response.set_cookie(
        "health_auth",
        expected_token(),
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="strict",
        max_age=30 * 24 * 3600,
    )
    if "application/json" not in content_type:
        response.status_code = 303
        response.headers["Location"] = "/"
    return {"ok": True}


@app.get("/api/check")
async def check(request: Request):
    if not authenticated(request):
        raise HTTPException(401)
    return {"ok": True}


class SpaFiles(StaticFiles):
    async def get_response(self, path, scope):
        try:
            return await super().get_response(path, scope)
        except StarletteHTTPException as error:
            if error.status_code == 404 and scope["method"] in {"GET", "HEAD"}:
                return await super().get_response("index.html", scope)
            raise


dist = Path(__file__).resolve().parent.parent / "dist"
if not dist.is_dir():
    raise RuntimeError("未找到 dist/，请先运行 npm run build-private")
app.mount("/", SpaFiles(directory=dist, html=True), name="dashboard")
