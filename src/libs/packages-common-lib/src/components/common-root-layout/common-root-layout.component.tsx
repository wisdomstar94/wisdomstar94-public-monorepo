import Link from "next/link";
import { ICommonRootLayout } from "./common-root-layout.interface";

export function CommonRootLayout(props: ICommonRootLayout.Props) {
  const {
    menus,
    children,
  } = props;

  return (
    <>
      <html lang="ko">
        <body>
          <main className="w-full relative p-4 box-border flex flex-wrap gap-2">
            <div className="w-full">
              <ul className="w-full flex flex-wrap gap-2 relative">
                {
                  menus.map((menu) => {
                    return (
                      <li key={menu.href}>
                        <Link href={menu.href} className="inline-flex px-4 py-2 cursor-pointer border border-slate-400 text-slate-600 text-xs hover:bg-slate-100">{ menu.name }</Link>
                      </li>
                    );
                  }) 
                }
              </ul>
            </div>
            <div className="w-full flex flex-wrap gap-2 relative">
              { children }
            </div>
          </main>
        </body>
      </html>
      
    </>
  );
}