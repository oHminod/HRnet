// layout.tsx
import { Outlet } from "react-router-dom";
import Header from "./header";

const Layout = () => {
  return (
    <>
      <Header />
      <main className="mt-16 p-4 h-full">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
