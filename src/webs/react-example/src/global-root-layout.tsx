import { Outlet, useNavigate } from "react-router-dom";

export function GlobalRootLayout() {
  const navigate = useNavigate();

  return (
    <>
      <div>
        global root layout
      </div>
      <div>
        <button onClick={() => navigate('/')}>/</button>
        <button onClick={() => navigate('/test2')}>/test2</button>
        <button onClick={() => navigate('/test')}>/test</button>
      </div>
      <Outlet />
    </>
  );
}