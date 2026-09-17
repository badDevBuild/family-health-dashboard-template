import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PinGate } from "./PinGate";

describe("PinGate", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("页面重新聚焦时会复查会话，失效后立即卸载私有内容", async () => {
    vi.stubEnv("VITE_AUTH_ENABLED", "true");
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce({ ok: false });
    vi.stubGlobal("fetch", fetchMock);

    render(<PinGate><div>私有内容</div></PinGate>);
    expect(await screen.findByText("私有内容")).toBeInTheDocument();

    fireEvent.focus(window);
    await waitFor(() => expect(screen.queryByText("私有内容")).not.toBeInTheDocument());
    expect(screen.getByText("请输入访问密码")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
