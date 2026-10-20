/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cacao: {
          950: '#0F0907',
          900: '#1A100C',
          800: '#2A1A14',
          700: '#3D261D',
          600: '#59382B',
        },
        gold: {
          300: '#F5D78E',
          400: '#E8B954',
          500: '#D49B2A',
          600: '#B07B19',
        },
        berry: {
          500: '#E11D48',
          600: '#BE123C',
        }
      },
    },
  },
  plugins: [],
};
