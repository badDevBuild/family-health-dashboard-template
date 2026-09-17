interface Member {
  name: string;
  status: string;
}

interface PersonSwitcherProps {
  members: Member[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

const STATUS_DOT_COLORS: Record<string, string> = {
  normal: "bg-status-normal",
  attention: "bg-status-attention",
  alert: "bg-status-alert",
};

const AVATAR_BG_COLORS: Record<string, string> = {
  normal: "bg-status-normal-bg",
  attention: "bg-status-attention-bg",
  alert: "bg-status-alert-bg",
};

export function PersonSwitcher({
  members,
  activeIndex,
  onSelect,
}: PersonSwitcherProps) {
  return (
    <div className="flex items-center gap-2 px-5 pt-4 pb-2">
      {members.map((member, index) => {
        const isActive = index === activeIndex;
        const lastChar = member.name.slice(-1);

        return (
          <button
            key={member.name}
            data-testid="avatar"
            data-active={isActive ? "true" : "false"}
            onClick={() => onSelect(index)}
            className={`
              relative w-11 h-11 rounded-full flex items-center justify-center
              text-base font-semibold cursor-pointer transition-all duration-200
              ${AVATAR_BG_COLORS[member.status] || "bg-status-attention-bg"}
              ${isActive ? "opacity-100 ring-2 ring-primary ring-offset-2 ring-offset-warm-50" : "opacity-50 hover:opacity-80"}
            `}
          >
            {lastChar}
            <span
              data-status={member.status}
              className={`
                absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full
                border-2 border-warm-50
                ${STATUS_DOT_COLORS[member.status] || "bg-status-attention"}
              `}
            />
          </button>
        );
      })}
    </div>
  );
}
