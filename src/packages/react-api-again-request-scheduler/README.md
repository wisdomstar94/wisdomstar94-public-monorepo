# react-api-again-request-scheduler

api 요청 후 정상 응답을 받지 못했을 경우, 해당 api 요청 정보를 indexeddb 에 저장해놓고 특정 만료일까지 일정 주기마다 성공할 때까지 재요청 보내는 기능인 리액트 훅을 제공합니다.