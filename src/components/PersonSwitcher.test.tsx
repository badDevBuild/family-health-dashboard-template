import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PersonSwitcher } from "./PersonSwitcher";
import type { HealthStatus } from "../shared/types";

const mockMembers: { name: string; status: HealthStatus }[] = [
  { name: "示例成员甲", status: "attention" },
  { name: "示例成员乙", status: "attention" },
  { name: "示例成员丙", status: "normal" },
];

describe("PersonSwitcher", () => {
  it("显示所有家庭成员的头像", () => {
    render(
      <PersonSwitcher
        members={mockMembers}
        activeIndex={0}
        onSelect={() => {}}
      />,
    );
    // 每个成员的最后一个字作为头像文字
    expect(screen.getByText("甲")).toBeInTheDocument();
    expect(screen.getByText("乙")).toBeInTheDocument();
    expect(screen.getByText("丙")).toBeInTheDocument();
  });

  it("当前选中的头像有 active 样式", () => {
    render(
      <PersonSwitcher
        members={mockMembers}
        activeIndex={0}
        onSelect={() => {}}
      />,
    );
    const activeAvatar = screen.getByText("甲").closest("[data-testid]");
    expect(activeAvatar?.getAttribute("data-active")).toBe("true");
  });

  it("未选中的头像没有 active 样式", () => {
    render(
      <PersonSwitcher
        members={mockMembers}
        activeIndex={0}
        onSelect={() => {}}
      />,
    );
    const inactiveAvatar = screen.getByText("乙").closest("[data-testid]");
    expect(inactiveAvatar?.getAttribute("data-active")).toBe("false");
  });

  it("点击头像触发 onSelect 回调", () => {
    const onSelect = vi.fn();
    render(
      <PersonSwitcher
        members={mockMembers}
        activeIndex={0}
        onSelect={onSelect}
      />,
    );
    fireEvent.click(screen.getByText("乙"));
    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it("头像显示状态圆点", () => {
    render(
      <PersonSwitcher
        members={mockMembers}
        activeIndex={0}
        onSelect={() => {}}
      />,
    );
    const avatars = screen.getAllByTestId("avatar");
    // 前两个成员是 attention 状态
    expect(
      avatars[0].querySelector("[data-status]")?.getAttribute("data-status"),
    ).toBe("attention");
    // 第三个成员是 normal
    expect(
      avatars[2].querySelector("[data-status]")?.getAttribute("data-status"),
    ).toBe("normal");
  });
});
