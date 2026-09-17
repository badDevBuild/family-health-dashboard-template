import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { HomePage } from "./HomePage";

function renderHomePage() {
  return render(
    <MemoryRouter initialEntries={["/dashboard?person=demo-father"]}>
      <HomePage />
    </MemoryRouter>,
  );
}

describe("HomePage", () => {
  it("显示当前成员的名字", () => {
    renderHomePage();
    expect(screen.getAllByText("林远山").length).toBeGreaterThanOrEqual(1);
  });

  it("显示返回主页按钮", () => {
    renderHomePage();
    expect(screen.getByLabelText("返回主页")).toBeInTheDocument();
  });

  it("显示与生产页一致的三个 Tab", () => {
    renderHomePage();
    expect(screen.getByText("身体")).toBeInTheDocument();
    expect(screen.getByText("时间线")).toBeInTheDocument();
    expect(screen.getByText("生活指南")).toBeInTheDocument();
    expect(screen.queryByText("下一步")).not.toBeInTheDocument();
  });

  it("默认显示'身体' Tab", () => {
    renderHomePage();
    const bodyTab = screen.getByText("身体");
    expect(bodyTab.getAttribute("data-active")).toBe("true");
    expect(screen.getByText("肝胆")).toBeInTheDocument();
  });

  it("切换到'时间线' Tab", () => {
    renderHomePage();
    fireEvent.click(screen.getByText("时间线"));
    const timelineTab = screen.getByText("时间线");
    expect(timelineTab.getAttribute("data-active")).toBe("true");
    expect(screen.getByText("脂肪肝复查")).toBeInTheDocument();
  });

  it("切换到'生活指南' Tab", () => {
    renderHomePage();
    fireEvent.click(screen.getByText("生活指南"));
    const lifestyleTab = screen.getByText("生活指南");
    expect(lifestyleTab.getAttribute("data-active")).toBe("true");
  });

  it("成员有多年器官趋势数据", () => {
    renderHomePage();
    expect(screen.getByText("肝胆")).toBeInTheDocument();
  });

  it("成员页不重复显示演示标识", () => {
    renderHomePage();
    expect(screen.queryByText(/页面中的人物、机构和健康数据均为虚构/)).not.toBeInTheDocument();
  });
});
