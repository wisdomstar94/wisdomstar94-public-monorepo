import { TestClient } from "@/components/test/test-client/test-client.component";
import { ReactNode } from "react";

export default function Template(props: { children: ReactNode }) {
  console.log('@(common-layout) template render!');

  return (
    <TestClient where="(common-layout) template"> 
      { props.children }
    </TestClient>
  );
  // return  props.children;
}