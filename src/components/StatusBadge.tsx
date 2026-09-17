const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  unknown: { label: "待审核", className: "status-unknown" },
  normal: { label: "正常", className: "status-normal" },
  attention: { label: "需关注", className: "status-attention" },
  alert: { label: "建议就医", className: "status-alert" },
  warning: { label: "需关注", className: "status-attention" },
};

const DEFAULT_CONFIG = { label: "待审核", className: "status-unknown" };

export function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || DEFAULT_CONFIG;
  return (
    <span
      className={`inline-block px-2.5 py-1 text-xs font-medium rounded-[--radius-sm] ${config.className}`}
    >
      {config.label}
    </span>
  );
}
