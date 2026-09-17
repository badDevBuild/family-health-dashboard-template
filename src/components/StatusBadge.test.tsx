import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
  it("正常状态显示'正常'文本", () => {
    render(<StatusBadge status="normal" />);
    expect(screen.getByText("正常")).toBeInTheDocument();
  });

  it("关注状态显示'需关注'文本", () => {
    render(<StatusBadge status="attention" />);
    expect(screen.getByText("需关注")).toBeInTheDocument();
  });

  it("警示状态显示'建议就医'文本", () => {
    render(<StatusBadge status="alert" />);
    expect(screen.getByText("建议就医")).toBeInTheDocument();
  });

  it("正常状态使用绿色样式", () => {
    render(<StatusBadge status="normal" />);
    const badge = screen.getByText("正常");
    expect(badge.className).toContain("status-normal");
  });

  it("关注状态使用琥珀色样式", () => {
    render(<StatusBadge status="attention" />);
    const badge = screen.getByText("需关注");
    expect(badge.className).toContain("status-attention");
  });

  it("警示状态使用赭石色样式", () => {
    render(<StatusBadge status="alert" />);
    const badge = screen.getByText("建议就医");
    expect(badge.className).toContain("status-alert");
  });
});
