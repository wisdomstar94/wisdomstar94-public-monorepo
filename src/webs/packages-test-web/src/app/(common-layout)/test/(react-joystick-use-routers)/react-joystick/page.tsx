"use client"

import { Joystick } from "@wisdomstar94/react-joystick";
import styles from "./page.module.css";

export default function Page() {
  return (
    <>
      <Joystick 
        classes={{
          joystickContainerClassName: styles['my-joystick-container'],
          joystickHandlerClassName: styles['my-joystick-handler'],
        }}
        onPressed={(pressKeys) => {
          console.log('@pressKeys', pressKeys);
        }}
        onPressOut={() => {
          console.log('@onPressOut');
        }}
        />    
    </>
  );
}