import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0b',
        brand: '#ab9ff2',
        paper: '#fefefe',
        yellow: '#f59e0b',
        blue: '#3b82f6',
        pink: '#ec4899',
        green: '#10b981',
        lavender: '#a78bfa',
        orange: '#f97316',
        vanilla: '#fef3c7',
        plum: '#7c3aed',
      },
    },
  },
  plugins: [],
};

export default config;

