import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { platformPreviews } from '@/sampleData/landingData';

export default function PlatformPreviewSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section ref={ref} className="relative py-24 md:py-32 bg-quest-bg overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-500/3 rounded-full blur-3xl -translate-y-1/2" />

      <div className="relative z-10 w-full px-4 md:px-8 lg:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-quest-card border border-quest-border text-xs font-semibold text-quest-accent tracking-wider uppercase mb-4">
            Platform Preview
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-quest-text mb-4">
            Inside the{' '}
            <span className="bg-gradient-to-r from-quest-accent to-quest-primary bg-clip-text text-transparent">
              Arena
            </span>
          </h2>
          <p className="text-quest-textMuted text-base md:text-lg max-w-2xl mx-auto">
            A glimpse at the tools and interfaces that power your learning adventure.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10"
        >
          {platformPreviews.map((preview, index) => (
            <button
              key={preview.id}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === index
                  ? 'bg-quest-card border border-quest-primary/50 text-quest-primary shadow-lg shadow-emerald-500/10'
                  : 'bg-transparent border border-quest-border text-quest-textMuted hover:text-quest-text hover:border-quest-textDim'
              }`}
            >
              {preview.title}
            </button>
          ))}
        </motion.div>

        {/* Preview content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-2xl overflow-hidden border border-quest-border bg-quest-card"
            >
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-quest-border bg-quest-bg/50">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="max-w-md mx-auto h-7 rounded-md bg-quest-card border border-quest-border flex items-center px-3">
                    <i className="ri-lock-line text-quest-textDim text-xs mr-2" />
                    <span className="text-xs text-quest-textDim">itquest.edu/dashboard</span>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={platformPreviews[activeTab].image}
                  alt={platformPreviews[activeTab].title}
                  className="w-full h-full object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-quest-bg/80 via-transparent to-transparent" />

                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-bold text-quest-text mb-2">
                    {platformPreviews[activeTab].title}
                  </h3>
                  <p className="text-sm md:text-base text-quest-textMuted max-w-xl">
                    {platformPreviews[activeTab].description}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}