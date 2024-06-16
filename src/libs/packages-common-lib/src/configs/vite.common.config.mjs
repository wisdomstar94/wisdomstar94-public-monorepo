import react from '@vitejs/plugin-react';

/**
 * @param {import('vite').UserConfig} overrideConfig 
 */
export function getCommonViteConfig(overrideConfig) {
  /**
   * @type {import('vite').UserConfig}
   * @see https://vitejs.dev/config/
   */
  const config = {
    publicDir: false,
    ...overrideConfig,
    build: {
      ssr: true,
      sourcemap: false,
      target: `modules`,
      outDir: "dist",
      assetsDir: ".",
      minify: true,
      emptyOutDir: false,
      reportCompressedSize: false,
      ...overrideConfig?.build,
      lib: {
        entry: "src/index.ts",
        ...overrideConfig?.build?.lib,
      },
      rollupOptions: {
        input: "src/index.ts",
        ...overrideConfig?.build?.rollupOptions,
        output: overrideConfig?.build?.rollupOptions?.output ?? [
          { format: 'es', entryFileNames: `[name].mjs` },
          { format: 'cjs', entryFileNames: `[name].cjs` }
        ],
        external: overrideConfig?.build?.rollupOptions?.external ?? [
          'react', 
          'react-dom', 
          'next', 
          'tailwindcss'
        ],
      },
    },
    plugins: overrideConfig.plugins ?? [
      react(),
    ],
    css: {
      ...overrideConfig?.css,
      modules: {
        localsConvention: "dashes",
        ...overrideConfig?.css?.modules,
      }
    }
  };
  return config;
}
