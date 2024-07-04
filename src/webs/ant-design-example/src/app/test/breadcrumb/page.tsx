"use client";

import { Breadcrumb } from "antd";

export default function Page() {
  return (
    <>
      <Breadcrumb
        separator=">>>"
        items={[
          {
            title: 'Home',
          },
          {
            title: <a href="">Application Center</a>,
          },
          {
            title: <a href="">Application List</a>,
          },
          {
            title: 'An Application',
          },
        ]}
      />
    </>
  );
}
