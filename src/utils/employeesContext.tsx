// employeesContext.tsx
"use client";
import React from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { EmployeesContext, SetEmployeesContext } from "../hooks/useEmployees";

export type EmployeeType = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  startDate: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  department: string;
  id: string;
};
export type EmployeesType = EmployeeType[];

const initialValues: EmployeeType[] = [];

export function EmployeesContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [employees, setEmployees] = useLocalStorage<EmployeesType>(
    "employees",
    initialValues
  );

  return (
    <EmployeesContext.Provider value={employees}>
      <SetEmployeesContext.Provider value={setEmployees}>
        {children}
      </SetEmployeesContext.Provider>
    </EmployeesContext.Provider>
  );
}

export default EmployeesContextProvider;
