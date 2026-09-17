import { BUILD_METADATA } from "@health-data";

export function DemoBanner() {
  if (BUILD_METADATA.mode !== "demo") return null;
  return (
    <div role="status" className="rounded-[--radius-lg] border border-[#D8E7DF] bg-white/80 px-4 py-3 text-sm leading-relaxed text-warm-600 shadow-card backdrop-blur-sm">
      <span className="mr-2 inline-flex rounded-full bg-primary-light px-2 py-0.5 text-xs font-semibold text-primary">演示</span>
      页面中的人物、机构和健康数据均为虚构。
    </div>
  );
}
