import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Font: must match brand.font.family in src/shared/config/brand.ts
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // ── Tokens extendidos (light/dark aware) ──
        surface: {
          DEFAULT: 'hsl(var(--surface))',
          elevated: 'hsl(var(--surface-elevated))',
          sunken: 'hsl(var(--surface-sunken))',
        },
        hairline: 'hsl(var(--hairline))',
        neon: {
          DEFAULT: 'hsl(var(--neon))',
          foreground: 'hsl(var(--neon-foreground))',
          secondary: 'hsl(var(--neon-secondary))',
          tertiary: 'hsl(var(--neon-tertiary))',
        },
        glow: 'hsl(var(--glow))',
        'on-surface': {
          DEFAULT: 'hsl(var(--on-surface))',
          muted: 'hsl(var(--on-surface-muted))',
        },
        'on-neon': 'hsl(var(--on-neon))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear',
        marquee: 'marquee var(--duration) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
        shimmer: 'shimmer 8s infinite',
        gradient: 'gradient 8s linear infinite',
        pulse: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce-slow 3s ease-in-out infinite',
        'wave-left': 'wave-left 2s ease-in-out infinite',
        'wave-right': 'wave-right 2s ease-in-out infinite 0.5s',
        'sound-wave': 'sound-wave 8s ease-in-out infinite',
        'sound-wave-reverse': 'sound-wave 6s ease-in-out infinite reverse',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 20s ease-in-out infinite',
        'drift-horizontal': 'drift-horizontal 25s ease-in-out infinite',
        'note-float': 'note-float 8s ease-in-out infinite',
        'gradient-x': 'gradient-x 3s ease infinite',
        equalizer: 'equalizer var(--duration, 0.5s) ease-in-out infinite alternate',
      },
      keyframes: {
        'border-beam': {
          '100%': {
            'offset-distance': '100%',
          },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap)))' },
        },
        shimmer: {
          '0%, 90%, 100%': {
            'background-position': 'calc(-100% - var(--shimmer-width)) 0',
          },
          '30%, 60%': {
            'background-position': 'calc(100% + var(--shimmer-width)) 0',
          },
        },
        gradient: {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
        'bounce-slow': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        'wave-left': {
          '0%, 100%': {
            transform: 'translateY(-50%) rotate(-10deg)',
          },
          '50%': {
            transform: 'translateY(-50%) rotate(-30deg)',
          },
        },
        'wave-right': {
          '0%, 100%': {
            transform: 'translateY(-50%) rotate(10deg)',
          },
          '50%': {
            transform: 'translateY(-50%) rotate(30deg)',
          },
        },
        'sound-wave': {
          '0%, 100%': {
            transform: 'translateX(0)',
          },
          '50%': {
            transform: 'translateX(-25px)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0) scale(1)',
            opacity: '0.4',
          },
          '50%': {
            transform: 'translateY(-20px) scale(1.2)',
            opacity: '0.8',
          },
        },
        'float-slow': {
          '0%, 100%': {
            transform: 'translateY(0) translateX(0)',
          },
          '25%': {
            transform: 'translateY(-15px) translateX(10px)',
          },
          '50%': {
            transform: 'translateY(-5px) translateX(-5px)',
          },
          '75%': {
            transform: 'translateY(-20px) translateX(5px)',
          },
        },
        'drift-horizontal': {
          '0%': {
            transform: 'translateX(-5%)',
          },
          '50%': {
            transform: 'translateX(5%)',
          },
          '100%': {
            transform: 'translateX(-5%)',
          },
        },
        'note-float': {
          '0%': {
            transform: 'translateY(0) rotate(0deg)',
            opacity: '0.3',
          },
          '25%': {
            transform: 'translateY(-30px) rotate(5deg)',
            opacity: '0.6',
          },
          '50%': {
            transform: 'translateY(-15px) rotate(-3deg)',
            opacity: '0.4',
          },
          '75%': {
            transform: 'translateY(-40px) rotate(3deg)',
            opacity: '0.7',
          },
          '100%': {
            transform: 'translateY(0) rotate(0deg)',
            opacity: '0.3',
          },
        },
        'gradient-x': {
          '0%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
          '100%': {
            'background-position': '0% 50%',
          },
        },
        equalizer: {
          '0%': {
            height: 'var(--eq-min, 20%)',
          },
          '100%': {
            height: 'var(--eq-max, 80%)',
          },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
