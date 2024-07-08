import { ReactNode } from "react";
import "@wisdomstar94/react-add-event-listener/style.css";
import { LayoutClient } from "./layout.client";

export default function Layout(props: { children: ReactNode }) {
  return (
    <>
      { props.children }
      <LayoutClient></LayoutClient>
    </>
  );
}