import { UserConfig } from "vite";

export function getViteBackendConfig(overrideConfig: UserConfig) {
  const config: UserConfig = {
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
