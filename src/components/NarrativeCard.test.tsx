import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NarrativeCard } from "./NarrativeCard";

describe("NarrativeCard", () => {
  it("显示'综合分析'标签", () => {
    render(<NarrativeCard text="测试分析内容" />);
    expect(screen.getByText("综合分析")).toBeInTheDocument();
  });

  it("显示分析叙事内容", () => {
    const text = "示例指标略有变化，建议结合后续复查理解。";
    render(<NarrativeCard text={text} />);
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it("有左侧绿色边框样式", () => {
    render(<NarrativeCard text="内容" />);
    const card = screen.getByTestId("narrative-card");
    expect(card.className).toContain("border-l");
  });

  it("保留解释性分析的段落，让指标含义与建议分开阅读", () => {
    render(<NarrativeCard text={"眼球前后的长度叫眼轴。\n\n\n建议带检查单咨询眼科。"} />);
    const card = screen.getByTestId("narrative-card");
    const paragraphs = card.querySelectorAll("p");
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0]).toHaveTextContent("眼球前后的长度叫眼轴。");
    expect(paragraphs[1]).toHaveTextContent("建议带检查单咨询眼科。");
  });
});
