import { ReactNode } from "react";

export default function Layout(props: { children: ReactNode }) {
  return (
    <>
      <div className="w-full flex flex-wrap gap-2 relative">
        <div className="w-full flex flex-wrap gap-2 relative">
          <h1 className="text-3xl font-extrabold">/test/model-control-v4</h1>
        </div>
        <div className="w-full flex flex-wrap gap-2 relative">
          { props.children }
        </div>
      </div>
    </>
  );
}