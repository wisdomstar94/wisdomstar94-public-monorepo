import react from '@vitejs/plugin-react';

const PACKAGE_ROOT = __dirname;

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  root: PACKAGE_ROOT,
  publicDir: false,
  build: {
    ssr: true,
    sourcemap: false,
    target: `modules`,
    outDir: "dist",
    assetsDir: ".",
    minify: true,
    emptyOutDir: false,
    reportCompressedSize: false,
    lib: {
      entry: "src/index.ts",
    },
    rollupOptions: {
      input: "src/index.ts",
      output: [
        { format: 'es', entryFileNames: `[name].mjs` },
        { format: 'cjs', entryFileNames: `[name].cjs` }
      ],
      external: ['react', 'react-dom', 'next', 'tailwindcss'],
    },
  },
  plugins: [
    react(),
  ],
  css: {
    modules: {
      localsConvention: "dashes",
    }
  }
};

export default config;
