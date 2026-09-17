interface TabBarProps {
  tabs: string[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function TabBar({ tabs, activeIndex, onSelect }: TabBarProps) {
  return (
    <div className="flex bg-warm-100 rounded-[--radius-md] p-1 mb-5">
      {tabs.map((tab, index) => (
        <button
          key={tab}
          data-active={index === activeIndex ? "true" : "false"}
          onClick={() => onSelect(index)}
          className={`
            flex-1 text-center py-3 text-sm font-medium rounded-[10px] min-h-11
            cursor-pointer transition-all duration-200
            ${
              index === activeIndex
                ? "bg-white text-warm-900 shadow-sm"
                : "text-warm-400"
            }
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
