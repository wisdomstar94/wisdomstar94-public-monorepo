import { FC, ReactNode } from 'react';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '../ui/menubar';
import { Ellipsis } from 'lucide-react';

export type ContextMenuButtonMenuItemType = {
  render: ReactNode;
  onClick: () => void;
};

export type ContextMenuButtonPropsType = {
  children?: ReactNode;
  menuItems: ContextMenuButtonMenuItemType[];
};

export const ContextMenuButton: FC<ContextMenuButtonPropsType> = ({ children, menuItems }) => {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger className="px-1 cursor-pointer focus:bg-transparent">
          {children ?? <Ellipsis className="w-5 h-5 flex-shrink-0 flex-grow-0 text-primary/70" />}
        </MenubarTrigger>
        <MenubarContent>
          {menuItems?.map((item, index) => {
            return (
              <MenubarItem
                key={index}
                onClick={() => {
                  item.onClick();
                }}
              >
                {item.render}
              </MenubarItem>
            );
          })}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};
