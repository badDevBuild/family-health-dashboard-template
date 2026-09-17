import { useNavigate } from "react-router-dom";
import { FAMILY_MEMBERS } from "@health-data";

const STATUS_RING: Record<string, string> = {
  normal: "ring-[#3B9B6F]/40",
  attention: "ring-[#D4910A]/40",
  alert: "ring-[#C75C3A]/40",
};

const AVATAR_BG: Record<string, string> = {
  normal: "bg-[#E8F5EE]",
  attention: "bg-[#FDF4E3]",
  alert: "bg-[#FBEAE4]",
};

const STATUS_DOT: Record<string, string> = {
  normal: "bg-[#3B9B6F]",
  attention: "bg-[#D4910A]",
  alert: "bg-[#C75C3A]",
};

export function FamilyHomePage() {
  const navigate = useNavigate();

  function handleSelect(name: string) {
    navigate(`/dashboard?person=${encodeURIComponent(name)}`);
  }

  return (
    <div className="max-w-[430px] mx-auto min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* 背景装饰：柔和的暖色径向光晕 */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(59,155,111,0.06) 0%, rgba(59,155,111,0.02) 40%, transparent 70%)",
        }}
      />

      {/* 标题区 */}
      <div className="text-center mb-12 relative z-10">
        <h1 className="text-[28px] font-bold text-warm-900 tracking-wide">
          健康看板
        </h1>
        <p className="text-sm text-warm-400 mt-2">健康第一</p>
      </div>

      {/* 头像网格 */}
      <div className="relative z-10 w-full max-w-[280px]">
        <div className="grid grid-cols-2 gap-x-12 gap-y-8 justify-items-center">
          {FAMILY_MEMBERS.map((member, i) => (
            <AvatarButton
              key={member.name}
              member={member}
              delay={i * 80}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>

      {/* 底部留白呼吸 */}
      <div className="h-16" />
    </div>
  );
}

function AvatarButton({
  member,
  delay,
  onSelect,
}: {
  member: { name: string; status: string };
  delay: number;
  onSelect: (name: string) => void;
}) {
  const lastChar = member.name.slice(-1);

  return (
    <button
      onClick={() => onSelect(member.name)}
      className="flex flex-col items-center gap-2.5 cursor-pointer group animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* 头像 */}
      <div className="relative">
        <div
          className={`
            w-[88px] h-[88px] rounded-full flex items-center justify-center
            ring-[3px] ${STATUS_RING[member.status] || STATUS_RING.attention}
            shadow-card transition-all duration-200
            group-hover:shadow-card-hover group-active:scale-95
            ${AVATAR_BG[member.status] || AVATAR_BG.attention}
          `}
        >
          <span className="text-[32px] font-semibold text-warm-600 select-none">
            {lastChar}
          </span>
        </div>
      </div>

      {/* 名字 */}
      <span className="text-base font-medium text-warm-900">{member.name}</span>
    </button>
  );
}
