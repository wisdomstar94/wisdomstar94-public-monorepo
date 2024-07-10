'use server'

interface Params {
  name: string;
  age: number;
}

export async function test(params: Params) {
  console.log('@test.params', params);
  return {
    name: params.name,
    age: params.age,
    timestamp: Date.now(),
  };
}