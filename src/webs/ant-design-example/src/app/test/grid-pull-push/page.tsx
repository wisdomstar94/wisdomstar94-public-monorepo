"use client";

import { Col, Flex, Row } from "antd";

export default function Page() {
  return (
    <>
      <Row gutter={[10, 20]} align='stretch'>
        <Col span={3} style={{ backgroundClip: 'content-box', backgroundColor: '#ff0' }}>
          <Flex>1</Flex>
        </Col>
        <Col span={3} style={{ backgroundClip: 'content-box', backgroundColor: '#ff0' }}>
          <Flex>2<br />2.1<br />2.2</Flex>
        </Col>
        <Col span={3} style={{ backgroundClip: 'content-box', backgroundColor: '#ff0' }}>
          <Flex>3</Flex>
        </Col>
        {/* 4 pass.. */}
        {/* push 는 Col 을 오른쪽으로 translateX 시킨 효과와 같다. */}
        {/* pull 은 Col 을 왼쪽으로 translateX 시킨 효과와 같다. */}
        {/* push 와 pull 모두 기재되어 있으면 push 만 적용 된다. */}
        <Col push={0} pull={1} span={3} style={{ backgroundClip: 'content-box', backgroundColor: '#ff0' }}>
          <Flex>5</Flex>
        </Col>
        <Col span={3} style={{ backgroundClip: 'content-box', backgroundColor: '#ff0' }}>
          <Flex>6</Flex>
        </Col>
        <Col span={3} style={{ backgroundClip: 'content-box', backgroundColor: '#ff0' }}>
          <Flex>7</Flex>
        </Col>
        <Col span={3} style={{ backgroundClip: 'content-box', backgroundColor: '#ff0' }}>
          <Flex>8</Flex>
        </Col>
      </Row>
    </>
  );
}
