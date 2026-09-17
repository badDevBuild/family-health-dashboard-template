import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { HomePage } from "./HomePage";

function renderHomePage() {
  return render(
    <MemoryRouter initialEntries={["/dashboard?person=demo-a"]}>
      <HomePage />
    </MemoryRouter>,
  );
}

describe("HomePage", () => {
  it("显示当前成员的名字", () => {
    renderHomePage();
    expect(screen.getAllByText("示例成员甲").length).toBeGreaterThanOrEqual(1);
  });

  it("显示返回主页按钮", () => {
    renderHomePage();
    expect(screen.getByLabelText("返回主页")).toBeInTheDocument();
  });

  it("显示四个 Tab", () => {
    renderHomePage();
    expect(screen.getByText("下一步")).toBeInTheDocument();
    expect(screen.getByText("身体")).toBeInTheDocument();
    expect(screen.getByText("时间线")).toBeInTheDocument();
    expect(screen.getByText("生活指南")).toBeInTheDocument();
  });

  it("默认优先显示'下一步' Tab", () => {
    renderHomePage();
    const actionTab = screen.getByText("下一步");
    expect(actionTab.getAttribute("data-active")).toBe("true");
    expect(screen.getByText("AI 提出，待医生确认")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "查看检查依据 1" })).toHaveAttribute(
      "href",
      "/event/demo-a%3Aenc-2026-01-12-a?person=demo-a",
    );
  });

  it("切换到'时间线' Tab", () => {
    renderHomePage();
    fireEvent.click(screen.getByText("时间线"));
    const timelineTab = screen.getByText("时间线");
    expect(timelineTab.getAttribute("data-active")).toBe("true");
  });

  it("切换到'生活指南' Tab", () => {
    renderHomePage();
    fireEvent.click(screen.getByText("生活指南"));
    const lifestyleTab = screen.getByText("生活指南");
    expect(lifestyleTab.getAttribute("data-active")).toBe("true");
  });

  it("示例成员有器官卡片数据（虚构数据）", () => {
    renderHomePage();
    fireEvent.click(screen.getByText("身体"));
    expect(screen.getByText("肝胆")).toBeInTheDocument();
  });

  it("醒目标注当前为虚构演示数据", () => {
    renderHomePage();
    expect(screen.getByText(/所有人物、机构、日期和数值均为虚构数据/)).toBeInTheDocument();
  });
});
