"use client";

import { Col, Flex, Row } from "antd";

export default function Page() {
  return (
    <>
      <Row gutter={[10, 20]} align='stretch'>
        {/* order 를 이용하여 배치 순서를 조정할 수 있다. 1부터 오름차순으로 정렬된다. */}
        <Col span={3} order={4} style={{ backgroundClip: 'content-box', backgroundColor: '#ff0' }}>
          <Flex>1</Flex>
        </Col>
        <Col span={3} order={3} style={{ backgroundClip: 'content-box', backgroundColor: '#ff0' }}>
          <Flex>2<br />2.1<br />2.2</Flex>
        </Col>
        <Col span={3} order={7} style={{ backgroundClip: 'content-box', backgroundColor: '#ff0' }}>
          <Flex>3</Flex>
        </Col>
        {/* 4 pass.. */}
        <Col span={3} order={1} style={{ backgroundClip: 'content-box', backgroundColor: '#ff0' }}>
          <Flex>5</Flex>
        </Col>
        <Col span={3} order={2} style={{ backgroundClip: 'content-box', backgroundColor: '#ff0' }}>
          <Flex>6</Flex>
        </Col>
        <Col span={3} order={6} style={{ backgroundClip: 'content-box', backgroundColor: '#ff0' }}>
          <Flex>7</Flex>
        </Col>
        <Col span={3} order={5} offset={3} style={{ backgroundClip: 'content-box', backgroundColor: '#ff0' }}>
          <Flex>8</Flex>
        </Col>
      </Row>
    </>
  );
}
