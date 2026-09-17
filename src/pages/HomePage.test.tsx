import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { HomePage } from "./HomePage";

function renderHomePage() {
  return render(
    <MemoryRouter initialEntries={["/dashboard?person=示例成员甲"]}>
      <HomePage />
    </MemoryRouter>,
  );
}

describe("HomePage", () => {
  it("显示当前成员的名字", () => {
    renderHomePage();
    expect(screen.getByText("示例成员甲")).toBeInTheDocument();
  });

  it("显示返回主页按钮", () => {
    renderHomePage();
    expect(screen.getByLabelText("返回主页")).toBeInTheDocument();
  });

  it("显示三个 Tab", () => {
    renderHomePage();
    expect(screen.getByText("身体")).toBeInTheDocument();
    expect(screen.getByText("时间线")).toBeInTheDocument();
    expect(screen.getByText("生活指南")).toBeInTheDocument();
  });

  it("默认选中'身体' Tab", () => {
    renderHomePage();
    const bodyTab = screen.getByText("身体");
    expect(bodyTab.getAttribute("data-active")).toBe("true");
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
    expect(screen.getByText("肝胆")).toBeInTheDocument();
  });
});
