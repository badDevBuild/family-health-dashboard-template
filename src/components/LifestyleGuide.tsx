import { EmptyState } from "./EmptyState";

// 根据当前月份返回季节 key
function getCurrentSeason(): "spring" | "summer" | "autumn" | "winter" {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 9) return "summer";
  if (month >= 10 && month <= 11) return "autumn";
  return "winter";
}

const SEASON_LABELS: Record<string, string> = {
  spring: "春季",
  summer: "夏季",
  autumn: "秋季",
  winter: "冬季",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function LifestyleGuide({ data }: { data: Record<string, any> | null }) {
  if (!data) {
    return <EmptyState message="暂无已审核的生活指南；这不代表后台正在生成" />;
  }

  const season = getCurrentSeason();
  const seasonTip = data.seasonalTips?.[season];

  return (
    <div className="flex flex-col gap-3">
      {/* 数据充分度提示 */}
      {data.dataConfidence === "insufficient" && (
        <div className="bg-[#E8F0F7] rounded-[--radius-lg] px-4 py-3 text-sm text-[#5B8DB8]">
          以下为基于年龄性别的通用建议，非基于体检数据
        </div>
      )}
      {data.dataConfidence === "partial" && (
        <div className="bg-[#FDF4E3] rounded-[--radius-lg] px-4 py-3 text-sm text-[#D4910A]">
          部分建议基于体检数据，部分为通用建议
        </div>
      )}

      {/* 最重要的事 */}
      {data.topPriorities?.length > 0 && (
        <section className="bg-[#E8F5EE] rounded-[--radius-lg] p-4">
          <div className="text-xs font-semibold text-[#3B9B6F] mb-3">
            最重要的事
          </div>
          <div className="flex flex-col gap-3">
            {data.topPriorities.map((p: any, i: number) => (
              <div key={i}>
                <div className="text-[15px] font-semibold text-warm-900">
                  {p.rank}. {p.action}
                </div>
                <div className="text-sm text-warm-600 mt-1 leading-relaxed">
                  {p.why}
                </div>
                <div className="text-sm text-[#3B9B6F] mt-1">
                  → {p.howToStart}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 运动指南 */}
      {data.exerciseGuide && (
        <section className="bg-white rounded-[--radius-lg] p-4 shadow-card">
          <div className="text-xs font-semibold text-warm-400 mb-1">
            运动指南
          </div>
          <div className="text-sm text-warm-600 mb-3">
            {data.exerciseGuide.overview}
          </div>
          <div className="flex flex-col gap-3">
            {data.exerciseGuide.weeklyPlan?.map((item: any, i: number) => (
              <div key={i} className="bg-warm-50 rounded-[--radius-md] p-3">
                <div className="text-[15px] font-semibold text-warm-900">
                  {item.activity}
                </div>
                <div className="text-sm text-warm-600 mt-1">
                  {item.frequency} · {item.duration}
                </div>
                {item.intensity && (
                  <div className="text-xs text-warm-400 mt-1">
                    强度: {item.intensity}
                  </div>
                )}
                {item.localTip && (
                  <div className="text-xs text-[#5B8DB8] mt-1.5">
                    📍 {item.localTip}
                  </div>
                )}
              </div>
            ))}
          </div>
          {data.exerciseGuide.avoidOrCaution?.length > 0 && (
            <div className="mt-3 bg-[#FDF4E3] rounded-[--radius-md] p-3">
              <div className="text-xs font-medium text-[#D4910A] mb-1">
                注意事项
              </div>
              {data.exerciseGuide.avoidOrCaution.map(
                (note: string, i: number) => (
                  <div
                    key={i}
                    className="text-sm text-warm-600 leading-relaxed"
                  >
                    · {note}
                  </div>
                ),
              )}
            </div>
          )}
        </section>
      )}

      {/* 饮食指南 */}
      {data.dietGuide && (
        <section className="bg-white rounded-[--radius-lg] p-4 shadow-card">
          <div className="text-xs font-semibold text-warm-400 mb-1">
            饮食指南
          </div>
          {data.dietGuide.culturalAdaptation && (
            <div className="text-sm text-warm-600 mb-3 leading-relaxed bg-[#E8F5EE] rounded-[--radius-md] p-3">
              {data.dietGuide.culturalAdaptation}
            </div>
          )}

          {/* 三餐结构 */}
          {data.dietGuide.mealStructure?.map((meal: any, i: number) => (
            <div key={i} className="mb-3">
              <div className="text-sm font-semibold text-warm-900">
                {meal.meal}
              </div>
              <div className="text-sm text-warm-600 mt-0.5">
                {meal.recommendation}
              </div>
              {meal.avoid && (
                <div className="text-xs text-[#C75C3A] mt-1">
                  避免: {meal.avoid}
                </div>
              )}
              {meal.culturalNote && (
                <div className="text-xs text-[#5B8DB8] mt-1">
                  💡 {meal.culturalNote}
                </div>
              )}
            </div>
          ))}

          {/* 食材替换 */}
          {data.dietGuide.keyFoodSwaps?.length > 0 && (
            <div className="mt-2 pt-3 border-t border-warm-200">
              <div className="text-xs font-semibold text-warm-400 mb-2">
                食材替换
              </div>
              {data.dietGuide.keyFoodSwaps.map((swap: any, i: number) => (
                <div key={i} className="mb-2 text-sm">
                  <span className="text-warm-400 line-through">
                    {swap.from}
                  </span>
                  <span className="text-warm-400 mx-1.5">→</span>
                  <span className="text-[#3B9B6F] font-medium">{swap.to}</span>
                </div>
              ))}
            </div>
          )}

          {/* 重要警示 */}
          {data.dietGuide.importantWarnings?.map((w: any, i: number) => (
            <div
              key={i}
              className="mt-2 bg-[#FBEAE4] rounded-[--radius-md] p-3"
            >
              <div className="text-xs font-medium text-[#C75C3A]">
                {w.topic}
              </div>
              <div className="text-sm text-warm-600 mt-1">{w.detail}</div>
            </div>
          ))}

          {/* 牛羊肉指南 */}
          {data.dietGuide.beefLambGuide && (
            <div className="mt-2 bg-warm-50 rounded-[--radius-md] p-3">
              <div className="text-xs font-semibold text-warm-400 mb-1">
                {data.dietGuide.beefLambGuide.overview}
              </div>
              {data.dietGuide.beefLambGuide.recommendations?.map(
                (r: string, i: number) => (
                  <div key={i} className="text-sm text-warm-600">
                    · {r}
                  </div>
                ),
              )}
            </div>
          )}
        </section>
      )}

      {/* 营养补充 */}
      {data.supplementGuide?.length > 0 && (
        <section className="bg-white rounded-[--radius-lg] p-4 shadow-card">
          <div className="text-xs font-semibold text-warm-400 mb-3">
            营养补充
          </div>
          <div className="flex flex-col gap-3">
            {data.supplementGuide.map((s: any, i: number) => (
              <div key={i}>
                <div className="text-[15px] font-semibold text-warm-900">
                  {s.name}
                </div>
                <div className="text-sm text-warm-600 mt-0.5">
                  {s.suggestion}
                </div>
                {s.note && (
                  <div className="text-xs text-warm-400 mt-1">{s.note}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 季节提醒 */}
      {seasonTip && (
        <section className="bg-[#E8F0F7] rounded-[--radius-lg] p-4">
          <div className="text-xs font-semibold text-[#5B8DB8] mb-1">
            {SEASON_LABELS[season]}提醒
          </div>
          <div className="text-sm text-warm-600 leading-relaxed">
            {seasonTip}
          </div>
        </section>
      )}
    </div>
  );
}
