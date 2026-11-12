/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        quest: {
          bg: '#0a0a0f',
          card: '#12121a',
          cardHover: '#1a1a25',
          border: '#2a2a3a',
          primary: '#10b981',
          primaryGlow: '#34d399',
          accent: '#06b6d4',
          gold: '#f59e0b',
          goldGlow: '#fbbf24',
          danger: '#f43f5e',
          dangerGlow: '#fb7185',
          text: '#f1f5f9',
          textMuted: '#94a3b8',
          textDim: '#64748b',
        }
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #10b98140, 0 0 20px #10b98120' },
          '100%': { boxShadow: '0 0 20px #10b98160, 0 0 40px #10b98140' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(16,185,129,0.15), transparent)',
      },
    },
  },
  plugins: [],
}