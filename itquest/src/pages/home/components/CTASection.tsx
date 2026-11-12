import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const handleSignIn = () => navigate('/login');

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-quest-card via-quest-bg to-quest-bg" />
      <div className="absolute inset-0 bg-hero-glow opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-3xl" />

      <div className="relative z-10 w-full px-4 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Decorative icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-quest-primary to-quest-accent flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/20"
          >
            <i className="ri-rocket-line text-white text-3xl" />
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-quest-text mb-6 leading-tight">
            Start Your{' '}
            <span className="bg-gradient-to-r from-quest-primary via-quest-accent to-quest-gold bg-clip-text text-transparent">
              IT Journey
            </span>
          </h2>

          <p className="text-base md:text-lg lg:text-xl text-quest-textMuted max-w-2xl mx-auto mb-10 leading-relaxed">
            Join hundreds of IICT students at Pateros Technological College who are already leveling up their skills. Your quest begins now.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleGetStarted}
              className="group px-8 py-4 rounded-xl bg-gradient-to-r from-quest-primary to-quest-accent text-white font-semibold text-base md:text-lg hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 flex items-center gap-3 whitespace-nowrap"
            >
              <i className="ri-sword-line text-xl" />
              Get Started Free
              <i className="ri-arrow-right-line text-xl group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={handleSignIn}
              className="px-8 py-4 rounded-xl border-2 border-quest-border text-quest-text font-semibold text-base md:text-lg hover:bg-quest-card hover:border-quest-primary/50 transition-all duration-300 whitespace-nowrap"
            >
              Sign In
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mt-12 text-xs md:text-sm text-quest-textDim">
            <div className="flex items-center gap-2">
              <i className="ri-shield-check-line text-quest-primary" />
              <span>Secure Authentication</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="ri-award-line text-quest-gold" />
              <span>Verified by Faculty</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="ri-group-line text-quest-accent" />
              <span>1,200+ Active Students</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}