import "./globals.css";

import "./global-less.less";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'next-js-example'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        { children }
      </body>
    </html>
  )
};
