import { getCommonViteConfig } from '../../libs/packages-common-lib/src/configs/vite.common.config.mjs';
import path from 'path';

const PACKAGE_ROOT = __dirname;

const config = getCommonViteConfig({
  root: PACKAGE_ROOT,
  resolve: {
    alias: {
      "@/": path.join(__dirname, 'src/'),
    },
  },
  build: {
    rollupOptions: {
      external: ['react', 'react-dom', '@babylonjs/core'],
    },
  },
});

export default config;
