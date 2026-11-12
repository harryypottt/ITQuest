import { motion } from 'framer-motion';

interface XPRingProps {
  currentXP: number;
  xpForNextLevel: number;
  level: number;
  rank: string;
}

export default function XPRing({ currentXP, xpForNextLevel, level, rank }: XPRingProps) {
  const percentage = Math.min(100, Math.round((currentXP / xpForNextLevel) * 100));
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-44 h-44 flex items-center justify-center">
        {/* Background ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-quest-bg"
          />
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="url(#xpGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="xpGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="text-center z-10">
          <motion.span
            className="block text-3xl font-bold text-quest-text"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {currentXP.toLocaleString()}
          </motion.span>
          <span className="text-xs text-quest-textDim">/ {xpForNextLevel.toLocaleString()} XP</span>
        </div>
      </div>

      {/* Level + Rank below */}
      <div className="flex items-center gap-3 mt-2">
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm font-bold text-emerald-400">
          Lv. {level}
        </span>
        <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-sm font-semibold text-amber-400">
          {rank}
        </span>
      </div>
      <p className="text-xs text-quest-textDim mt-2">{percentage}% to Level {level + 1}</p>
    </div>
  );
}