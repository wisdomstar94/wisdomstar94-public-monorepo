"use client";

export default function Page() {
  return (
    <>
      <div>
        <button
          onClick={() => {
            fetch('/api/test?page=1&size=10', {
              method: 'get',
            }).then((res) => {
              console.log('@res', res);
            });
          }}
          >
          /api/test api call!
        </button>
      </div>
    </>
  );
}