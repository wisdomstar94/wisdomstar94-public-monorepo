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
| [@wisdomstar94/react-promise-interval](https://www.npmjs.com/package/@wisdomstar94/react-promise-interval) | src/packages/react-promise-interval | setInterval 을 react 용으로 랩핑한 `hook` 을 제공합니다. | 
| [@wisdomstar94/react-request-animation-frame-manager](https://www.npmjs.com/package/@wisdomstar94/react-request-animation-frame-manager) | src/packages/react-request-animation-frame-manager | `requestAnimationFrame` 함수를 리액트 환경에 맞게 사용할 수 있도록 관련 훅을 제공합니다. | 
| [@wisdomstar94/react-joystick](https://www.npmjs.com/package/@wisdomstar94/react-joystick) | src/packages/react-joystick | 상하좌우 및 대각선 방향으로 조이스틱 핸들러를 조작할 수 있는 리액트용 `component` 를 제공합니다. 키보드의 방향키를 대체하는 용도로도 사용할 수도 있습니다. | 
| [@wisdomstar94/react-babylon-utils](https://www.npmjs.com/package/@wisdomstar94/react-babylon-utils) | src/packages/react-babylon-utils | [babylon.js](https://www.babylonjs.com/) 를 좀 더 편하게 사용할 수 있도록 이와 관련된 리액트용 `component`, `hook` 을 제공합니다. | 
| [@wisdomstar94/react-keyboard-manager](https://www.npmjs.com/package/@wisdomstar94/react-keyboard-manager) | src/packages/react-keyboard-manager | 키보드 입력과 관련된 처리를 위한 리액트용 `hook` 을 제공합니다. | 
| [@wisdomstar94/react-touch-container](https://www.npmjs.com/package/@wisdomstar94/react-touch-container) | src/packages/react-touch-container | touch 또는 mousedown 이벤트를 이용하여 사용자가 터치 했는지 아닌지 여부를 알 수 있도록 해주는 기능을 제공하는 리액트용 `component` 를 제공합니다. <br /><br /> 해당 컴포넌트는 PC와 Mobile 환경에서 모두 사용가능하며 Mobile 환경인 경우에는 멀티 터치 상황에서도 동작하도록 설계되었습니다. | 
| [@wisdomstar94/react-socketio-manager](https://www.npmjs.com/package/@wisdomstar94/react-socketio-manager) | src/packages/react-socketio-manager | socket.io 클라이언트 패키지를 react 에서 사용하기 편한 `hook` 을 제공합니다. | 
| [@wisdomstar94/react-promise-timeout](https://www.npmjs.com/package/@wisdomstar94/react-promise-timeout) | src/packages/react-promise-timeout | setTimeout 을 react 용으로 랩핑한 `hook` 을 제공합니다. | 
| [@wisdomstar94/react-web-rtc-manager](https://www.npmjs.com/package/@wisdomstar94/react-web-rtc-manager) | src/packages/react-web-rtc-manager | web rtc 이용에 있어서 편의를 위한 리액트 `hook` 을 제공합니다. | 

<br />

각 패키지별 예제 코드는 본 모노레포의 `src/webs/packages-test-web/src/app/test` 경로를 참고해주세요. 예제 페이지는 `yarn @wisdomstar94/packages-test-web dev` 명령어로 열 수 있습니다. 

<br />

`@wisdomstar94/react-babylon-utils` 패키지에 대한 예제 코드는 `src/webs/babylon-js-example/src/app/test` 경로를 참고해주세요.