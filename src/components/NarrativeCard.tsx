export function NarrativeCard({ text }: { text: string }) {
  const paragraphs = text.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);

  return (
    <div
      data-testid="narrative-card"
      className="bg-primary-light rounded-[--radius-lg] p-4 border-l-3 border-primary mb-4"
    >
      <div className="text-xs font-semibold text-primary mb-1.5">综合分析</div>
      <div className="space-y-3">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-base leading-7 text-warm-600">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
