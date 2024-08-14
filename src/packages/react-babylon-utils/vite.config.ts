import { getViteFrontendConfig } from '../../libs/packages-common-lib/src/configs/vite.frontend.config';
import react from '@vitejs/plugin-react';
import path from 'path';

const PACKAGE_ROOT = __dirname;

const config = getViteFrontendConfig({
  root: PACKAGE_ROOT,
  resolve: {
    alias: {
      "@/": path.join(__dirname, 'src/'),
    },
  },
  build: {
    rollupOptions: {
      external: ['react', 'react-dom', '@babylonjs/core', 'animejs'],
    },
  },
  plugins: [react()],
});

export default config;
