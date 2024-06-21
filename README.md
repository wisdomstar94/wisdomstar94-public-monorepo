# wisdomstar94-public-monorepo
여러 패키지를 포함하고 있는 모노레포 입니다. github action 을 이용해 ci, cd 가 진행되도록 설정하였습니다.

<br />
<br />

# 이 모노레포에서 관리되는 package 목록

| 패키지명 | 이 모노레포에서 해당하는 경로 | 설명 | 
| --- | --- | --- | 
| [@wisdomstar94/react-add-event-listener](https://www.npmjs.com/package/@wisdomstar94/react-add-event-listener) | src/packages/react-add-event-listener | `addEventListener` 함수를 react 에 최적화 한 `hooks` 함수를 제공합니다. | 
| [@wisdomstar94/react-api](https://www.npmjs.com/package/@wisdomstar94/react-api) | src/packages/react-api | 클라이언트에서 api 호출시 관련된 상태 관리에 유용한 `hooks` 함수를 제공합니다. | 
| [@wisdomstar94/react-api-again-request-scheduler](https://www.npmjs.com/package/@wisdomstar94/react-api-again-request-scheduler) | src/packages/react-api-again-request-scheduler | api 호출이 실패했을 경우 해당 호출 정보를 저장해 두었다가 일정 주기마다 일정 만료일까지 계속 재호출 하는 기능을 제공하는 `hooks` 함수를 제공합니다. |
| [@wisdomstar94/react-body](https://www.npmjs.com/package/@wisdomstar94/react-body) | src/packages/react-body | body 태그에 스크롤 방지 및 텍스트 드래그 방지를 적용할 수 있는 `hooks` 함수를 제공합니다. | 
| [@wisdomstar94/react-indexeddb-manager](https://www.npmjs.com/package/@wisdomstar94/react-indexeddb-manager) | src/packages/react-indexeddb-manager | `indexeddb` 를 react 에서 편리하게 사용할 수 있도록 관련된 `hooks` 함수를 제공합니다. | 
| [@wisdomstar94/react-multiple-api-manager](https://www.npmjs.com/package/@wisdomstar94/react-multiple-api-manager) | src/packages/react-multiple-api-manager | react 에서 여러 api 를 동시에 호출 할 때 유용한 `hooks` 함수를 제공합니다. | 
| [@wisdomstar94/react-promise-interval](https://www.npmjs.com/package/@wisdomstar94/react-promise-interval) | src/packages/react-promise-interval | react 에서 특정 promise 비동기 작업이 성공할 때 까지 주기적으로 계속 실행하는 `hooks` 함수를 제공합니다. | 
