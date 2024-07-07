import { useEffect, useState } from "react";
import { IUseAuthCheck } from "./use-auth-check.interface";
import { TestJwtPayload, getJwtPayload, isValidAccessToken } from "@/server-actions/socket-apply.action";
import { useRouter } from "next/navigation";

export function useAuthCheck(props?: IUseAuthCheck.Props) {
  const [accessToken, setAccessToken] = useState<string | null>();
  const [payload, setPayload] = useState<TestJwtPayload>();
  const [isMounted, setIsMounted] = useState<boolean>();
  const router = useRouter();

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isMounted) return;

    const access_token = localStorage.getItem('access_token');
    if (typeof access_token !== 'string') {
      setAccessToken(null);
      return;
    }

    isValidAccessToken(access_token).then((res) => {
      if (res) {
        return getJwtPayload(access_token);
      } else {
        router.push('/login');
        return;
      }
    }).then((res) => {
      console.log('res', res);
      setAccessToken(access_token);
      setPayload(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]); 

  return {
    accessToken,
    payload,
  };
}