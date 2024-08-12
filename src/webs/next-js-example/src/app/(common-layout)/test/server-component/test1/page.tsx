import { ListClient } from "@/components/test/list-client/list-client.component";
import { Suspense } from "react";
import { setTimeout } from "timers/promises";

async function getList() {
  await setTimeout(3000);
  return [new Date().toString(), new Date().toString()];
}

async function List() {
  const list = await getList();
  return <ListClient list={list} />
}

export default function Page() {
  return (
    <div className="w-full">
      <Suspense fallback={<>loading...........</>}>
        <List />
      </Suspense>
    </div>
  );
}