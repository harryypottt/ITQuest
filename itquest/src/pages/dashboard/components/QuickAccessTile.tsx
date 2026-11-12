import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface QuickAccessTileProps {
  label: string;
  description: string;
  icon: string;
  path: string;
  color: string;
  bg: string;
  border: string;
  index: number;
}

export default function QuickAccessTile({
  label,
  description,
  icon,
  path,
  color,
  bg,
  border,
  index,
}: QuickAccessTileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2 + index * 0.05 }}
    >
      <Link
        to={path}
        className={`flex items-center gap-3 p-4 rounded-xl bg-quest-card border border-quest-border hover:border-quest-textDim transition-all group cursor-pointer h-full`}
      >
        <div className={`w-10 h-10 rounded-xl ${bg} ${border} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
          <i className={`${icon} ${color} text-lg`} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-quest-text">{label}</p>
          <p className="text-xs text-quest-textDim truncate">{description}</p>
        </div>
        <i className="ri-arrow-right-s-line text-quest-textDim group-hover:text-quest-primary transition-colors ml-auto flex-shrink-0" />
      </Link>
    </motion.div>
  );
}