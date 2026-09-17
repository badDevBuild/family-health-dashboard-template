import { useParams, useSearchParams } from "react-router-dom";
import { BackButton } from "../components/BackButton";
import { getEvents, getMeasurements } from "@health-data";

const DIAGNOSIS_STATUS = {
  confirmed: {
    label: "医生已确认",
    className: "bg-status-info-bg text-status-info",
  },
  under_evaluation: {
    label: "评估中",
    className: "bg-status-attention-bg text-status-attention",
  },
  resolved: {
    label: "已恢复 / 已闭环",
    className: "bg-status-normal-bg text-status-normal",
  },
} as const;

export function EventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [searchParams] = useSearchParams();

  const personId = searchParams.get("person") || "";

  const events = getEvents(personId);
  const event = events.find((e) => e.id === eventId);
  const measurements = getMeasurements(personId, eventId || "");

  const abnormalCount = measurements.filter((m) => m.isAbnormal).length;

  // 按器官分组
  const organGroups = new Map<string, typeof measurements>();
  for (const m of measurements) {
    const organ = m.organs[0] || "其他";
    if (!organGroups.has(organ)) organGroups.set(organ, []);
    organGroups.get(organ)!.push(m);
  }

  return (
    <div className="max-w-[430px] mx-auto min-h-screen">
      {/* 头部 */}
      <div className="px-5 pt-4 pb-2">
        <BackButton />
      </div>
      <div className="px-5 pb-3">
        <span className="text-xl font-bold">
          {event
            ? `${event.date} ${event.title || (event.type === "体检" ? "年度体检" : "医院检查")}`
            : "事件详情"}
        </span>
      </div>

      <div className="px-5 pb-8">
        {!event ? (
          <div className="text-center text-warm-400 py-16">未找到该事件</div>
        ) : (
          <>
            {/* 事件信息 */}
            <div className="bg-white rounded-[--radius-lg] p-4 shadow-[--shadow-card] mb-4">
              <div className="text-base text-warm-600 space-y-1.5">
                <div>类型: {event.type}</div>
                <div>日期: {event.date}</div>
                <div>机构: {event.source}</div>
                <div>
                  指标: {measurements.length} 项，异常 {abnormalCount} 项
                </div>
                <div>
                  证据: {event.reports.map((report) => `${report.reportId}（第${report.pageRefs.join("、")}页）`).join("；")}
                </div>
              </div>
            </div>

            {(event.clinicalSummary || event.diagnoses.length > 0) && (
              <section
                className="bg-white rounded-[--radius-lg] p-4 shadow-[--shadow-card] mb-4"
                aria-labelledby="case-summary-heading"
              >
                <h2
                  id="case-summary-heading"
                  className="text-base font-semibold text-warm-900"
                >
                  病例摘要
                </h2>
                {event.clinicalSummary && (
                  <p className="mt-2 text-base leading-relaxed text-warm-600">
                    {event.clinicalSummary}
                  </p>
                )}
                {event.diagnoses.length > 0 && (
                  <div className="mt-4 flex flex-col gap-3">
                    {event.diagnoses.map((diagnosis) => {
                      const status = DIAGNOSIS_STATUS[diagnosis.status];
                      return (
                        <div
                          key={diagnosis.diagnosisId}
                          className="rounded-[--radius-md] bg-warm-50 p-3"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-base font-semibold text-warm-900">
                              {diagnosis.name}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}
                            >
                              {status.label}
                            </span>
                          </div>
                          {diagnosis.note && (
                            <p className="mt-1.5 text-sm leading-relaxed text-warm-600">
                              {diagnosis.note}
                            </p>
                          )}
                          <p className="mt-2 text-xs text-warm-400">
                            依据：{diagnosis.reportId} · 第 {diagnosis.page} 页
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {/* 按器官分组的指标列表 */}
            {Array.from(organGroups.entries()).map(
              ([organ, groupMeasurements]) => (
                <div key={organ} className="mb-4">
                  <div className="text-base font-semibold text-warm-600 mb-2">
                    {organ}
                  </div>
                  <div className="bg-white rounded-[--radius-lg] shadow-[--shadow-card] divide-y divide-warm-200">
                    {groupMeasurements.map((m, index) => (
                      <div
                        key={[
                          m.standardName,
                          String(m.originalName ?? ""),
                          String(m.value ?? ""),
                          m.unit ?? "",
                          index,
                        ].join("-")}
                        className="flex items-start justify-between gap-4 px-4 py-3 min-h-12"
                      >
                        <div>
                          <div className="text-sm">{m.standardName}</div>
                          <div className="mt-1 text-xs text-warm-400">
                            {m.reportId} · 第 {m.page} 页
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end gap-2">
                          <span
                            className={`text-sm tabular-nums font-medium ${
                              m.isAbnormal
                                ? "text-status-attention"
                                : "text-warm-900"
                            }`}
                          >
                            {String(m.value)}
                          </span>
                          {m.unit && (
                            <span className="text-xs text-warm-400">
                              {m.unit}
                            </span>
                          )}
                          </div>
                          {m.referenceRange && (
                            <div className="mt-1 text-xs text-warm-400">
                              参考范围: {m.referenceRange.text || [m.referenceRange.low, m.referenceRange.high].filter((value) => value !== undefined).join("–")}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </>
        )}
      </div>
    </div>
  );
}
