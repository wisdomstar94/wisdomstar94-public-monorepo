import { ReactNode } from "react";

export declare namespace ICommonRootLayout {
  export interface MenuItem {
    name: string;
    href: string;
  }

  export interface Props {
    menus: MenuItem[];
    children?: ReactNode;
  }
}