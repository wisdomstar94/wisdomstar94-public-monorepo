"use client"

// import "@wisdomstar94/react-add-event-listener/style.css";
import { TestBox, useAddEventListener, getVersion } from "@wisdomstar94/react-add-event-listener";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'click',
      eventListener(event) {
        console.log('@window.click', event);
      },
    }
  })

  return (
    <>
      test/basic!  
      <TestBox />
      <div>
        { getVersion() }
      </div>
      <div>
        <button 
          onClick={() => {
            router.back();
          }}>
          뒤로가기
        </button>
      </div>
    </>
  );
}