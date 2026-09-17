import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { OrganDetailPage } from "./OrganDetailPage";

function renderOrganDetail(organ: string, person = "示例成员乙") {
  return render(
    <MemoryRouter
      initialEntries={[
        `/organ/${encodeURIComponent(organ)}?person=${encodeURIComponent(person)}`,
      ]}
    >
      <Routes>
        <Route path="/organ/:organ" element={<OrganDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("OrganDetailPage", () => {
  it("显示器官名称作为标题", () => {
    renderOrganDetail("血液");
    expect(screen.getByText("血液")).toBeInTheDocument();
  });

  it("显示返回按钮", () => {
    renderOrganDetail("血液");
    expect(screen.getByLabelText("返回")).toBeInTheDocument();
  });

  it("显示综合分析叙事卡片", () => {
    renderOrganDetail("血液");
    expect(screen.getByText("综合分析")).toBeInTheDocument();
    expect(screen.getByTestId("narrative-card")).toHaveTextContent(
      /贫血|血红蛋白/,
    );
  });

  it("显示状态标签", () => {
    renderOrganDetail("血液");
    expect(screen.getByText("需关注")).toBeInTheDocument();
  });

  it("无数据的器官显示空状态", () => {
    renderOrganDetail("消化");
    expect(screen.getByText(/暂无/)).toBeInTheDocument();
  });

  it("示例成员甲的代谢分析包含血糖相关内容", () => {
    renderOrganDetail("代谢/内分泌", "示例成员甲");
    expect(screen.getByTestId("narrative-card")).toHaveTextContent(
      /血糖|代谢/,
    );
  });
});
