"use client"

import { UseIdPageContent } from "@/components/test/use-id-page-content/use-id-page-content.component";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <>
      <div className="w-full h-full bg-black/80 fixed top-0 left-0 flex flex-wrap justify-center items-center">
        <div className="w-full h-full absolute top-0 left-0 z-10" onClick={() => router.back()}>

        </div>
        <div className="w-full max-w-[800px] h-full max-h-[600px] m-4 relative bg-white rounded-md shadow-lg z-20">
          <UseIdPageContent />
        </div>
      </div>
    </>
  );
}