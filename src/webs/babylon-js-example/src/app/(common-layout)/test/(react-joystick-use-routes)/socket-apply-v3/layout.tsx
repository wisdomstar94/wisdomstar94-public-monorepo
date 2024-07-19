import { AuthCheck } from "@/components/auth-check/auth-check.component";
import { Viewport } from "next";
import { ReactNode } from "react";

export const viewport: Viewport = {
  userScalable: false,
};

export default function Layout(props: { children: ReactNode }) {
  return (
    <>
      <AuthCheck>
        { props.children }
      </AuthCheck>
    </>
  );
}