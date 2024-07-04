/**
 * @param {import('vite').UserConfig} overrideConfig 
 */
export function getBackendViteConfig(overrideConfig) {
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
        ],
        external: overrideConfig?.build?.rollupOptions?.external ?? [],
      },
    },
    plugins: overrideConfig.plugins ?? [],
    css: {
      ...overrideConfig?.css,
      modules: {
        ...overrideConfig?.css?.modules,
      }
    }
  };
  return config;
}
