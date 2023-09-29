/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  darkMode: 'class',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'light-surface': '#f7f7f9',
        'dark-surface': '#282a42',
        'light-surface-2': '#ffffff',
        'dark-surface-2': '#2f314c',
        'light-surface-text': '#222222',
        'dark-surface-text': '#ececec',
      },
    },
  },
  plugins: [],
}
