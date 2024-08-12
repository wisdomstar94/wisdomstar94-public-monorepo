'use client'

import { usePathname, useRouter } from "next/navigation"
import { useTransition } from "react";

export function ListClient(props: { list: string[] }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div>
      <div>
        list client result
      </div>
      <div>
        { JSON.stringify(props.list) }
      </div>
      <div>
        <button onClick={() => {
          startTransition(() => {
            router.replace(pathname + '?time=' + Date.now());
          });
        }}>router.replace</button>
        <div>
          pending : {pending ? 'true' : 'false'}
        </div>
      </div>
    </div>
  )
}