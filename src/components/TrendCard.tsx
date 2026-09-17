import type { IndicatorSummary } from "../shared/types";

function formatDate(dateStr: string) {
  // "2022-11-29" → "2022年11月"
  const parts = dateStr.split("-");
  if (parts.length >= 2) {
    return `${parts[0]}年${parseInt(parts[1])}月`;
  }
  return dateStr;
}

export function TrendCard({ indicator }: { indicator: IndicatorSummary }) {
  const { name, latestValue, unit, isAbnormal, history } = indicator;

  return (
    <div className="bg-white rounded-[--radius-lg] p-4 shadow-[--shadow-card]">
      <div className="text-sm text-warm-400 mb-1">{name}</div>
      <div className="text-2xl font-semibold tabular-nums">
        <span className={isAbnormal ? "text-status-attention" : ""}>
          {String(latestValue)}
        </span>
        {unit && (
          <span className="text-sm font-normal text-warm-400 ml-1">{unit}</span>
        )}
      </div>

      {/* 历史时间轴 */}
      {history.length > 1 && (
        <div className="mt-3 border-t border-warm-200 pt-3">
          <div className="text-xs text-warm-400 mb-2">历史变化</div>
          <div className="flex flex-col gap-1.5">
            {history.map((h, i) => {
              const isLast = i === history.length - 1;
              const isHighlighted = isLast && isAbnormal;
              return (
                <div key={h.date} className="flex items-center gap-2">
                  {/* 时间轴圆点 + 竖线 */}
                  <div className="flex flex-col items-center w-3 shrink-0">
                    <div
                      className={`w-2 h-2 rounded-full ${isLast ? "bg-primary" : "bg-warm-200"}`}
                    />
                  </div>
                  {/* 日期 */}
                  <div className="text-xs text-warm-400 w-20 shrink-0">
                    {formatDate(h.date)}
                  </div>
                  {/* 值 */}
                  <div
                    className={`text-sm tabular-nums font-medium ${isHighlighted ? "text-status-attention" : "text-warm-900"}`}
                  >
                    {String(h.value)}
                  </div>
                  {/* 变化箭头 */}
                  {i > 0 && (
                    <div className="text-xs text-warm-400">
                      {Number(h.value) > Number(history[i - 1].value)
                        ? "↑"
                        : Number(h.value) < Number(history[i - 1].value)
                          ? "↓"
                          : "—"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
