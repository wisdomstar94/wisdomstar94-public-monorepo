import { getCommonViteConfig } from '../../libs/packages-common-lib/src/configs/vite.common.config.mjs';

const PACKAGE_ROOT = __dirname;

const config = getCommonViteConfig({
  root: PACKAGE_ROOT,
});

export default config;
