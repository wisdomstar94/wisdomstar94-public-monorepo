import { FC } from "react"

const Layout: FC<NextLayoutDefaultProps> = ({ children }) => {
  console.log('@cache/page2 layout render...');
  return children;
};

export default Layout;