import { BUILD_METADATA } from "@health-data";

export function DemoBanner() {
  if (BUILD_METADATA.mode !== "demo") return null;
  return (
    <div role="status" className="mx-5 mt-3 rounded-[--radius-md] bg-[#E8F0F7] px-4 py-3 text-base leading-relaxed text-[#466F91]">
      演示环境：所有人物、机构、日期和数值均为虚构数据。
    </div>
  );
}
