import { BUILD_METADATA } from "@health-data";

export function DemoBanner() {
  if (BUILD_METADATA.mode !== "demo") return null;

  return (
    <p role="status" className="text-xs leading-relaxed text-warm-400">
      演示页面中的人物、机构和健康数据均为虚构
    </p>
  );
}
