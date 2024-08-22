// import withLess from "next-with-less";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    staleTimes: {
      dynamic: 0,
    },
  },
};

// const lessConfig = withLess(nextConfig);
// export default lessConfig;
export default nextConfig;
