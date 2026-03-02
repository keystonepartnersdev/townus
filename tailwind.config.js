/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // CSS 변수를 Tailwind 클래스로 매핑
        primary: {
          DEFAULT: 'var(--color-primary)',
          50: '#f8fafc',
          500: 'var(--color-primary)',
          600: '#0f2a3d',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          50: '#eff6ff',
          500: 'var(--color-secondary)',
          600: '#1d4ed8',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          50: '#ecfdf5',
          500: 'var(--color-accent)',
          600: '#059669',
        },
        neutral: {
          dark: 'var(--color-neutral-dark)',
          light: 'var(--color-neutral-light)',
        },
        error: 'var(--color-error)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
      },
      
      spacing: {
        // CSS 변수 기반 간격
        'xs': 'var(--spacing-xs)', // 4px
        'sm': 'var(--spacing-sm)', // 8px  
        'md': 'var(--spacing-md)', // 16px
        'lg': 'var(--spacing-lg)', // 24px
        'xl': 'var(--spacing-xl)', // 32px
        '2xl': 'var(--spacing-2xl)', // 40px
        '3xl': 'var(--spacing-3xl)', // 60px
        '4xl': 'var(--spacing-4xl)', // 80px
      },
      
      borderRadius: {
        // CSS 변수 기반 반지름
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)', 
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      
      boxShadow: {
        // CSS 변수 기반 그림자
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
      },
      
      fontSize: {
        // CSS 변수 기반 폰트 크기
        'xs': 'var(--text-xs)',
        'sm': 'var(--text-sm)',
        'base': 'var(--text-base)',
        'lg': 'var(--text-lg)',
        'xl': 'var(--text-xl)',
        '2xl': 'var(--text-2xl)',
        '3xl': 'var(--text-3xl)',
        '4xl': 'var(--text-4xl)',
      },
      
      transitionDuration: {
        // CSS 변수 기반 트랜지션
        'fast': '150ms',
        'normal': '300ms', 
        'slow': '500ms',
      },
      
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
      },
      
      animation: {
        'fade-in': 'fadeIn 500ms ease-out',
        'slide-in': 'slideIn 500ms ease-out',  
        'slide-up': 'slideUp 500ms ease-out',
        'scale-in': 'scaleIn 300ms ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounce: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
          '40%, 43%': { transform: 'translate3d(0,-30px,0)' },
          '70%': { transform: 'translate3d(0,-15px,0)' },
          '90%': { transform: 'translate3d(0,-4px,0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}