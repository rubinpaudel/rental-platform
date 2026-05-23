/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        paper: '#ffffff',
        ink: {
          DEFAULT: '#0a0a0a',
          soft: '#525252',
          faint: '#a3a3a3',
        },
        line: {
          DEFAULT: '#e5e5e5',
          strong: '#d4d4d4',
        },
        accent: {
          DEFAULT: '#171717',
          hover: '#000000',
          soft: '#f5f5f5',
        },
        danger: {
          DEFAULT: '#b91c1c',
          soft: '#fef2f2',
        },
        success: {
          DEFAULT: '#15803d',
          soft: '#f0fdf4',
        },
      },
    },
  },
  plugins: [],
};
