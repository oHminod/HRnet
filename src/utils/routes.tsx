// routes.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../pages/home/homePage";
import EmployeesPage from "../pages/employees/employeesPage";
import Layout from "../components/layout";

const Router = () => {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: "employees",
          element: <EmployeesPage />,
        },
        {
          path: "*",
          element: (
            <div className="flex justify-center items-center flex-1">
              <h2 className="text-4xl">404, That page doesn't exist...</h2>
            </div>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={routes} />;
};

export default Router;
