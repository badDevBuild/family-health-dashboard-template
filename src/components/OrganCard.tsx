import type { HealthStatus } from "../shared/types";
import { StatusBadge } from "./StatusBadge";
import { Sparkline } from "./Sparkline";

interface IndicatorDisplay {
  name: string;
  value: string;
  unit: string;
  trend: string;
  history: number[];
}

interface OrganCardProps {
  organ: string;
  icon: string;
  status: string;
  indicators: IndicatorDisplay[];
  onClick?: () => void;
}

const TREND_ARROWS: Record<string, { symbol: string; className: string }> = {
  up: { symbol: "↑", className: "text-warm-400" },
  down: { symbol: "↓", className: "text-warm-400" },
  stable: { symbol: "→", className: "text-warm-400" },
};

function getTrend(trend: string) {
  // 这里只表达受数据契约约束的数值方向；解释性词语不转换为箭头。
  return TREND_ARROWS[trend] || null;
}

const ICON_BG: Record<string, string> = {
  normal: "bg-status-normal-bg",
  attention: "bg-status-attention-bg",
  alert: "bg-status-alert-bg",
  warning: "bg-status-attention-bg",
};

export function OrganCard({
  organ,
  icon,
  status,
  indicators,
  onClick,
}: OrganCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left bg-white rounded-[--radius-lg] p-4 shadow-[--shadow-card] hover:shadow-[--shadow-card-hover] active:scale-[0.98] transition-all duration-200 cursor-pointer"
    >
      {/* 头部：图标 + 名称 + 状态标签 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-[10px] flex items-center justify-center text-lg ${ICON_BG[status] || "bg-status-attention-bg"}`}
          >
            {icon}
          </div>
          <span className="text-base font-semibold">{organ}</span>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* 指标行 */}
      <div className="flex gap-3">
        {indicators.map((ind) => {
          const trend = getTrend(ind.trend);
          return (
            <div key={ind.name} className="flex-1">
              <div className="text-sm text-warm-400 mb-0.5">{ind.name}</div>
              <div className="text-lg font-semibold tabular-nums tracking-tight">
                {ind.value}
                <span className="text-xs text-warm-400 ml-1">{ind.unit}</span>
                {trend && (
                  <span className={`text-xs ml-1 ${trend.className}`}>
                    {trend.symbol}
                  </span>
                )}
                {ind.trend !== "not-comparable" && ind.history.length > 1 && (
                  <span className="ml-1.5">
                    <Sparkline values={ind.history} />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </button>
  );
}
