import { ReactNode } from "react";
import { LayoutClient } from "./layout.client";

export default function Layout(props: { children: ReactNode }) {
  return (
    <>
      <div className="w-full flex flex-wrap relative gap-2">
        <div className="w-full flex flex-wrap relative gap-2">
          <LayoutClient />
        </div>
        <div className="w-full flex flex-wrap relative gap-2">
          { props.children }
        </div>
      </div>
    </>
  );
}