"use client"

import { useEffect, useState } from "react";
import { IAuthCheck } from "./auth-check.interface";
import { useRouter } from "next/navigation";
import { isValidAccessToken } from "@/server-actions/socket-apply.action";

export function AuthCheck(props: IAuthCheck.Props) {
  const [isAuthed, setIsAuthed] = useState<boolean>();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const access_token = localStorage.getItem('access_token');
    if (typeof access_token !== 'string') {
      setIsAuthed(false);
      router.push('/login');
      return;
    }

    isValidAccessToken(access_token).then((res) => {
      setIsAuthed(res);
      if (!res) {
        router.push('/login');
      }
    }).catch((err) => {
      console.error(err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      { isAuthed === undefined ? <>Loading..</> : null }
      { isAuthed === true ? props.children : null }
      { isAuthed === false ? null : null }
    </>
  );
}