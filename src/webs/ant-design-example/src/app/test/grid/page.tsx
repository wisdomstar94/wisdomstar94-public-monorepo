"use client";

import { Col, Flex, Row } from "antd";

export default function Page() {
  return (
    <>
      <Row gutter={[10, 20]} align='stretch'>
        <Col span={6} style={{ backgroundClip: 'content-box', backgroundColor: '#ff0' }}>
          <Flex>1</Flex>
        </Col>
        <Col span={6} style={{ backgroundClip: 'content-box', backgroundColor: '#ff0' }}>
          <Flex>2<br />2.1<br />2.2</Flex>
        </Col>
        <Col span={6} style={{ backgroundClip: 'content-box', backgroundColor: '#ff0' }}>
          <Flex>3</Flex>
        </Col>
        <Col span={6} style={{ backgroundClip: 'content-box', backgroundColor: '#ff0' }}>
          <Flex>4</Flex>
        </Col>
        <Col span={6} style={{ backgroundClip: 'content-box', backgroundColor: '#ff0' }}>
          <Flex>5</Flex>
        </Col>
        <Col span={6} style={{ backgroundClip: 'content-box', backgroundColor: '#ff0' }}>
          <Flex>6</Flex>
        </Col>
        <Col span={6} style={{ backgroundClip: 'content-box', backgroundColor: '#ff0' }}>
          <Flex>7</Flex>
        </Col>
        <Col span={6} style={{ backgroundClip: 'content-box', backgroundColor: '#ff0' }}>
          <Flex>8</Flex>
        </Col>
      </Row>
    </>
  );
}
