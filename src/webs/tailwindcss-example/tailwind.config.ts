import type { Config } from 'tailwindcss';
import type { PluginCreator } from 'tailwindcss/types/config';

const variantPlugin: PluginCreator = ({ addVariant }) => {
  addVariant('my-active', '.my-active &');
};

const config: Config = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}', '../../libs/packages-common-lib/src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      // ...
    },
  },
  plugins: [variantPlugin],
};
export default config;
