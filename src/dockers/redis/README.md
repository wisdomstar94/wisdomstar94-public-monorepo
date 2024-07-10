# redis

## redis-stack 에 대해
https://hub.docker.com/r/redis/redis-stack

## redis configuration file 확인 가능 url
https://redis.io/docs/latest/operate/oss_and_stack/management/config/

## 컨테이너 내부로 들어가는 방법
```
docker exec -it {컨테이너ID} bash
```

## 컨테이너 내부에서 redis-cli 접근하는 방법
```
redis-cli
```
만약 value 에 저장한 한글이 인코딩 되서 나올 경우 아래 명령어로 redis-cli 접근
```
redis-cli --raw
```

## redis-cli 에서 로그인 하는 방법
```
127.0.0.1:6379> AUTH 112233aB@
```

## redis json command 문서
https://redis.io/docs/latest/operate/oss_and_stack/stack-with-enterprise/json/commands/
https://redis.io/docs/latest/develop/data-types/json/

## redis-cli 에서 json 이용하는 방법
```
127.0.0.1:6379> JSON.SET mykey $ '{"habit": ["book", "game"]}'
OK
127.0.0.1:6379> JSON.GET mykey
{"habit":["book","game"]}
127.0.0.1:6379> JSON.SET mykey $.company '["first-company", "second-company"]'
OK
127.0.0.1:6379> JSON.GET mykey
{"habit":["book","game"],"company":["book","game"]}
127.0.0.1:6379>
```