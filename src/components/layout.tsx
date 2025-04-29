// layout.tsx
import { Outlet } from "react-router-dom";
import Header from "./header";

const Layout = () => {
  return (
    <>
      <Header />
      <main className="flex flex-col pb-4 px-4 pt-24 flex-1">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
