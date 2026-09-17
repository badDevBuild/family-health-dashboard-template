import { useNavigate } from "react-router-dom";
import { FAMILY_MEMBERS } from "@health-data";
import { DemoBanner } from "../components/DemoBanner";

const STATUS_RING: Record<string, string> = {
  unknown: "ring-[#9C9690]/35",
  normal: "ring-[#3B9B6F]/35",
  attention: "ring-[#D4910A]/35",
  alert: "ring-[#C75C3A]/35",
};

const AVATAR_BG: Record<string, string> = {
  unknown: "bg-[#F5F3F0]",
  normal: "bg-[#E8F5EE]",
  attention: "bg-[#FDF4E3]",
  alert: "bg-[#FBEAE4]",
};

const STATUS_DOT: Record<string, string> = {
  unknown: "bg-[#9C9690]",
  normal: "bg-[#3B9B6F]",
  attention: "bg-[#D4910A]",
  alert: "bg-[#C75C3A]",
};

const STATUS_LABEL: Record<string, string> = {
  unknown: "待整理",
  normal: "整体平稳",
  attention: "有事项待关注",
  alert: "建议尽快确认",
};

export function FamilyHomePage() {
  const navigate = useNavigate();

  function handleSelect(personId: string) {
    navigate(`/dashboard?person=${encodeURIComponent(personId)}`);
  }

  return (
    <div className="relative mx-auto min-h-screen max-w-[430px] overflow-hidden px-5 pb-10">
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(59,155,111,0.16) 0%, rgba(244,214,168,0.12) 46%, transparent 72%)",
        }}
      />

      <header className="relative z-10 pt-12">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg shadow-card"
            aria-hidden="true"
          >
            ♡
          </span>
          安和家的健康资料夹
        </div>
        <h1 className="max-w-[350px] text-[32px] font-bold leading-[1.25] tracking-[-0.02em] text-warm-900">
          看见变化，照顾好一家人
        </h1>
        <p className="mt-3 max-w-[370px] text-base leading-relaxed text-warm-600">
          把历年检查、身体变化和下一步行动放在一起，打开就能看懂。
        </p>
      </header>

      <div className="relative z-10 mt-6">
        <DemoBanner />
      </div>

      <section className="relative z-10 mt-8" aria-labelledby="family-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 id="family-heading" className="text-xl font-bold text-warm-900">
              选择一位家人
            </h2>
            <p className="mt-1 text-sm text-warm-400">
              5 位家人 · 25 次历年记录
            </p>
          </div>
          <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
            2022–2026
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {FAMILY_MEMBERS.map((member, index) => (
            <AvatarButton
              key={member.id}
              member={member}
              delay={index * 70}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function AvatarButton({
  member,
  delay,
  onSelect,
}: {
  member: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
    status: string;
  };
  delay: number;
  onSelect: (personId: string) => void;
}) {
  const lastChar = member.name.slice(-1);

  return (
    <button
      type="button"
      onClick={() => onSelect(member.id)}
      className="group relative flex min-h-[208px] animate-fade-in-up flex-col items-center rounded-[--radius-lg] border border-white/80 bg-white/85 p-4 text-center shadow-card backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover active:scale-[0.98] last:col-span-2 last:mx-auto last:w-[calc(50%-6px)]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative">
        <div
          className={`
            flex h-[96px] w-[96px] items-center justify-center overflow-hidden rounded-full
            ring-[3px] ${STATUS_RING[member.status] || STATUS_RING.attention}
            shadow-card transition-all duration-200 group-hover:shadow-card-hover
            ${AVATAR_BG[member.status] || AVATAR_BG.attention}
          `}
        >
          {member.avatar ? (
            <img
              src={`${import.meta.env.BASE_URL}${member.avatar}`}
              alt={`${member.name}的插画头像`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="select-none text-[32px] font-semibold text-warm-600">
              {lastChar}
            </span>
          )}
        </div>
        <span
          className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-[3px] border-white ${STATUS_DOT[member.status] || STATUS_DOT.attention}`}
          aria-hidden="true"
        />
      </div>

      <span className="mt-3 text-lg font-semibold text-warm-900">
        {member.name}
      </span>
      <span className="mt-0.5 text-sm text-warm-400">{member.role}</span>
      <span className="mt-2 rounded-full bg-warm-100 px-2.5 py-1 text-xs text-warm-600">
        {STATUS_LABEL[member.status] || STATUS_LABEL.attention}
      </span>
    </button>
  );
}
