import { createContext, useContext } from "react";
import { EmployeesType, EmployeeType } from "../utils/employeesContext";

export const EmployeesContext = createContext<EmployeesType | undefined>(
  undefined
);
export const SetEmployeesContext = createContext<
  React.Dispatch<React.SetStateAction<EmployeesType>> | undefined
>(undefined);

const useEmployees = () => {
  const employees = useContext(EmployeesContext);
  const setEmployees = useContext(SetEmployeesContext);

  if (!employees || !setEmployees) {
    throw new Error(
      "useEmployees must be used within a EmployeesContextProvider"
    );
  }

  const addEmployee = (employee: EmployeeType) => {
    setEmployees([...employees, employee]);
  };

  const updateEmployee = (employee: EmployeeType) => {
    const updatedEmployees = employees.map((emp) => {
      if (emp.firstName === employee.firstName) {
        return employee;
      }
      return emp;
    });
    setEmployees(updatedEmployees);
  };

  return { employees, addEmployee, updateEmployee };
};

export default useEmployees;
