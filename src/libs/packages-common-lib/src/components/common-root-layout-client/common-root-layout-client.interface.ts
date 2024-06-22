import { ReactNode } from "react";

export declare namespace ICommonRootLayoutClient {
  export interface MenuItem {
    name: string;
    href: string;
  }

  export interface Props {
    menus: MenuItem[];
    children?: ReactNode;
  }
}