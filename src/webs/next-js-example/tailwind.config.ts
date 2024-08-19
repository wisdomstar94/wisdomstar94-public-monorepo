import { getCommonTailwindConfig } from "../../libs/packages-common-lib/src/configs/tailwind.common.config";
import ContainerQueriesPlugin from '@tailwindcss/container-queries';

const config = getCommonTailwindConfig({
  theme: {
    extend: {
      containers: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [
    ContainerQueriesPlugin,
  ],
});
export default config;
