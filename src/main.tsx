import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Router from "./utils/routes";
import EmployeesContextProvider from "./utils/employeesContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EmployeesContextProvider>
      <Router />
    </EmployeesContextProvider>
  </StrictMode>
);
