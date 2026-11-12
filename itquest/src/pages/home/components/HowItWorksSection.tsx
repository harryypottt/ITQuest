import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { howItWorksSteps } from '@/sampleData/landingData';

export default function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-24 md:py-32 bg-quest-card overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
      }} />

      <div className="relative z-10 w-full px-4 md:px-8 lg:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-quest-bg border border-quest-border text-xs font-semibold text-quest-accent tracking-wider uppercase mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-quest-text mb-4">
            Your Path to{' '}
            <span className="bg-gradient-to-r from-quest-accent to-quest-gold bg-clip-text text-transparent">
              Legend
            </span>
          </h2>
          <p className="text-quest-textMuted text-base md:text-lg max-w-2xl mx-auto">
            Follow the progression flow. Every step earns XP, every milestone unlocks new challenges.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-quest-border via-quest-primary/30 to-quest-border" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className="relative text-center"
              >
                {/* Step number circle */}
                <div className="relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-full bg-quest-bg border-2 border-quest-border mx-auto mb-6 flex items-center justify-center group-hover:border-quest-primary transition-colors">
                  <span className="text-lg md:text-xl font-bold text-quest-primary">{step.step}</span>
                </div>

                {/* Arrow on desktop (except last) */}
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden lg:flex absolute top-7 left-[calc(50%+2rem)] right-[calc(50%-2rem)] items-center justify-center">
                    <i className="ri-arrow-right-line text-quest-textDim text-lg" />
                  </div>
                )}

                <div className="bg-quest-bg rounded-xl p-6 border border-quest-border hover:border-quest-primary/30 transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-quest-card border border-quest-border flex items-center justify-center mx-auto mb-4">
                    <i className={`${step.icon} text-quest-accent text-lg`} />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-quest-text mb-2">{step.title}</h3>
                  <p className="text-sm text-quest-textMuted leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}