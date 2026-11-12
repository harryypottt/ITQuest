import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { specializations } from '@/sampleData/landingData';

export default function SpecializationsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-24 md:py-32 bg-quest-bg overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/3 rounded-full blur-3xl" />

      <div className="relative z-10 w-full px-4 md:px-8 lg:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-quest-card border border-quest-border text-xs font-semibold text-quest-gold tracking-wider uppercase mb-4">
            Specializations
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-quest-text mb-4">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-quest-gold to-quest-primary bg-clip-text text-transparent">
              Path
            </span>
          </h2>
          <p className="text-quest-textMuted text-base md:text-lg max-w-2xl mx-auto">
            Select a specialization track and embark on a curated learning journey tailored to your career goals.
          </p>
        </motion.div>

        {/* Specializations grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {specializations.map((spec, index) => (
            <motion.div
              key={spec.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-6 md:p-7 rounded-2xl bg-quest-card border border-quest-border hover:border-quest-primary/30 transition-all duration-500 overflow-hidden"
            >
              {/* Top gradient bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${spec.color} opacity-60 group-hover:opacity-100 transition-opacity`} />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-quest-card to-quest-bg border border-quest-border flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <i className={`${spec.icon} text-xl bg-gradient-to-r ${spec.color} bg-clip-text text-transparent`} />
                  </div>
                  <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${spec.color} bg-opacity-10 text-xs font-semibold bg-clip-text text-transparent border border-quest-border`}>
                    {spec.stats.lessons} Lessons
                  </div>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-quest-text mb-3">{spec.title}</h3>
                <p className="text-sm text-quest-textMuted leading-relaxed mb-5">{spec.description}</p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-quest-textDim">
                  <div className="flex items-center gap-1.5">
                    <i className="ri-book-open-line text-quest-primary" />
                    <span>{spec.stats.lessons} Lessons</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <i className="ri-sword-line text-quest-accent" />
                    <span>{spec.stats.quests} Quests</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <i className="ri-fire-line text-quest-gold" />
                    <span>{spec.stats.projects} Bosses</span>
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