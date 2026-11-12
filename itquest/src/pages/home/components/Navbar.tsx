import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignIn = () => navigate('/login');
  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-quest-bg/90 backdrop-blur-xl border-b border-quest-border shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-quest-primary to-quest-accent flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
              <i className="ri-sword-line text-white text-lg md:text-xl" />
            </div>
            <span className="text-lg md:text-xl font-bold text-quest-text tracking-tight">
              IT<span className="text-quest-primary">Quest</span>
            </span>
          </Link>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 mr-2">
                  <div className="w-8 h-8 rounded-full bg-quest-primary/20 border border-quest-primary/30 flex items-center justify-center">
                    <i className="ri-user-line text-quest-primary text-sm" />
                  </div>
                  <span className="text-sm text-quest-text font-medium">{user?.full_name}</span>
                </div>
                <button
                  onClick={handleGetStarted}
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-quest-primary to-quest-accent text-white text-sm font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all whitespace-nowrap"
                >
                  Dashboard
                </button>
                <button
                  onClick={logout}
                  className="px-4 py-2.5 rounded-lg border border-quest-border text-quest-textMuted text-sm font-medium hover:bg-quest-cardHover hover:text-quest-text transition-all whitespace-nowrap"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSignIn}
                  className="px-5 py-2.5 rounded-lg border border-quest-border text-quest-text text-sm font-medium hover:bg-quest-cardHover transition-all whitespace-nowrap"
                >
                  Sign In
                </button>
                <button
                  onClick={handleGetStarted}
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-quest-primary to-quest-accent text-white text-sm font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all whitespace-nowrap"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 rounded-lg border border-quest-border flex items-center justify-center text-quest-text"
          >
            <i className={mobileOpen ? 'ri-close-line text-xl' : 'ri-menu-line text-xl'} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-quest-bg/95 backdrop-blur-xl border-b border-quest-border"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => { handleGetStarted(); setMobileOpen(false); }}
                    className="w-full px-5 py-3 rounded-lg bg-gradient-to-r from-quest-primary to-quest-accent text-white text-sm font-semibold"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="w-full px-5 py-3 rounded-lg border border-quest-border text-quest-textMuted text-sm font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { handleSignIn(); setMobileOpen(false); }}
                    className="w-full px-5 py-3 rounded-lg border border-quest-border text-quest-text text-sm font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { handleGetStarted(); setMobileOpen(false); }}
                    className="w-full px-5 py-3 rounded-lg bg-gradient-to-r from-quest-primary to-quest-accent text-white text-sm font-semibold"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}