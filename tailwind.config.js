/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          bg: '#ffedd7',      // Warm, inviting background
          header: '#f4dfc4',  // Soft header background
          pink: '#e14277',    // Vibrant pink (lotus)
          blue: '#69bacf',    // Calming blue (Krishna)
          orange: '#ef9156',  // Energetic orange (flame)
          bhagwa: '#ff7034',  // Sacred saffron
          text: '#1a1a1a',    // Rich black text
          brownText: '#544241', // Earthy brown
          DEFAULT: '#e14277'  // Default primary (lotus pink)
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'expand': 'expand 0.3s ease-out forwards',
        'collapse': 'collapse 0.3s ease-out forwards'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        glow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 }
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 }
        },
        expand: {
          '0%': { maxHeight: '0', opacity: 0 },
          '100%': { maxHeight: '500px', opacity: 1 }
        },
        collapse: {
          '0%': { maxHeight: '500px', opacity: 1 },
          '100%': { maxHeight: '0', opacity: 0 }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};