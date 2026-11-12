import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { features } from '@/sampleData/landingData';

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-24 md:py-32 bg-quest-bg overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 w-full px-4 md:px-8 lg:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-quest-card border border-quest-border text-xs font-semibold text-quest-primary tracking-wider uppercase mb-4">
            Core Features
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-quest-text mb-4">
            Your Arsenal for{' '}
            <span className="bg-gradient-to-r from-quest-primary to-quest-accent bg-clip-text text-transparent">
              Mastery
            </span>
          </h2>
          <p className="text-quest-textMuted text-base md:text-lg max-w-2xl mx-auto">
            A complete suite of gamified learning tools designed to transform passive studying into an epic adventure.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-6 md:p-8 rounded-2xl bg-quest-card border border-quest-border hover:border-quest-primary/30 transition-all duration-500 hover:-translate-y-1"
            >
              {/* Hover glow */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.bgGlow} border border-quest-border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <i className={`${feature.icon} ${feature.color} text-2xl`} />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-quest-text mb-3">{feature.title}</h3>
                <p className="text-sm md:text-base text-quest-textMuted leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}