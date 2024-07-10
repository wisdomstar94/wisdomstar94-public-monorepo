import { getBackendViteConfig } from '../../libs/packages-common-lib/src/configs/vite.backend.config.mjs';

const PACKAGE_ROOT = __dirname;

const config = getBackendViteConfig({
  root: PACKAGE_ROOT,
  build: {
    target: 'esnext'
  }
});

export default config;
