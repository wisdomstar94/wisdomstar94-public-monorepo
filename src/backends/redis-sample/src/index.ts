import { createClient } from 'redis';

const client = await createClient({
  url: 'redis://default:112233aB@@localhost:6379',
}).connect();

// await client.set('key..', 'value..');
// const value = await client.get('key..');
// console.log('value:', value);
// await client.disconnect();

async function test1() {
  const res1 = await client.json.set("mykey", ".", { habit : ["독서", "게임"] });
  console.log(res1); // OK

  const mykey_value = await client.json.get("mykey", { path: '.' });
  console.log('@mykey_value', mykey_value);
  if (mykey_value === null) return;
  if (typeof mykey_value !== 'object') return;

  // json key append
  const res2 = await client.json.set("mykey", ".", { ...mykey_value, company: ['first-company', '두번째 회사'] });
  console.log(res2); // OK

  const mykey_value2 = await client.json.get("mykey", { path: '.' });
  console.log('@mykey_value', mykey_value2);
}

test1();