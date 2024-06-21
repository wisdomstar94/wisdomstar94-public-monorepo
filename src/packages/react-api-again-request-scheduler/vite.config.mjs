import path from 'path';
import { getCommonViteConfig } from '../../libs/packages-common-lib/src/configs/vite.common.config.mjs';

const PACKAGE_ROOT = __dirname;

const config = getCommonViteConfig({
  root: PACKAGE_ROOT,
  resolve: {
    alias: {
      '#react-indexeddb-manager': path.join(PACKAGE_ROOT, '..', 'react-indexeddb-manager', 'src', 'index.ts'),
      '#react-promise-interval': path.join(PACKAGE_ROOT, '..', 'react-promise-interval', 'src', 'index.ts'),
    },
  },
});

export default config;
