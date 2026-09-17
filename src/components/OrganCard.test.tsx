import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { OrganCard } from "./OrganCard";

const mockCardProps = {
  organ: "心血管" as const,
  icon: "♡",
  status: "attention" as const,
  indicators: [
    {
      name: "示例指标甲",
      value: "10",
      unit: "示例单位",
      trend: "up" as const,
      history: [6, 7, 8, 9, 10],
    },
    {
      name: "示例指标乙",
      value: "8",
      unit: "示例单位",
      trend: "up" as const,
      history: [4, 5, 6, 7, 8],
    },
  ],
};

describe("OrganCard", () => {
  it("显示器官名称", () => {
    render(<OrganCard {...mockCardProps} />);
    expect(screen.getByText("心血管")).toBeInTheDocument();
  });

  it("显示器官图标", () => {
    render(<OrganCard {...mockCardProps} />);
    expect(screen.getByText("♡")).toBeInTheDocument();
  });

  it("显示状态标签", () => {
    render(<OrganCard {...mockCardProps} />);
    expect(screen.getByText("需关注")).toBeInTheDocument();
  });

  it("显示指标名称", () => {
    render(<OrganCard {...mockCardProps} />);
    expect(screen.getByText("示例指标甲")).toBeInTheDocument();
    expect(screen.getByText("示例指标乙")).toBeInTheDocument();
  });

  it("显示指标值和单位", () => {
    render(<OrganCard {...mockCardProps} />);
    expect(screen.getByText(/10/)).toBeInTheDocument();
    expect(screen.getAllByText(/示例单位/)).toHaveLength(2);
  });

  it("上升趋势显示向上箭头", () => {
    render(<OrganCard {...mockCardProps} />);
    const arrows = screen.getAllByText("↑");
    expect(arrows.length).toBeGreaterThan(0);
  });

  it("渲染 sparkline", () => {
    render(<OrganCard {...mockCardProps} />);
    const sparklines = screen.getAllByTestId("sparkline");
    expect(sparklines.length).toBe(2);
  });

  it("正常状态显示正常标签", () => {
    render(
      <OrganCard
        organ="肾脏/泌尿"
        icon="◉"
        status="normal"
        indicators={[
          {
            name: "示例指标丙",
            value: "5",
            unit: "示例单位",
            trend: "stable",
            history: [5],
          },
        ]}
      />,
    );
    expect(screen.getByText("正常")).toBeInTheDocument();
  });

  it("下降趋势显示向下箭头", () => {
    render(
      <OrganCard
        organ="肝胆"
        icon="◆"
        status="normal"
        indicators={[
          {
            name: "示例指标丁",
            value: "4",
            unit: "示例单位",
            trend: "down",
            history: [8, 7, 6, 4],
          },
        ]}
      />,
    );
    expect(screen.getByText("↓")).toBeInTheDocument();
  });

  it("稳定趋势显示横线符号", () => {
    render(
      <OrganCard
        organ="肾脏/泌尿"
        icon="◉"
        status="normal"
        indicators={[
          {
            name: "示例指标戊",
            value: "5",
            unit: "示例单位",
            trend: "stable",
            history: [5],
          },
        ]}
      />,
    );
    expect(screen.getByText("→")).toBeInTheDocument();
  });
});
