"use client"
import { useAddEventListener } from "@/hooks/use-add-event-listener/use-add-event-listener.hook";

export default function Page() {
  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'click',
      eventListener(event) {
        console.log('@click', event);
      },
    }
  });

  return (
    <>
      test/basic!  
    </>
  );
}