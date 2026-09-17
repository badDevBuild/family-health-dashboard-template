interface TimelineItemProps {
  date: string; // YYYY-MM-DD
  title: string;
  subtitle: string;
  organTags: string[];
}

export function TimelineItem({
  date,
  title,
  subtitle,
  organTags,
}: TimelineItemProps) {
  const d = new Date(date);
  const day = d.getDate();
  const month = `${d.getMonth() + 1}月`;
  const year = d.getFullYear().toString();

  return (
    <div className="flex gap-3.5 py-4">
      {/* 日期区 */}
      <div className="w-13 shrink-0 text-center">
        <div className="text-xl font-bold tabular-nums">{day}</div>
        <div className="text-sm text-warm-400">{month}</div>
        <div className="text-xs text-warm-400">{year}</div>
      </div>

      {/* 内容区 */}
      <div className="flex-1">
        <div className="text-base font-semibold mb-1">{title}</div>
        <div className="text-sm text-warm-400">{subtitle}</div>
        {organTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {organTags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-[--radius-sm] bg-warm-100 text-warm-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
