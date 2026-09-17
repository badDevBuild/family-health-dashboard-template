const BLOCKS = "▁▂▃▄▅▆▇";

export function Sparkline({ values }: { values: number[] }) {
  if (values.length === 0) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;

  const chars = values
    .map((v) => {
      if (range === 0) return BLOCKS[3]; // 中等高度
      const normalized = (v - min) / range; // 0-1
      const index = Math.round(normalized * (BLOCKS.length - 1));
      return BLOCKS[index];
    })
    .join("");

  return (
    <span
      data-testid="sparkline"
      className="text-[11px] tracking-wider text-warm-400"
    >
      {chars}
    </span>
  );
}
