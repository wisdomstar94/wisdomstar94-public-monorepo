import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  /**
   * 배포된 github pages 가 https://wisdomstar94.github.io/wisdomstar94-public-monorepo 으로 시작하므로
   * basePath 를 "/wisdomstar94-public-monorepo" 으로 지정.
   */
  basePath: '/wisdomstar94-public-monorepo',
  output: 'export',
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

export default withMDX(nextConfig);
