import { ReactNode } from "react";

export default function Layout(props: { children: ReactNode }) {
  console.log('@[test] layout render!');

  return props.children;
}