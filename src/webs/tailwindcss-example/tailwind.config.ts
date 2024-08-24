import type { Config } from 'tailwindcss';
import type { PluginCreator } from 'tailwindcss/types/config';

// https://tailwindcss.com/docs/plugins#static-variants
const staticVariantPlugin: PluginCreator = ({ addVariant }) => {
  addVariant('my-active', '.my-active &');
};

// https://tailwindcss.com/docs/plugins#static-utilities
const staticUtilitiesPlugin: PluginCreator = ({ addUtilities }) => {
  addUtilities({
    '.common-container': {
      width: '100%',
      display: 'flex',
      'flex-wrap': 'wrap',
      gap: '8px',
      position: 'relative',
    },
  });
};

// https://tailwindcss.com/docs/plugins#dynamic-utilities
const dynamicUtilitiesPlugin: PluginCreator = ({ matchUtilities, theme }) => {
  matchUtilities(
    {
      rotate: (value) => ({
        '--tw-rotate': `${value}deg`,
        transform: `rotate(var(--tw-rotate))`,
      }),
    },
    {
      values: {
        15: '15', // rotate-15 클래스는 15도 회전
        30: '30', // rotate-30 클래스는 30도 회전
        60: '60', // rotate-60 클래스는 60도 회전
        120: '120', // rotate-120 클래스는 120도 회전
        // 원래 rotate-{deg} 클래스는 테일윈드에서 0, 1, 2, 3, 6, 12, 45, 90, 180 만 지원합니다.
        // 그렇지만 이렇게 matchUtilities 를 사용해서 필요한 value 를 추가할 수 있습니다.
      },
    }
  );
};

// https:tailwindcss.com/docs/plugins#adding-components
const componentsPlugin: PluginCreator = ({ addComponents }) => {
  addComponents({
    '.btn': {
      padding: '.5rem 1rem',
      borderRadius: '.25rem',
      fontWeight: '600',
    },
    '.btn-blue': {
      backgroundColor: '#3490dc',
      color: '#fff',
      '&:hover': {
        backgroundColor: '#2779bd',
      },
    },
    '.btn-red': {
      backgroundColor: '#e3342f',
      color: '#fff',
      '&:hover': {
        backgroundColor: '#cc1f1a',
      },
    },
  });
};

const config: Config = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}', '../../libs/packages-common-lib/src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      // ...
    },
  },
  plugins: [staticVariantPlugin, staticUtilitiesPlugin, dynamicUtilitiesPlugin, componentsPlugin],
};
export default config;
