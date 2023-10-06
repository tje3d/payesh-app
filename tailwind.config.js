/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  darkMode: 'class',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'light-surface': '#f1f5f9',
        'dark-surface': '#111827',
        'light-surface-2': '#ffffff',
        'dark-surface-2': '#1e293b',
        'light-surface-text': '#222222',
        'dark-surface-text': '#9ca3af',
        primary: '#17b8a6',
      },
    },
  },
  plugins: [],
}
