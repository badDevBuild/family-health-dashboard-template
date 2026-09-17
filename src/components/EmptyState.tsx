export function EmptyState({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl mb-3 opacity-40">🌱</div>
      <p className="text-warm-400 text-sm">
        {message || "暂无体检数据，数据录入后将自动展示"}
      </p>
    </div>
  );
}
