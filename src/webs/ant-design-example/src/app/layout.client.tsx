"use client";

import { StyleProvider } from "@ant-design/cssinjs";
import { FC, ReactNode } from "react"

const RootLayoutClient: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <StyleProvider layer>
        { children }
      </StyleProvider>
    </>
  );
};

export default RootLayoutClient;
