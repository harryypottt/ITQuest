import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { bossQuests } from '@/sampleData/landingData';

function DifficultyStars({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <i
          key={i}
          className={`ri-fire-line text-xs ${
            i < level ? 'text-quest-danger' : 'text-quest-border'
          }`}
        />
      ))}
    </div>
  );
}

export default function BossQuestsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-24 md:py-32 bg-quest-card overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 w-full px-4 md:px-8 lg:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-quest-bg border border-quest-border text-xs font-semibold text-quest-danger tracking-wider uppercase mb-4">
            Boss Quests
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-quest-text mb-4">
            Face the{' '}
            <span className="bg-gradient-to-r from-quest-danger to-quest-gold bg-clip-text text-transparent">
              Ultimate Challenges
            </span>
          </h2>
          <p className="text-quest-textMuted text-base md:text-lg max-w-2xl mx-auto">
            Boss Quests are milestone project missions. Complete real-world applications and prove your mastery.
          </p>
        </motion.div>

        {/* Boss quest cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-5xl mx-auto">
          {bossQuests.map((quest, index) => (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group relative p-6 md:p-8 rounded-2xl bg-quest-bg border border-quest-border hover:border-quest-danger/30 transition-all duration-500"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-quest-card border border-quest-border flex items-center justify-center">
                      <i className="ri-fire-line text-quest-danger text-lg" />
                    </div>
                    <div>
                      <div className="text-xs text-quest-textDim uppercase tracking-wider">Boss Quest</div>
                      <DifficultyStars level={quest.difficulty} />
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-quest-danger">
                    +{quest.xpReward} XP
                  </div>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-quest-text mb-2">{quest.title}</h3>
                <p className="text-sm text-quest-textMuted leading-relaxed mb-4">{quest.description}</p>

                {/* Requirements */}
                <div className="space-y-2 mb-5">
                  {quest.requirements.slice(0, 3).map((req, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-quest-textDim">
                      <i className="ri-checkbox-blank-circle-fill text-quest-primary text-[6px]" />
                      <span>{req}</span>
                    </div>
                  ))}
                  {quest.requirements.length > 3 && (
                    <div className="text-xs text-quest-textDim">+{quest.requirements.length - 3} more requirements</div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-quest-border">
                  <div className="flex items-center gap-2 text-xs text-quest-textDim">
                    <i className="ri-time-line" />
                    <span>{quest.deadline} deadline</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-quest-textDim">
                    <i className="ri-folder-line" />
                    <span>{quest.category}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}