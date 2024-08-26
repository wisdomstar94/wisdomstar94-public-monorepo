import { Flex } from "antd";
import { FC, ReactNode } from "react";
import './test-item.css';

export const TestItem: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Flex className="my-test-item">
      { children }
    </Flex>
  );
};

