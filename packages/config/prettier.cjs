/** @type {import("prettier").Config} */
module.exports = {
  // Core formatting
  semi: true,
  tabWidth: 2,
  useTabs: false,
  printWidth: 80,
  endOfLine: 'lf',

  // Quotes & commas
  singleQuote: true,
  jsxSingleQuote: false,
  trailingComma: 'all',
  quoteProps: 'as-needed',

  // Layout
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  singleAttributePerLine: false,

  // Prose
  proseWrap: 'preserve',

  // Base plugins (language / structure level)
  plugins: ['prettier-plugin-packagejson'],
};
