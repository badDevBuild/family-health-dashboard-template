import { useNavigate } from "react-router-dom";
import { FAMILY_MEMBERS } from "@health-data";
import { DemoBanner } from "../components/DemoBanner";

const STATUS_RING: Record<string, string> = {
  unknown: "ring-[#9C9690]/35",
  normal: "ring-[#3B9B6F]/40",
  attention: "ring-[#D4910A]/40",
  alert: "ring-[#C75C3A]/40",
};

const AVATAR_BG: Record<string, string> = {
  unknown: "bg-[#F5F3F0]",
  normal: "bg-[#E8F5EE]",
  attention: "bg-[#FDF4E3]",
  alert: "bg-[#FBEAE4]",
};

const BASE = import.meta.env.BASE_URL;

export function FamilyHomePage() {
  const navigate = useNavigate();

  function handleSelect(personId: string) {
    navigate(`/dashboard?person=${encodeURIComponent(personId)}`);
  }

  return (
    <div className="max-w-[430px] mx-auto min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* 与生产页一致的柔和背景光晕 */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(59,155,111,0.06) 0%, rgba(59,155,111,0.02) 40%, transparent 70%)",
        }}
      />

      <div className="text-center mb-10 relative z-10">
        <h1 className="text-[28px] font-bold text-warm-900 tracking-wide">
          健康看板
        </h1>
        <p className="text-sm text-warm-400 mt-2">健康第一</p>
        <div className="mt-4">
          <DemoBanner />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-[280px]">
        <div className="grid grid-cols-2 gap-x-12 gap-y-8 justify-items-center">
          {FAMILY_MEMBERS.slice(0, 4).map((member, index) => (
            <AvatarButton
              key={member.id}
              member={member}
              delay={index * 80}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {FAMILY_MEMBERS.length > 4 && (
          <div className="flex justify-center mt-8">
            <AvatarButton
              member={FAMILY_MEMBERS[4]}
              delay={4 * 80}
              onSelect={handleSelect}
            />
          </div>
        )}
      </div>

      <div className="h-16" />
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
    avatar?: string;
    status: string;
  };
  delay: number;
  onSelect: (personId: string) => void;
}) {
  const photo = member.avatar ? `${BASE}${member.avatar}` : null;
  const lastChar = member.name.slice(-1);

  return (
    <button
      type="button"
      onClick={() => onSelect(member.id)}
      className="flex flex-col items-center gap-2.5 cursor-pointer group animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
      aria-label={`查看${member.name}的健康资料`}
    >
      <div className="relative">
        <div
          className={`
            w-[88px] h-[88px] rounded-full flex items-center justify-center overflow-hidden
            ring-[3px] ${STATUS_RING[member.status] || STATUS_RING.attention}
            shadow-card transition-all duration-200
            group-hover:shadow-card-hover group-active:scale-95
            ${!photo ? AVATAR_BG[member.status] || AVATAR_BG.attention : ""}
          `}
        >
          {photo ? (
            <img
              src={photo}
              alt={`${member.name}的插画头像`}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-[32px] font-semibold text-warm-600 select-none">
              {lastChar}
            </span>
          )}
        </div>
      </div>

      <span className="text-base font-medium text-warm-900">{member.name}</span>
    </button>
  );
}
