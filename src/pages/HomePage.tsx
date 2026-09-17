import { useNavigate, useSearchParams } from "react-router-dom";
import { TabBar } from "../components/TabBar";
import { OrganCard } from "../components/OrganCard";
import { TimelineItem } from "../components/TimelineItem";
import { EmptyState } from "../components/EmptyState";
import {
  FAMILY_MEMBERS,
  getAnalysis,
  getEvents,
  getLifestyle,
  getSuggestions,
} from "@health-data";
import { ORGAN_SYSTEMS } from "../shared/organs";
import { LifestyleGuide } from "../components/LifestyleGuide";
import { ActionItems } from "../components/ActionItems";
import { DemoBanner } from "../components/DemoBanner";

const TABS = ["下一步", "身体", "时间线", "生活指南"];

export function HomePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const personId = searchParams.get("person") || FAMILY_MEMBERS[0]?.id;
  const currentMember =
    FAMILY_MEMBERS.find((m) => m.id === personId) || FAMILY_MEMBERS[0];

  // Tab 状态持久化到 URL，返回时能恢复到正确的 Tab
  const tabParam = parseInt(searchParams.get("tab") || "0", 10);
  const activeTab = tabParam >= 0 && tabParam < TABS.length ? tabParam : 0;
  const setActiveTab = (index: number) => {
    setSearchParams(
      { person: personId, tab: String(index) },
      { replace: true },
    );
  };

  const analysis = getAnalysis(currentMember.id);
  const events = getEvents(currentMember.id);
  const suggestions = getSuggestions(currentMember.id);
  const lifestyle = getLifestyle(currentMember.id);

  return (
    <div className="max-w-[430px] mx-auto min-h-screen">
      {/* 顶部：返回按钮 + 人物信息 */}
      <div className="px-5 pt-4 pb-1 flex items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-warm-100 hover:bg-warm-200 active:scale-95 transition-all duration-150 cursor-pointer shrink-0"
          aria-label="返回主页"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="text-warm-600"
          >
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div>
          <div className="text-[22px] font-bold">{currentMember.name}</div>
          <div className="text-sm text-warm-400 mt-0.5">
            {currentMember.lastCheckup
              ? `最近体检: ${currentMember.lastCheckup} · ${currentMember.dataSpan}`
              : currentMember.dataSpan}
          </div>
          <div className="text-sm text-warm-400 mt-0.5">
            分析状态: {currentMember.reviewStatus === "approved" ? "已批准" : currentMember.reviewStatus === "demo" ? "虚构演示" : "待审核"}
          </div>
        </div>
      </div>

      <DemoBanner />

      {/* Tab 栏 */}
      <div className="px-5 pt-4">
        <TabBar tabs={TABS} activeIndex={activeTab} onSelect={setActiveTab} />
      </div>

      {/* 内容区 */}
      <div className="px-5 pb-8">
        {activeTab === 0 ? (
          <ActionItems data={suggestions} />
        ) : activeTab === 1 ? (
          <BodyTab analysis={analysis} personId={currentMember.id} />
        ) : activeTab === 2 ? (
          <TimelineTab events={events} personId={currentMember.id} personName={currentMember.name} />
        ) : (
          <LifestyleGuide data={lifestyle} />
        )}
      </div>
    </div>
  );
}

function BodyTab({
  analysis,
  personId,
}: {
  analysis: ReturnType<typeof getAnalysis>;
  personId: string;
}) {
  const navigate = useNavigate();
  if (!analysis) {
    return <EmptyState />;
  }

  // 按状态严重度排序：alert > attention > normal
  const statusOrder: Record<string, number> = {
    alert: 0,
    attention: 1,
    warning: 1,
    normal: 2,
  };
  const sorted = [...analysis.organAnalyses].sort(
    (a, b) =>
      (statusOrder[a.status] ?? 1) - (statusOrder[b.status] ?? 1),
  );

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((organAnalysis) => {
        const organConfig = ORGAN_SYSTEMS.find(
          (o) => o.name === organAnalysis.organ,
        );
        const icon = organConfig?.icon || "◎";

        const indicators = organAnalysis.keyIndicators
          .slice(0, 2)
          .map((ind) => ({
            name: ind.name,
            value: String(ind.latestValue),
            unit: ind.unit,
            trend: ind.trend,
            history: ind.history
              .map((h) => h.value)
              .filter((value: unknown): value is number => typeof value === "number" && Number.isFinite(value)),
          }));

        return (
          <OrganCard
            key={organAnalysis.organ}
            organ={organAnalysis.organ as any}
            icon={icon}
            status={organAnalysis.status as any}
            indicators={indicators}
            onClick={() =>
              navigate(
                `/organ/${encodeURIComponent(organAnalysis.organ)}?person=${encodeURIComponent(personId)}`,
              )
            }
          />
        );
      })}
    </div>
  );
}

function TimelineTab({
  events,
  personId,
  personName,
}: {
  events: ReturnType<typeof getEvents>;
  personId: string;
  personName: string;
}) {
  const navigate = useNavigate();

  if (events.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="divide-y divide-warm-200">
      {events.map((event) => (
        <button
          type="button"
          key={event.id}
          onClick={() =>
            navigate(
              `/event/${encodeURIComponent(event.id)}?person=${encodeURIComponent(personId)}`,
            )
          }
          className="w-full text-left cursor-pointer active:scale-[0.98] transition-transform duration-100"
        >
          <TimelineItem
            date={event.date}
            title={event.type === "体检" ? "年度体检" : "医院检查"}
            subtitle={`${personName} · ${event.source}`}
            organTags={event.organTags}
          />
        </button>
      ))}
    </div>
  );
}
