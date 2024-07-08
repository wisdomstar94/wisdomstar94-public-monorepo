export function Banana() {
  return (
    <>
      <div>
        banana
      </div>
      <div>
        {
          Array.from({ length: 1000000 }).map((_, index) => (
            <div key={index}>
              {index}
            </div>
          ))
        }
      </div>
    </>
  );
}