import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { FamilyHomePage } from "./FamilyHomePage";

describe("FamilyHomePage", () => {
  it("展示五位家庭成员和各自头像", () => {
    render(
      <MemoryRouter>
        <FamilyHomePage />
      </MemoryRouter>,
    );

    for (const name of ["林远山", "苏青禾", "林松年", "周瑞云", "林小满"]) {
      expect(screen.getByRole("button", { name: new RegExp(name) })).toBeInTheDocument();
      expect(screen.getByAltText(`${name}的插画头像`)).toBeInTheDocument();
    }
  });

  it("只在家庭首页集中显示一次演示说明", () => {
    render(
      <MemoryRouter>
        <FamilyHomePage />
      </MemoryRouter>,
    );

    expect(screen.getAllByText(/页面中的人物、机构和健康数据均为虚构/)).toHaveLength(1);
  });
});
