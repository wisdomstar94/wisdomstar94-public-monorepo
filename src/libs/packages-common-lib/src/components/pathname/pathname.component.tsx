"use client"

import { usePathname } from "next/navigation";
import { IPathname } from "./pathname.interface";

export function Pathname(props?: IPathname.Props) {
  const pathname = usePathname();
  return pathname;
}