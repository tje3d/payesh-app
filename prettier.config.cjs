module.exports = {
  useTabs: false,
  singleQuote: true,
  trailingComma: 'all',
  tabWidth: 2,
  semi: false,
  printWidth: 100,
  plugins: ['prettier-plugin-svelte', 'prettier-plugin-tailwindcss'],
  pluginSearchDirs: ['.'],
  overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }],
}
