import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BossQuestData } from '@/sampleData/bossQuestData';
import { worldRegions } from '@/sampleData/questExpandedData';

interface RegionClearedModalProps {
  isOpen: boolean;
  bossQuest: BossQuestData;
  newlyUnlockedRegion?: { id: string; name: string; icon: string; color: string } | null;
  onClose: () => void;
  onExploreRegion?: (regionId: string) => void;
}

const PARTICLE_COUNT = 50;
const particleColors = ['#10b981', '#34d399', '#f59e0b', '#fbbf24', '#f43f5e', '#fb7185', '#d946ef', '#8b5cf6'];

function generateParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 5 + 2,
    color: particleColors[Math.floor(Math.random() * particleColors.length)],
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));
}

export default function RegionClearedModal({ isOpen, bossQuest, newlyUnlockedRegion, onClose, onExploreRegion }: RegionClearedModalProps) {
  const [phase, setPhase] = useState<'entering' | 'burst' | 'reveal' | 'complete'>('entering');
  const [particles] = useState(generateParticles);

  useEffect(() => {
    if (!isOpen) return;
    setPhase('entering');
    const t1 = setTimeout(() => setPhase('burst'), 500);
    const t2 = setTimeout(() => setPhase('reveal'), 2000);
    const t3 = setTimeout(() => setPhase('complete'), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [isOpen]);

  const region = worldRegions.find((r) => r.id === bossQuest.regionId);
  const regionColor = region?.color || '#10b981';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 overflow-hidden"
        onClick={phase === 'complete' ? onClose : undefined}
      >
        {/* Background radial burst */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: phase === 'entering' ? 0 : phase === 'burst' ? 3 : 4,
            opacity: phase === 'entering' ? 0 : phase === 'burst' ? 0.3 : 0.1,
          }}
          transition={{ duration: phase === 'burst' ? 1 : 0.5 }}
          className="absolute w-96 h-96 rounded-full"
          style={{ background: `radial-gradient(circle, ${regionColor}40, transparent)` }}
        />

        {/* Secondary gold burst */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: phase === 'burst' ? 2.5 : 3.5,
            opacity: phase === 'burst' ? 0.2 : 0.05,
          }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="absolute w-80 h-80 rounded-full bg-gradient-radial from-amber-500/40 via-amber-500/10 to-transparent"
        />

        {/* Particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
            animate={{
              x: (Math.random() - 0.5) * 500,
              y: (Math.random() - 0.5) * 500 - 50,
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: p.duration,
              delay: 0.5 + p.delay,
              ease: 'easeOut',
            }}
            className="absolute top-1/2 left-1/2 rounded-full z-10"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            }}
          />
        ))}

        {/* Center content */}
        <div className="relative z-20 text-center max-w-md px-6">
          {/* Region cleared emblem */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{
              scale: phase === 'entering' ? 0 : 1,
              rotate: phase === 'entering' ? -180 : 0,
            }}
            transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.3 }}
            className="w-28 h-28 rounded-full mx-auto mb-6 flex items-center justify-center relative"
            style={{
              background: `linear-gradient(135deg, ${regionColor}30, ${regionColor}10)`,
              border: `3px solid ${regionColor}50`,
              boxShadow: `0 0 60px ${regionColor}20`,
            }}
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full"
              style={{ background: `radial-gradient(circle, ${regionColor}20, transparent)` }}
            />
            <i className="ri-vip-crown-line text-5xl text-amber-400 relative z-10" />
          </motion.div>

          {/* REGION CLEARED text */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.7 }}
            animate={{
              opacity: phase === 'entering' ? 0 : 1,
              y: phase === 'entering' ? 30 : 0,
              scale: phase === 'entering' ? 0.7 : 1,
            }}
            transition={{ delay: 0.8, type: 'spring', stiffness: 100, damping: 12 }}
          >
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-emerald-400 block mb-2">
              Region Cleared
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-white font-display tracking-wide mb-2">
              {region?.name || 'Region'}
            </h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: phase === 'burst' ? 1 : 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="h-0.5 w-48 mx-auto bg-gradient-to-r from-transparent via-emerald-400 to-transparent mb-4"
            />
          </motion.div>

          {/* Boss quest name */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: phase === 'reveal' ? 1 : 0, y: phase === 'reveal' ? 0 : 10 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="text-sm text-quest-textMuted mb-4"
          >
            Boss Defeated: <span className="text-quest-text font-semibold">{bossQuest.title}</span>
          </motion.p>

          {/* Rewards */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: phase === 'reveal' ? 1 : 0, y: phase === 'reveal' ? 0 : 15 }}
            transition={{ delay: 1.8, duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-6 flex-wrap"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <i className="ri-flashlight-line text-amber-400 text-lg" />
              <span className="text-amber-400 font-bold">+{bossQuest.xpReward} XP</span>
            </div>
            {bossQuest.badgeReward && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <i className="ri-medal-line text-rose-400 text-lg" />
                <div className="text-left">
                  <span className="text-quest-text font-semibold text-xs block leading-tight">{bossQuest.badgeReward.name}</span>
                  <span className="text-quest-textDim text-[10px]">{bossQuest.badgeReward.rarity}</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* New region unlock preview */}
          {newlyUnlockedRegion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: phase === 'complete' ? 1 : 0, y: phase === 'complete' ? 0 : 20 }}
              transition={{ delay: 2.5, duration: 0.6 }}
              className="mb-6 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5"
            >
              <div className="flex items-center gap-2 mb-2">
                <motion.i
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="ri-key-2-line text-amber-400 text-lg"
                />
                <span className="text-xs font-bold text-amber-400">New Region Unlocked!</span>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${newlyUnlockedRegion.color}15`, border: `1px solid ${newlyUnlockedRegion.color}30` }}>
                  <i className={`${newlyUnlockedRegion.icon} text-lg`} style={{ color: newlyUnlockedRegion.color }} />
                </div>
                <span className="text-sm font-bold text-quest-text">{newlyUnlockedRegion.name}</span>
              </div>
            </motion.div>
          )}

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'complete' ? 1 : 0 }}
            transition={{ delay: 3, duration: 0.5 }}
            className="flex flex-col items-center gap-3"
          >
            {newlyUnlockedRegion && onExploreRegion && (
              <button
                onClick={() => onExploreRegion(newlyUnlockedRegion.id)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-white text-sm font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer"
              >
                <i className="ri-compass-3-line" />
                Explore {newlyUnlockedRegion.name}
              </button>
            )}
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-quest-card border border-quest-border text-quest-textMuted text-sm font-medium hover:text-quest-text hover:border-quest-textDim/40 transition-all whitespace-nowrap cursor-pointer"
            >
              Continue Your Journey
            </button>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'complete' ? 1 : 0 }}
            transition={{ delay: 3.5 }}
            className="text-[10px] text-quest-textDim mt-6"
          >
            {bossQuest.unlocksRegionId
              ? `Completing this boss quest has unlocked a new region for exploration.`
              : `All boss quests in this region are complete. The path forward is yours to choose.`}
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}