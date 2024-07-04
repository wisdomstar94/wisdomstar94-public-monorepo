"use client";

import { Col, Row } from "antd";

export default function Page() {
  return (
    <>
      {/* 
        Col flex 값을 그냥 숫자로만 주게 되면, 안의 컨텐츠 크기에 따라서 Col 의 너비가 변동이 될 수 있다.
        그렇기 때문에 콘텐츠 내용과 상관없이 일정 비율로 동일하게 Col 의 너비를 지정해주고 싶다면, flex 값을 '비율 0' 형태로 주어야 한다.
      */}
      <Row>
        <Col flex={'120px'} style={{ backgroundClip: 'content-box', boxSizing: 'initial', backgroundColor: '#ff0' }}>left area</Col>
        <Col flex={'auto'} style={{ backgroundClip: 'content-box', boxSizing: 'initial', backgroundColor: '#f00' }}>right area</Col>
      </Row>
      <Row>
        <Col flex={'120px'} style={{ backgroundClip: 'content-box', boxSizing: 'initial', backgroundColor: '#ff0' }}>left area... ... ...</Col>
        <Col flex={'auto'} style={{ backgroundClip: 'content-box', boxSizing: 'initial', backgroundColor: '#f00' }}>right area</Col>
      </Row>
    </>
  );
}
