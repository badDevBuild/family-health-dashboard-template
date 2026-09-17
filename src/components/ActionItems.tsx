import type { SuggestionData } from "@health-data";
import { Link } from "react-router-dom";
import { EmptyState } from "./EmptyState";

const STATUS_LABELS: Record<string, string> = {
  ai_pending: "AI 提出，待医生确认",
  doctor_confirmed: "医生已确认",
  completed: "已完成",
};

export function ActionItems({ data }: { data: SuggestionData | null }) {
  const items = data?.reviewSuggestions || [];
  const personId = data?.personId || "";
  if (items.length === 0) return <EmptyState message="暂无已审核的复查事项" />;

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-[--radius-md] bg-[#E8F0F7] px-4 py-3 text-base leading-relaxed text-[#466F91]">
        “待确认”事项不是诊断或医嘱，请与医生核实后再执行。
      </div>
      {items.map((item, index) => (
        <section key={`${item.organ}-${item.what}-${index}`} className="rounded-[--radius-lg] bg-white p-4 shadow-card">
          <div className="flex flex-col items-start gap-2">
            <div className="text-base font-semibold text-warm-900">{item.what}</div>
            <span className="shrink-0 rounded-full bg-warm-100 px-2.5 py-1 text-xs text-warm-600">
              {STATUS_LABELS[item.status || "ai_pending"] || "状态待确认"}
            </span>
          </div>
          <div className="mt-3 text-base leading-relaxed text-warm-600">{item.why}</div>
          <dl className="mt-3 grid grid-cols-[4.5rem_1fr] gap-x-2 gap-y-2 text-base leading-relaxed">
            <dt className="text-warm-400">时间</dt><dd>{item.when}</dd>
            <dt className="text-warm-400">科室</dt><dd>{item.where}</dd>
            {item.owner && <><dt className="text-warm-400">负责人</dt><dd>{item.owner}</dd></>}
            {item.evidence?.length ? (
              <>
                <dt className="text-warm-400">依据</dt>
                <dd className="flex flex-col items-start gap-1">
                  {item.evidence.map((evidence, evidenceIndex) => (
                    <Link
                      key={`${evidence.eventId}-${evidenceIndex}`}
                      to={`/event/${encodeURIComponent(evidence.eventId)}?person=${encodeURIComponent(personId)}`}
                      className="min-h-11 inline-flex items-center text-[#466F91] underline underline-offset-2"
                    >
                      查看检查依据 {evidenceIndex + 1}
                    </Link>
                  ))}
                </dd>
              </>
            ) : null}
          </dl>
        </section>
      ))}
    </div>
  );
}
