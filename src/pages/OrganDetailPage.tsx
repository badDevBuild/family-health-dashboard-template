import { useParams, useSearchParams } from "react-router-dom";
import { StatusBadge } from "../components/StatusBadge";
import { BackButton } from "../components/BackButton";
import { NarrativeCard } from "../components/NarrativeCard";
import { TrendCard } from "../components/TrendCard";
import { getAnalysis } from "@health-data";
import { ORGAN_SYSTEMS } from "../shared/organs";

export function OrganDetailPage() {
  const { organ } = useParams<{ organ: string }>();
  const [searchParams] = useSearchParams();

  const personId = searchParams.get("person") || "";
  const organName = decodeURIComponent(organ || "");

  const analysis = getAnalysis(personId);
  const organAnalysis = analysis?.organAnalyses.find(
    (item) => item.organ === organName,
  );
  const organConfig = ORGAN_SYSTEMS.find((o) => o.name === organName);

  // 筛选与当前器官相关的跨器官洞察
  const relevantInsights =
    analysis?.crossOrganInsights?.filter(
      (insight) =>
        insight.includes(organName) ||
        // 肝胆相关的洞察包含"脂肪肝"
        (organName === "肝胆" && insight.includes("脂肪肝")) ||
        // 心血管相关的洞察包含"胆固醇"
        (organName === "心血管" && insight.includes("胆固醇")) ||
        // 血液相关的洞察包含"贫血"
        (organName === "血液" && insight.includes("贫血")),
    ) || [];

  return (
    <div className="max-w-[430px] mx-auto min-h-screen">
      {/* 头部 */}
      <div className="px-5 pt-4 pb-2">
        <BackButton />
      </div>
      <div className="flex items-center justify-between px-5 pb-3">
        <div className="flex items-center gap-2">
          {organConfig && <span className="text-xl">{organConfig.icon}</span>}
          <span className="text-xl font-bold">{organName}</span>
        </div>
        {organAnalysis && <StatusBadge status={organAnalysis.status} />}
      </div>

      <div className="px-5 pb-8">
        {!organAnalysis ? (
          <div className="text-center text-warm-400 py-16">
            暂无该器官系统的检查数据
          </div>
        ) : (
          <>
            {/* 综合分析叙事 */}
            <NarrativeCard text={organAnalysis.narrative} />

            {/* 关键指标趋势 */}
            {organAnalysis.keyIndicators.length > 0 && (
              <div className="flex flex-col gap-3 mb-4">
                {organAnalysis.keyIndicators.map((ind) => (
                  <TrendCard key={ind.name} indicator={ind} />
                ))}
              </div>
            )}

            {/* 跨器官关联 */}
            {relevantInsights.length > 0 && (
              <div className="mt-4">
                <div className="text-xs font-semibold text-warm-400 mb-2">
                  跨器官关联
                </div>
                <div className="flex flex-col gap-2">
                  {relevantInsights.map((insight, i) => (
                    <div
                      key={i}
                      className="text-sm text-warm-600 bg-status-info-bg rounded-[--radius-md] p-3"
                    >
                      {insight}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
