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
        // { path: "profile", element: <UserPage /> },
        // {
        //   path: "*",
        //   element: (
        //     <ErrorPage
        //       error={{ status: 404, message: "That page doesn't exist..." }}
        //     />
        //   ),
        // },
      ],
    },
  ]);

  return <RouterProvider router={routes} />;
};

export default Router;
