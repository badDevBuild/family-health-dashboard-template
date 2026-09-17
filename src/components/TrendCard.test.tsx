import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TrendCard } from "./TrendCard";

describe("TrendCard", () => {
  it("标记为不可比较时不根据数字擅自显示升降箭头", () => {
    render(
      <TrendCard
        indicator={{
          name: "方法变化指标",
          latestValue: 7,
          unit: "示例单位",
          trend: "not-comparable",
          isAbnormal: false,
          history: [
            { date: "2025-01-01", value: 5 },
            { date: "2026-01-01", value: 7 },
          ],
        }}
      />,
    );
    expect(screen.queryByText("↑")).not.toBeInTheDocument();
    expect(screen.queryByText("↓")).not.toBeInTheDocument();
  });
});
