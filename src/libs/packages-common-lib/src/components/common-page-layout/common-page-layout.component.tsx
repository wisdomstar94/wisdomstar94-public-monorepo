import { Pathname } from "../pathname/pathname.component";
import { ICommonPageLayout } from "./common-page-layout.interface";

export function CommonPageLayout(props: ICommonPageLayout.Props) {
  return (
    <>
      <div className="w-full flex flex-wrap gap-2 relative">
        <div className="w-full flex flex-wrap gap-2 relative">
          <h1 className="text-3xl font-extrabold"><Pathname /></h1>
        </div>
        <div className="w-full flex flex-wrap gap-2 relative">
          { props.children }
        </div>
      </div>
    </>
  )
}