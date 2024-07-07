import { CommonRootLayoutClient } from "../common-root-layout-client/common-root-layout-client.component";
import { ICommonRootLayout } from "./common-root-layout.interface";

export function CommonRootLayout(props: ICommonRootLayout.Props) {
  const {
    menus,
    children,
  } = props;

  return (
    <>
      <main className="w-full relative p-4 box-border flex flex-wrap gap-2">
        <div className="w-full">
          <CommonRootLayoutClient menus={menus}></CommonRootLayoutClient>
        </div>
        <div className="w-full flex flex-wrap gap-2 relative">
          { children }
        </div>
      </main>
    </>
  );
}