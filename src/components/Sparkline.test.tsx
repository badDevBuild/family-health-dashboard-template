import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Sparkline } from "./Sparkline";

describe("Sparkline", () => {
  it("渲染 Unicode 方块字符表示趋势", () => {
    render(<Sparkline values={[1, 2, 3, 4, 5]} />);
    const el = screen.getByTestId("sparkline");
    // 应该包含方块字符
    expect(el.textContent).toMatch(/[▁▂▃▄▅▆▇]/);
  });

  it("值越大方块越高", () => {
    render(<Sparkline values={[1, 5]} />);
    const text = screen.getByTestId("sparkline").textContent!;
    // 第一个字符应该比第二个矮
    const blocks = "▁▂▃▄▅▆▇";
    const first = blocks.indexOf(text[0]);
    const second = blocks.indexOf(text[1]);
    expect(second).toBeGreaterThan(first);
  });

  it("所有值相同时显示中等高度的方块", () => {
    render(<Sparkline values={[3, 3, 3]} />);
    const text = screen.getByTestId("sparkline").textContent!;
    // 所有字符应该相同
    expect(new Set(text.split("")).size).toBe(1);
  });

  it("空数组不渲染", () => {
    const { container } = render(<Sparkline values={[]} />);
    expect(container.textContent).toBe("");
  });

  it("单个值显示单个方块", () => {
    render(<Sparkline values={[42]} />);
    const text = screen.getByTestId("sparkline").textContent!;
    expect(text.length).toBe(1);
  });
});
