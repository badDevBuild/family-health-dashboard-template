import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TimelineItem } from "./TimelineItem";

describe("TimelineItem", () => {
  const props = {
    date: "2025-03-19",
    title: "年度体检",
    subtitle: "示例成员乙 · 示例体检中心",
    organTags: ["心血管", "血液", "肝胆"],
  };

  it("显示日期的日部分", () => {
    render(<TimelineItem {...props} />);
    expect(screen.getByText("19")).toBeInTheDocument();
  });

  it("显示日期的月部分", () => {
    render(<TimelineItem {...props} />);
    expect(screen.getByText("3月")).toBeInTheDocument();
  });

  it("显示日期的年部分", () => {
    render(<TimelineItem {...props} />);
    expect(screen.getByText("2025")).toBeInTheDocument();
  });

  it("显示事件标题", () => {
    render(<TimelineItem {...props} />);
    expect(screen.getByText("年度体检")).toBeInTheDocument();
  });

  it("显示事件副标题", () => {
    render(<TimelineItem {...props} />);
    expect(screen.getByText("示例成员乙 · 示例体检中心")).toBeInTheDocument();
  });

  it("显示器官标签", () => {
    render(<TimelineItem {...props} />);
    expect(screen.getByText("心血管")).toBeInTheDocument();
    expect(screen.getByText("血液")).toBeInTheDocument();
    expect(screen.getByText("肝胆")).toBeInTheDocument();
  });
});
