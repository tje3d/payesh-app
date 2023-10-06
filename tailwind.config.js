/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  darkMode: 'class',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'light-surface': '#f7f7f9',
        'dark-surface': '#0f172a',
        'light-surface-2': '#ffffff',
        'dark-surface-2': '#121d35',
        'light-surface-text': '#222222',
        'dark-surface-text': '#9ca3af',
      },
    },
  },
  plugins: [],
}
