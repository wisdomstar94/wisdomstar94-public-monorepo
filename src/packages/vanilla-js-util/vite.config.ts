import { getViteFrontendConfig } from '../../libs/packages-common-lib/src/configs/vite.frontend.config';

const PACKAGE_ROOT = __dirname;

const config = getViteFrontendConfig({
  root: PACKAGE_ROOT,
  build: {
    ssr: false,
  },
});

export default config;
