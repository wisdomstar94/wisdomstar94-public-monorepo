import { join } from 'node:path';
import { UserConfig } from 'vite';

export function getViteFrontendConfig(overrideConfig: UserConfig) {
  if (typeof overrideConfig.root !== 'string') {
    throw new Error(`overrideConfig.root is undefined..`);
  }

  const config: UserConfig = {
    publicDir: false,
    resolve: {
      alias: {
        '@/': join(overrideConfig.root, 'src/'),
      },
    },
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
    plugins: overrideConfig.plugins ?? [],
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
