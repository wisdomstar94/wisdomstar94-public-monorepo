import path from 'path';
import { getViteFrontendConfig } from '../../libs/packages-common-lib/src/configs/vite.frontend.config';
import react from '@vitejs/plugin-react';

const PACKAGE_ROOT = __dirname;

const config = getViteFrontendConfig({
  root: PACKAGE_ROOT,
  resolve: {
    alias: {
      '#react-indexeddb-manager': path.join(PACKAGE_ROOT, '..', 'react-indexeddb-manager', 'src', 'index.ts'),
      '#react-promise-interval': path.join(PACKAGE_ROOT, '..', 'react-promise-interval', 'src', 'index.ts'),
    },
  },
  plugins: [react()],
});

export default config;
