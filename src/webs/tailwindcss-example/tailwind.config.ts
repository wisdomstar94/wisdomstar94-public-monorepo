import type { Config } from 'tailwindcss';
import type { PluginCreator } from 'tailwindcss/types/config';

// https://tailwindcss.com/docs/plugins#static-variants
// css 선택자 종류를 추가하고 싶을 때 사용
const staticVariantPlugin: PluginCreator = ({ addVariant }) => {
  addVariant('my-active', '.my-active &');
  addVariant('hocus', ['&:hover', '&:focus']);
};

// https://tailwindcss.com/docs/plugins#dynamic-variants
// css 선택자 종류를 추가하고 싶을 때 사용하되 값을 동적으로 받아와 반영하고 싶을 때 사용
const dynamicVariantPlugin: PluginCreator = ({ matchVariant }) => {
  matchVariant(
    'nth',
    (value) => {
      return `&:nth-child(${value})`;
    },
    {
      values: {
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        '2n': '2n',
        '3n': '3n',
      },
    }
  );
};

// https://tailwindcss.com/docs/plugins#static-utilities
// 스타일 집합에 대한 클래스를 추가할 때 사용
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
// 스타일 집합에 대한 동적 값(사이즈, 색상 등)을 받아 클래스를 추가할 때 사용
const dynamicUtilitiesPlugin: PluginCreator = ({ matchUtilities, theme }) => {
  // 색상 팔레트를 플랫하게 변환
  const flatColorsObject = theme<Record<string, string | Record<string, string>>>('colors');
  const flatColors: Record<string, string> = {};
  for (const key of Object.keys(flatColorsObject)) {
    const value = flatColorsObject[key];
    if (typeof value === 'string') {
      flatColors[key] = value;
    } else if (typeof value === 'object') {
      for (const valueKey of Object.keys(value)) {
        const newKey = `${key}-${valueKey}`;
        const inValue = value[valueKey];
        flatColors[newKey] = inValue;
      }
    }
  }

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
        // 그렇지만 이렇게 matchUtilities 를 사용해서 필요한 value 를 추가할 수도 있습니다.
      },
    }
  );

  matchUtilities(
    {
      'blur-custom': (value) => ({
        filter: `blur(${value}px)`,
      }),
    },
    {
      values: {
        1: '1', // blur-custom-1 클래스는 1px 블러 효과 적용
        2: '2', // blur-custom-2 클래스는 2px 블러 효과 적용
        5: '5', // blur-custom-5 클래스는 5px 블러 효과 적용
        10: '10', // blur-custom-10 클래스는 10px 블러 효과 적용
      },
    }
  );

  matchUtilities(
    {
      'bg-outline': (value) => ({
        // filter: `blur(${value}px)`,
        '--tw-color': value,
        backgroundColor: `var(--tw-color)`,
        outlineColor: `var(--tw-color)`,
        outlineWidth: '1px',
        outlineOffset: '4px',
        outlineStyle: 'solid',
      }),
    },
    {
      values: flatColors, // Tailwind 에서 기본으로 정의한 색상 팔레트를 가져옵니다.
      type: 'color', // value 의 종류도 지정할 수 있습니다.
    }
  );
};

// https:tailwindcss.com/docs/plugins#adding-components
// button, modal, alert 등 공통적으로 또는 반복적으로 사용되는 UI 에 해당하는 스타일에 대한 클래스를 추가할 때 사용
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

// https://tailwindcss.com/docs/plugins#adding-base-styles
// 기본 태그의 기본 스타일을 지정할 때 사용
const basePlugin: PluginCreator = ({ addBase, theme }) => {
  addBase({
    h1: { fontSize: theme('fontSize.2xl'), fontWeight: 'bolder' },
    h2: { fontSize: theme('fontSize.xl') },
    h3: { fontSize: theme('fontSize.lg') },
  });
};

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../libs/packages-common-lib/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'paperlogy-thin': ['"Paperlogy-Thin"', 'sans-serif'],
        'paperlogy-extralight': ['"Paperlogy-ExtraLight"', 'sans-serif'],
        'paperlogy-light': ['"Paperlogy-Light"', 'sans-serif'],
        'paperlogy-regular': ['"Paperlogy-Regular"', 'sans-serif'],
        'paperlogy-medium': ['"Paperlogy-Medium"', 'sans-serif'],
        'paperlogy-semibold': ['"Paperlogy-SemiBold"', 'sans-serif'],
        'paperlogy-bold': ['"Paperlogy-Bold"', 'sans-serif'],
        'paperlogy-extrabold': ['"Paperlogy-ExtraBold"', 'sans-serif'],
        'paperlogy-black': ['"Paperlogy-Black"', 'sans-serif'],
      },
    },
  },
  plugins: [staticVariantPlugin, staticUtilitiesPlugin, dynamicUtilitiesPlugin, componentsPlugin, basePlugin, dynamicVariantPlugin],
};
export default config;
