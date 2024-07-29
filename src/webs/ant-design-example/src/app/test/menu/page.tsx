"use client"

import { Menu } from "antd";
import { SubMenuType } from "antd/es/menu/interface";

export default function Page() {
  const items: SubMenuType[] = [
    {
      key: '/user',
      label: '회원 관리',
      children: [
        {
          key: '/user/list',
          label: '회원 목록',
        },
        {
          key: '/user/create',
          label: '회원 생성',
        },
      ]
    }
  ];

  const menuKeys: string[] = [];

  items.forEach(item => {
    menuKeys.push(item.key);
    item.children?.forEach(m => {
      if (m?.key !== undefined) {
        menuKeys.push(m.key.toString());
      }
    });
  });

  console.log('@menuKeys', menuKeys);

  return (
    <>
      <div style={{ width: '200px', position: 'relative' }}>
        <Menu 
          style={{ width: '100%' }}
          items={items}
          />
      </div>
      
    </>
  );
}