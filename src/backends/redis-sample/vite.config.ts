import { getViteBackendConfig } from '../../libs/packages-common-lib/src/configs/vite.backend.config';

const PACKAGE_ROOT = __dirname;

const config = getViteBackendConfig({
  root: PACKAGE_ROOT,
  build: {
    target: 'esnext'
  }
});

export default config;