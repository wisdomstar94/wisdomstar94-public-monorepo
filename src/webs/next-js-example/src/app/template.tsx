import { TestClient } from "@/components/test/test-client/test-client.component";
import { ReactNode } from "react";

export default function Template(props: { children: ReactNode }) {
  console.log('@[test] template render!');

  return (
    <TestClient where="root template">
      { props.children }
    </TestClient>
  );
  // return props.children;
}