import { motion } from 'framer-motion';

interface CategoryFilterProps {
  categories: { id: string; name: string; icon: string; color: string }[];
  activeCategory: string;
  onSelect: (id: string) => void;
  counts: Record<string, { total: number; completed: number }>;
  instructorCount: number;
  onOpenInstructor: () => void;
}

export default function CategoryFilter({ categories, activeCategory, onSelect, counts, instructorCount, onOpenInstructor }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {instructorCount > 0 && (
        <motion.button
          onClick={onOpenInstructor}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap border text-amber-400 bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/15"
        >
          <i className="ri-user-star-line text-base" />
          <span>My Instructor</span>
          <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold bg-amber-500/15">
            {instructorCount}
          </span>
        </motion.button>
      )}
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        const catCount = counts[cat.id] || { total: 0, completed: 0 };
        return (
          <motion.button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            whileTap={{ scale: 0.97 }}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium 
              transition-all cursor-pointer whitespace-nowrap border
              ${isActive
                ? `${cat.color} bg-quest-bg border-current/30 shadow-lg shadow-current/5`
                : 'text-quest-textMuted bg-quest-card border-quest-border hover:text-quest-text hover:border-quest-textDim'
              }
            `}
          >
            <i className={`${cat.icon} text-base`} />
            <span>{cat.name}</span>
            <span className={`
              text-xs px-1.5 py-0.5 rounded-full font-semibold
              ${isActive ? 'bg-current/15' : 'bg-quest-bg text-quest-textDim'}
            `}>
              {catCount.completed}/{catCount.total}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}