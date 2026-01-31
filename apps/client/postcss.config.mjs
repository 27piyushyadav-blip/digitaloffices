/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // SR-DEV: Tailwind v4 specific plugin
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};

export default config;