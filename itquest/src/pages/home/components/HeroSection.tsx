import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

function FloatingParticle({ delay, x, size, duration }: { delay: number; x: number; size: number; duration: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-emerald-400/20"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: '100%',
      }}
      animate={{
        y: ['0vh', '-120vh'],
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1, 1, 0.3],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

export default function HeroSection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const handleStartQuest = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const handleSignIn = () => navigate('/login');

  const particles = [
    { delay: 0, x: 10, size: 3, duration: 15 },
    { delay: 2, x: 25, size: 2, duration: 18 },
    { delay: 4, x: 40, size: 4, duration: 12 },
    { delay: 1, x: 55, size: 2, duration: 20 },
    { delay: 6, x: 70, size: 3, duration: 14 },
    { delay: 3, x: 85, size: 2, duration: 16 },
    { delay: 5, x: 15, size: 2, duration: 17 },
    { delay: 7, x: 45, size: 3, duration: 13 },
    { delay: 8, x: 60, size: 2, duration: 19 },
    { delay: 2.5, x: 90, size: 4, duration: 11 },
    { delay: 9, x: 5, size: 2, duration: 21 },
    { delay: 4.5, x: 75, size: 3, duration: 15 },
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-quest-bg"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="absolute inset-0 bg-gradient-radial from-emerald-500/5 via-transparent to-transparent" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <FloatingParticle key={i} {...p} />
        ))}
      </div>

      {/* Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 w-full px-4 md:px-8 lg:px-12 text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-quest-card border border-quest-border mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-quest-primary animate-pulse" />
          <span className="text-xs md:text-sm text-quest-textMuted font-medium">
            Pateros Technological College — IICT Department
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-quest-text leading-tight tracking-tight mb-6"
        >
          <span className="block">Level Up Your</span>
          <span className="block bg-gradient-to-r from-quest-primary via-quest-accent to-quest-gold bg-clip-text text-transparent">
            IT Skills
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-base md:text-lg lg:text-xl text-quest-textMuted max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Embark on an epic quest through coding challenges, quiz battles, and real-world projects.
          Earn XP, unlock badges, and climb from Novice to Legend.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={handleStartQuest}
            className="group px-8 py-4 rounded-xl bg-gradient-to-r from-quest-primary to-quest-accent text-white font-semibold text-base md:text-lg hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 flex items-center gap-3 whitespace-nowrap"
          >
            <i className="ri-sword-line text-xl" />
            Start Your Quest
            <i className="ri-arrow-right-line text-xl group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={handleSignIn}
            className="px-8 py-4 rounded-xl border-2 border-quest-border text-quest-text font-semibold text-base md:text-lg hover:bg-quest-cardHover hover:border-quest-primary/50 transition-all duration-300 whitespace-nowrap"
          >
            Sign In
          </button>
        </motion.div>

        {/* Stats preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mt-16"
        >
          {[
            { value: '500+', label: 'Lessons' },
            { value: '120+', label: 'Quests' },
            { value: '50+', label: 'Boss Quests' },
            { value: '1,200+', label: 'Students' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-xl md:text-2xl font-bold text-quest-text">{stat.value}</div>
              <div className="text-xs md:text-sm text-quest-textMuted">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-quest-border flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-2 rounded-full bg-quest-primary"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}