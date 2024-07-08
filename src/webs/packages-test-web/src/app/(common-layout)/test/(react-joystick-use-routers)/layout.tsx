import { ReactNode } from "react";
import "@wisdomstar94/react-joystick/style.css";

export default function Layout(props: { children: ReactNode }) {
  return (
    <>
      { props.children }
    </>
  );
}