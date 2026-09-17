import { useParams, useSearchParams } from "react-router-dom";
import { BackButton } from "../components/BackButton";
import { getEvents, getMeasurements } from "@health-data";

export function EventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [searchParams] = useSearchParams();

  const personName = searchParams.get("person") || "";

  const events = getEvents(personName);
  const event = events.find((e) => e.id === eventId);
  const measurements = getMeasurements(personName, eventId || "");

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
            ? `${event.date} ${event.type === "体检" ? "年度体检" : "医院检查"}`
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
              </div>
            </div>

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
                        className="flex items-center justify-between px-4 min-h-12"
                      >
                        <span className="text-sm">{m.standardName}</span>
                        <div className="flex items-center gap-2">
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
