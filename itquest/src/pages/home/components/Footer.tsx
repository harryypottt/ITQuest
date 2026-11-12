import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative bg-quest-card border-t border-quest-border">
      <div className="w-full px-4 md:px-8 lg:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-quest-primary to-quest-accent flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <i className="ri-sword-line text-white text-lg" />
              </div>
              <span className="text-lg font-bold text-quest-text tracking-tight">
                IT<span className="text-quest-primary">Quest</span>
              </span>
            </Link>
            <p className="text-sm text-quest-textMuted leading-relaxed mb-4">
              A gamified learning platform for IICT students at Pateros Technological College. Level up your skills through quests, challenges, and real-world projects.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-quest-bg border border-quest-border flex items-center justify-center text-quest-textDim hover:text-quest-primary hover:border-quest-primary/30 transition-all">
                <i className="ri-facebook-line text-lg" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-quest-bg border border-quest-border flex items-center justify-center text-quest-textDim hover:text-quest-primary hover:border-quest-primary/30 transition-all">
                <i className="ri-twitter-x-line text-lg" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-quest-bg border border-quest-border flex items-center justify-center text-quest-textDim hover:text-quest-primary hover:border-quest-primary/30 transition-all">
                <i className="ri-github-line text-lg" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-bold text-quest-text uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-3">
              {['Features', 'How It Works', 'Specializations', 'Boss Quests'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-quest-textMuted hover:text-quest-primary transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-bold text-quest-text uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-3">
              {['Documentation', 'API Reference', 'Community Forum', 'Faculty Portal'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-quest-textMuted hover:text-quest-primary transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-quest-text uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <i className="ri-map-pin-line text-quest-primary mt-0.5" />
                <span className="text-sm text-quest-textMuted">
                  Pateros Technological College<br />
                  IICT Department, Pateros, Metro Manila
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <i className="ri-mail-line text-quest-primary" />
                <span className="text-sm text-quest-textMuted">iict@paterostechnological.edu.ph</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-quest-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-quest-textDim">
            &copy; 2026 IT Quest. Pateros Technological College. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-quest-textDim hover:text-quest-text cursor-pointer transition-colors">Privacy Policy</span>
            <span className="text-xs text-quest-textDim hover:text-quest-text cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}