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
} from "@health-data";
import { ORGAN_SYSTEMS } from "../shared/organs";
import { LifestyleGuide } from "../components/LifestyleGuide";

const TABS = ["身体", "时间线", "生活指南"];

export function HomePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const personName = searchParams.get("person") || FAMILY_MEMBERS[0]?.name;
  const currentMember =
    FAMILY_MEMBERS.find((m) => m.name === personName) || FAMILY_MEMBERS[0];

  // Tab 状态持久化到 URL，返回时能恢复到正确的 Tab
  const tabParam = parseInt(searchParams.get("tab") || "0", 10);
  const activeTab = tabParam >= 0 && tabParam < TABS.length ? tabParam : 0;
  const setActiveTab = (index: number) => {
    setSearchParams(
      { person: personName, tab: String(index) },
      { replace: true },
    );
  };

  const analysis = getAnalysis(currentMember.name);
  const events = getEvents(currentMember.name);
  const lifestyle = getLifestyle(currentMember.name);

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
        </div>
      </div>

      {/* Tab 栏 */}
      <div className="px-5 pt-4">
        <TabBar tabs={TABS} activeIndex={activeTab} onSelect={setActiveTab} />
      </div>

      {/* 内容区 */}
      <div className="px-5 pb-8">
        {activeTab === 0 ? (
          <BodyTab analysis={analysis} personName={currentMember.name} />
        ) : activeTab === 1 ? (
          <TimelineTab events={events} personName={currentMember.name} />
        ) : (
          <LifestyleGuide data={lifestyle} />
        )}
      </div>
    </div>
  );
}

function BodyTab({
  analysis,
  personName,
}: {
  analysis: ReturnType<typeof getAnalysis>;
  personName: string;
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
    (a: any, b: any) =>
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
          .map((ind: any) => ({
            name: ind.name,
            value: String(ind.latestValue),
            unit: ind.unit,
            trend: ind.trend,
            history: ind.history.map((h: any) =>
              typeof h.value === "number" ? h.value : 0,
            ),
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
                `/organ/${encodeURIComponent(organAnalysis.organ)}?person=${encodeURIComponent(personName)}`,
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
  personName,
}: {
  events: ReturnType<typeof getEvents>;
  personName: string;
}) {
  const navigate = useNavigate();

  if (events.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="divide-y divide-warm-200">
      {events.map((event) => (
        <div
          key={event.id}
          onClick={() =>
            navigate(
              `/event/${encodeURIComponent(event.id)}?person=${encodeURIComponent(personName)}`,
            )
          }
          className="cursor-pointer active:scale-[0.98] transition-transform duration-100"
        >
          <TimelineItem
            date={event.date}
            title={event.type === "体检" ? "年度体检" : "医院检查"}
            subtitle={`${personName} · ${event.source}`}
            organTags={event.organTags}
          />
        </div>
      ))}
    </div>
  );
}
