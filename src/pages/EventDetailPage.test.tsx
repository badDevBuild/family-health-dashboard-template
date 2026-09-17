import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { EventDetailPage } from "./EventDetailPage";

function renderEventDetail(eventId: string, person = "demo-mother") {
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
    renderEventDetail("demo-mother:enc-2026-mother");
    expect(screen.getByLabelText("返回")).toBeInTheDocument();
  });

  it("显示事件日期", () => {
    renderEventDetail("demo-mother:enc-2026-mother");
    const matches = screen.getAllByText(/2026-04-18/);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("显示医院名称", () => {
    renderEventDetail("demo-mother:enc-2026-mother");
    expect(screen.getByText(/安和市女性健康中心/)).toBeInTheDocument();
  });

  it("按器官分组显示指标", () => {
    renderEventDetail("demo-mother:enc-2026-mother");
    expect(screen.getByText("血液")).toBeInTheDocument();
  });

  it("显示指标名称和值", () => {
    renderEventDetail("demo-mother:enc-2026-mother");
    expect(screen.getByText("血红蛋白")).toBeInTheDocument();
  });

  it("同名指标渲染时不产生重复 key warning", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    try {
      renderEventDetail("demo-mother:enc-2026-mother");
      const duplicateKeyWarnings = errorSpy.mock.calls.filter((call) =>
        call.join(" ").includes("Encountered two children with the same key"),
      );

      expect(duplicateKeyWarnings).toHaveLength(0);
    } finally {
      errorSpy.mockRestore();
    }
  });

  it("另一位家庭成员的事件也能正常显示", () => {
    renderEventDetail("demo-father:enc-2026-father", "demo-father");
    expect(screen.getByText(/安和市家庭健康中心/)).toBeInTheDocument();
  });

  it("显示医生确认的病例摘要和报告证据", () => {
    renderEventDetail("demo-father:enc-2025-father-liver-followup", "demo-father");
    expect(screen.getByText("病例摘要")).toBeInTheDocument();
    expect(screen.getByText("轻度脂肪肝")).toBeInTheDocument();
    expect(screen.getByText("医生已确认")).toBeInTheDocument();
    expect(
      screen.getAllByText(/report-father-liver-2025 · 第 1 页/).length,
    ).toBeGreaterThanOrEqual(1);
  });
});
