import { useState, useEffect, useCallback } from "react";

type AuthState = "checking" | "locked" | "unlocked";

export function PinGate({ children }: { children: React.ReactNode }) {
  // 静态演示默认关闭鉴权；部署真实健康数据时必须设置 VITE_AUTH_ENABLED=true，
  // 并通过 server/main.py 托管构建产物。环境变量不应包含 PIN 明文。
  const authEnabled = import.meta.env.VITE_AUTH_ENABLED === "true";
  const [state, setState] = useState<AuthState>("checking");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);

  const checkSession = useCallback(async () => {
    const base = import.meta.env.BASE_URL.replace(/\/$/, "");
    try {
      const response = await fetch(`${base}/api/check`, { credentials: "same-origin", cache: "no-store" });
      setState(response.ok ? "unlocked" : "locked");
      if (!response.ok) setPin("");
    } catch {
      // 私有数据已下发后，网络或会话状态不明时采用失败关闭策略。
      setState("locked");
      setPin("");
    }
  }, []);

  useEffect(() => {
    if (!authEnabled) return;
    void checkSession();
    const onFocus = () => { void checkSession(); };
    const onVisibility = () => { if (document.visibilityState === "visible") void checkSession(); };
    const timer = window.setInterval(() => { void checkSession(); }, 60_000);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [authEnabled, checkSession]);

  const submit = useCallback(async (fullPin: string) => {
    try {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${base}/api/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ pin: fullPin }),
      });
      if (res.ok) {
        setState("unlocked");
      } else {
        setError(
          res.status === 429
            ? "尝试次数过多，请稍后再试"
            : res.status === 400
              ? "PIN 必须是六位数字"
              : res.status === 401
                ? "PIN 不正确"
                : "服务暂时不可用，请稍后重试",
        );
        setShaking(true);
        setTimeout(() => {
          setShaking(false);
          setPin("");
          setError("");
        }, 800);
      }
    } catch {
      setError("网络错误，请重试");
      setPin("");
    }
  }, []);

  const handleDigit = useCallback(
    (d: string) => {
      if (pin.length >= 6) return;
      const next = pin + d;
      setPin(next);
      setError("");
      if (next.length === 6) {
        submit(next);
      }
    },
    [pin, submit],
  );

  const handleDelete = useCallback(() => {
    setPin((p) => p.slice(0, -1));
    setError("");
  }, []);

  if (!authEnabled) {
    return <>{children}</>;
  }

  if (state === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50">
        <div className="text-warm-400 text-sm">Loading...</div>
      </div>
    );
  }

  if (state === "unlocked") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-warm-50 px-6 select-none">
      {/* 标题 */}
      <div className="text-center mb-10">
        <h1 className="text-[28px] font-bold text-warm-900">健康看板</h1>
        <p className="text-sm text-warm-400 mt-2">请输入访问密码</p>
      </div>

      {/* PIN 圆点 */}
      <div className={`flex gap-4 mb-10 ${shaking ? "animate-shake" : ""}`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`w-3.5 h-3.5 rounded-full transition-all duration-150 ${
              i < pin.length ? "bg-primary scale-110" : "bg-warm-200"
            }`}
          />
        ))}
      </div>

      {/* 错误提示 */}
      <div className="h-6 mb-4">
        {error && <p className="text-sm text-[#C75C3A]">{error}</p>}
      </div>

      {/* 数字键盘 */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-[280px]">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map(
          (key) => {
            if (key === "") return <div key="empty" />;
            if (key === "del") {
              return (
                <button
                  key="del"
                  onClick={handleDelete}
                  className="h-16 rounded-[--radius-md] flex items-center justify-center cursor-pointer active:bg-warm-100 transition-colors"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-warm-600"
                  >
                    <path
                      d="M9 18L3 12L9 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M21 12H4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              );
            }
            return (
              <button
                key={key}
                onClick={() => handleDigit(key)}
                className="h-16 rounded-[--radius-md] bg-white shadow-card text-[22px] font-semibold text-warm-900 flex items-center justify-center cursor-pointer active:scale-95 active:bg-warm-50 transition-all duration-100"
              >
                {key}
              </button>
            );
          },
        )}
      </div>
    </div>
  );
}
