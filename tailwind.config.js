/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7f8',
          100: '#cceef0',
          200: '#99dde1',
          300: '#66ccd2',
          400: '#33bbc3',
          500: '#0CA6AC', // primary
          600: '#0a8589',
          700: '#076467',
          800: '#054244',
          900: '#032122',
        },
        secondary: {
          50: '#e6eaef',
          100: '#ccd5df',
          200: '#99abbf',
          300: '#66829f',
          400: '#33587f',
          500: '#0E3854', // secondary
          600: '#0b2d43',
          700: '#082232',
          800: '#051622',
          900: '#030b11',
        },
        accent: {
          50: '#fef8e7',
          100: '#fdf1cf',
          200: '#fbe39f',
          300: '#fad46f',
          400: '#f8c63f',
          500: '#F9BB2D', // accent
          600: '#c79624',
          700: '#95701b',
          800: '#644b12',
          900: '#322509',
        },
        success: {
          500: '#22c55e',
        },
        warning: {
          500: '#f97316',
        },
        error: {
          500: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        dropdown: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'sm': '0.25rem',
        DEFAULT: '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
      },
      transitionDuration: {
        DEFAULT: '300ms',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};