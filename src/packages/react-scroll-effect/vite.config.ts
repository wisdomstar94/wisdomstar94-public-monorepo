import { getViteFrontendConfig } from '../../libs/packages-common-lib/src/configs/vite.frontend.config';
import react from '@vitejs/plugin-react';

const PACKAGE_ROOT = __dirname;

const config = getViteFrontendConfig({
  root: PACKAGE_ROOT,
  plugins: [react()],
});

export default config;
