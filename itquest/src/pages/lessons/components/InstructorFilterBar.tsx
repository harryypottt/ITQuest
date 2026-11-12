import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export type InstructorOption = {
  id: string;
  name: string;
  count: number;
};

interface InstructorFilterBarProps {
  instructors: InstructorOption[];
  selectedInstructor: string;
  onSelectInstructor: (id: string) => void;
  onBack: () => void;
  totalCount: number;
}

export default function InstructorFilterBar({
  instructors,
  selectedInstructor,
  onSelectInstructor,
  onBack,
  totalCount,
}: InstructorFilterBarProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const active = selectedInstructor === 'all'
    ? null
    : instructors.find((i) => i.id === selectedInstructor) || null;
  const label = active ? active.name : 'All Instructors';
  const shownCount = active ? active.count : totalCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20"
    >
      {/* Back to curriculum */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer text-quest-textMuted bg-quest-card border border-quest-border hover:text-quest-text hover:border-quest-textDim transition-all"
      >
        <i className="ri-arrow-left-line text-base" />
        Curriculum
      </button>

      {/* Instructor dropdown */}
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer text-amber-400 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/15 transition-all"
        >
          <i className="ri-user-star-line text-base" />
          <span>{label}</span>
          <i className={`ri-arrow-down-s-line text-base transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute z-30 mt-2 w-64 rounded-xl border border-quest-border bg-quest-card overflow-hidden">
            <button
              onClick={() => { onSelectInstructor('all'); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left cursor-pointer transition-colors ${
                selectedInstructor === 'all' ? 'bg-amber-500/10 text-amber-400' : 'text-quest-text hover:bg-quest-bg'
              }`}
            >
              <span className="w-7 h-7 rounded-full bg-quest-bg border border-quest-border flex items-center justify-center flex-shrink-0">
                <i className="ri-group-line text-xs" />
              </span>
              <span className="flex-1 text-sm font-medium truncate">All Instructors</span>
              <span className="text-xs text-quest-textDim">{totalCount}</span>
            </button>

            <div className="h-px bg-quest-border" />

            {instructors.map((ins) => (
              <button
                key={ins.id}
                onClick={() => { onSelectInstructor(ins.id); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left cursor-pointer transition-colors ${
                  selectedInstructor === ins.id ? 'bg-amber-500/10 text-amber-400' : 'text-quest-text hover:bg-quest-bg'
                }`}
              >
                <span className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <i className="ri-user-line text-xs" />
                </span>
                <span className="flex-1 text-sm font-medium truncate">{ins.name}</span>
                <span className="text-xs text-quest-textDim">{ins.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Shown count */}
      <span className="text-xs text-quest-textDim ml-auto whitespace-nowrap">
        {shownCount} lesson{shownCount === 1 ? '' : 's'}
      </span>
    </motion.div>
  );
}