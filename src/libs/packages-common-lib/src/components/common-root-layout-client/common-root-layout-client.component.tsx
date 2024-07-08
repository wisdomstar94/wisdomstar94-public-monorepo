"use client"

import Link from "next/link";
import { ICommonRootLayoutClient } from "./common-root-layout-client.interface";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { classes } from "../../utils/index";

export function CommonRootLayoutClient(props: ICommonRootLayoutClient.Props) {
  const { menus } = props;
  const pathname = usePathname();

  useEffect(() => {
    // console.log('@pathname', pathname);
  }, [pathname]);

  return (
    <>
      <ul className="w-full flex flex-wrap gap-2 relative">
        {
          menus.map((menu) => {
            return (
              <li key={menu.href}>
                <Link 
                  scroll={false}
                  href={menu.href} 
                  className={classes(
                    "inline-flex px-4 py-2 cursor-pointer border border-slate-400 text-slate-600 text-xs hover:bg-slate-100",
                    pathname === menu.href ? "bg-blue-400 text-white hover:!bg-blue-500" : undefined
                  )}>
                  { menu.name }
                </Link>
              </li>
            );
          }) 
        }
      </ul>
    </>
  );
}