import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { EventDetailPage } from "./EventDetailPage";

function renderEventDetail(eventId: string, person = "demo-b") {
  return render(
    <MemoryRouter
      initialEntries={[
        `/event/${encodeURIComponent(eventId)}?person=${encodeURIComponent(person)}`,
      ]}
    >
      <Routes>
        <Route path="/event/:eventId" element={<EventDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("EventDetailPage", () => {
  it("显示返回按钮", () => {
    renderEventDetail("demo-b:enc-2026-02-18-b");
    expect(screen.getByLabelText("返回")).toBeInTheDocument();
  });

  it("显示事件日期", () => {
    renderEventDetail("demo-b:enc-2026-02-18-b");
    const matches = screen.getAllByText(/2026-02-18/);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("显示医院名称", () => {
    renderEventDetail("demo-b:enc-2026-02-18-b");
    expect(screen.getByText(/示例体检中心/)).toBeInTheDocument();
  });

  it("按器官分组显示指标", () => {
    renderEventDetail("demo-b:enc-2026-02-18-b");
    expect(screen.getByText("心血管")).toBeInTheDocument();
  });

  it("显示指标名称和值", () => {
    renderEventDetail("demo-b:enc-2026-02-18-b");
    expect(screen.getByText("收缩压")).toBeInTheDocument();
  });

  it("同名指标渲染时不产生重复 key warning", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    try {
      renderEventDetail("demo-b:enc-2026-02-18-b");
      const duplicateKeyWarnings = errorSpy.mock.calls.filter((call) =>
        call.join(" ").includes("Encountered two children with the same key"),
      );

      expect(duplicateKeyWarnings).toHaveLength(0);
    } finally {
      errorSpy.mockRestore();
    }
  });

  it("另一位示例成员的事件也能正常显示", () => {
    renderEventDetail("demo-a:enc-2026-01-12-a", "demo-a");
    expect(screen.getByText(/示例社区医院/)).toBeInTheDocument();
  });
});
