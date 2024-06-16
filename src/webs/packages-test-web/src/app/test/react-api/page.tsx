"use client"

import { useApi } from "@wisdomstar94/react-api";
import { useEffect } from "react";

interface Item {
  status: {
    verified: boolean;
    sentCount: number;
  };
  _id: string;
  user: string;
  text: string;
  __v: number;
  source: string;
  updatedAt: string;
  type: string;
  createdAt: string;
  deleted: boolean;
  used: boolean;
}

export default function Page() {
  const api = useApi({
    api: () => {
      const controller = new AbortController();

      return {
        fn: async() => {
          const url = new URLSearchParams({
            a: 'bbb'
          });
          const res = await fetch(`https://cat-fact.herokuapp.com/facts/?${url.toString()}`, {
            method: 'get',
            signal: controller.signal,
            // body: url,
          });
          const result: Item[] = await res.json();
          return result;
        },
        cancel() {
          controller.abort();
        },
      };
    },
    enabledAutoFetch: false,
    retryCount: 3,
  });

  useEffect(() => {
    if (api.data === undefined) return;
    console.log('@@@@@@@@ api.data', api.data);
  }, [api.data]);

  useEffect(() => {
    if (api.error === undefined) return;
    console.log('@@@@@@@@ api.error', api.error);
  }, [api.error]);

  return (
    <>
      <div className="w-full relative flex flex-wrap gap-2">
        <div className="w-full relative flex flex-wrap gap-2">
          <div className="w-full relative flex flex-wrap gap-2">
            <button onClick={() => api.fetch()} className="inline-flex px-3 py-1.5 text-xs text-slate-600 border border-slate-400 rounded-lg cursor-pointer hover:bg-slate-100">
              api fetch 하기
            </button>
          </div>
          <div className="w-full relative flex flex-wrap gap-2">
            <button onClick={() => api.cancel()} className="inline-flex px-3 py-1.5 text-xs text-slate-600 border border-slate-400 rounded-lg cursor-pointer hover:bg-slate-100">
              api fetch 취소 하기
            </button>
          </div>
        </div>
        <div className="w-full relative flex flex-wrap gap-2">
          { api.isLoading ? '로딩중...' : '' }
        </div>
        <ul className="w-full relative flex flex-wrap gap-2">
          {
            api.data?.map(item => {
              return (
                <li key={item._id} className="w-full flex flex-wrap relative">
                  <table>
                    <tbody>
                      <tr>
                        <th>
                          status
                        </th>
                        <td>
                          verified: { item.status.verified } <br />
                          sentCount: { item.status.sentCount }
                        </td>
                      </tr>
                      <tr>
                        <th>
                          _id
                        </th>
                        <td>
                          { item._id }
                        </td>
                      </tr>
                      <tr>
                        <th>
                          user
                        </th>
                        <td>
                          { item.user }
                        </td>
                      </tr>
                      <tr>
                        <th>
                          createdAt
                        </th>
                        <td>
                          { item.createdAt }
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </li>
              );
            })
          }
        </ul>
      </div>
    </>
  );
}