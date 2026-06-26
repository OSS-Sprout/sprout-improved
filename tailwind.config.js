/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Schibsted Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#1f2a23', paper: '#f3f1e9', card: '#fbfaf4', line: '#e2dfd0', mute: '#79786a',
        brand: { 50:'#eef6ef',100:'#d6ebd8',200:'#aed8b2',500:'#4c9a5a',600:'#2f7d43',700:'#235e33',900:'#163d22' },
        clay: '#c47a4e', sun: '#e0b13c', rose: '#b1442f',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(31,42,35,.04), 0 16px 40px -18px rgba(31,42,35,.26)',
        lift: '0 24px 56px -20px rgba(31,42,35,.36)',
      },
      borderRadius: { '4xl': '1.8rem', '5xl': '2.4rem' },
      keyframes: {
        fadeUp: { '0%':{opacity:0,transform:'translateY(16px)'},'100%':{opacity:1,transform:'none'} },
      },
      animation: { fadeUp:'fadeUp .6s cubic-bezier(.2,.7,.2,1) both' },
    },
  },
  plugins: [],
}
