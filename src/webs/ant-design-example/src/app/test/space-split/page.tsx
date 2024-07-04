"use client";

import { UploadOutlined } from "@ant-design/icons";
import { Button, Divider, Flex, Popconfirm, Space, Upload } from "antd";

export default function Page() {
  return (
    <>
      <Space split={<Divider type="vertical" style={{ borderColor: '#f00' }} />}>
        Space
        <Button type="primary">Button</Button>
        <Upload>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
        <Popconfirm title="Are you sure delete this task?" okText="Yes" cancelText="No">
          <Button>Confirm</Button>
        </Popconfirm>
      </Space>
      <Flex style={{ width: '100%' }}>&nbsp;</Flex>
      <Space split={<Divider style={{ borderColor: '#f00' }} />} direction="vertical">
        Space
        <Button type="primary">Button</Button>
        <Upload>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
        <Popconfirm title="Are you sure delete this task?" okText="Yes" cancelText="No">
          <Button>Confirm</Button>
        </Popconfirm>
      </Space>
    </>
  );
}
