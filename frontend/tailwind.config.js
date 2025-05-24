/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'media',
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: 'var(--primary)',
            50: 'var(--primary-50)',
            100: 'var(--primary-100)',
            200: 'var(--primary-200)',
            300: 'var(--primary-300)',
            400: 'var(--primary-400)',
            500: 'var(--primary-500)',
            600: 'var(--primary-600)',
            700: 'var(--primary-700)', 
            800: 'var(--primary-800)', // Not "pink"
            900: 'var(--primary-900)',
            950: 'var(--primary-950)',
          },
        },
        fontSize: {
          xs: '0.45rem',     // 12px
          sm: '0.575rem',    // 14px
          base: '.8rem',      // 16px (default)
          lg: '0.825rem',    // 18px
          xl: '0.95rem',     // 20px
          '2xl': '1.2rem',   // 24px
          '3xl': '1.575rem', // 30px
          '4xl': '1.95rem',  // 36px
          '5xl': '2.70rem',     // 48px
          '6xl': '3.70rem',     // 64px
        },
        fontFamily: {
          sans: ['var(--font-inter)'],
          mono: ['var(--font-roboto-mono)'],
        },
      },
    },
    plugins: [],
  }