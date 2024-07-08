import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import './App.css'
import { Test2Page } from './pages/test2-page';
import { TestIndexPage } from './pages/test/test-index-page';
import { IndexPage } from './pages/index-page';
import { GlobalRootLayout } from "./global-root-layout";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<GlobalRootLayout />}>
            <Route path="/*" element={<>root layout..<Outlet /></>}>
              <Route path="" element={<IndexPage />}></Route>
              <Route path="test2" element={<Test2Page />}></Route>
            </Route>
            <Route path="test/*" element={<>other layout..<Outlet /></>}>
              <Route path="" element={<TestIndexPage />}></Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
