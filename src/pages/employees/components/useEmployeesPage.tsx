import { useState, useEffect, useMemo } from "react";
import { Entry } from "../employeesPage";
import { EmployeeType } from "../../../utils/employeesContext";
import useEmployees from "../../../hooks/useEmployees";

type SortDirection = "ascending" | "descending" | "";
type SortConfig = {
  key: keyof EmployeeType | null;
  direction: SortDirection;
};

type UseEmployeesPageProps = {
  entries: Entry[];
};

export const useEmployeesPage = ({ entries }: UseEmployeesPageProps) => {
  const { employees } = useEmployees();

  const [sortedEmployees, setSortedEmployees] = useState<EmployeeType[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "",
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeType | null>(
    null
  );
  const [selectedField, setSelectedField] = useState<keyof EmployeeType | null>(
    null
  );
  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });
  const [popoverVisible, setPopoverVisible] = useState<boolean>(false);

  useEffect(() => {
    setSortedEmployees(employees);
  }, [employees]);

  const onSort = (key: keyof EmployeeType) => {
    let direction: SortDirection = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    const sorted = [...employees].sort((a, b) => {
      if (key === "dateOfBirth" || key === "startDate") {
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        if (dateA < dateB) return direction === "ascending" ? -1 : 1;
        if (dateA > dateB) return direction === "ascending" ? 1 : -1;
        return 0;
      } else if (key === "zipCode") {
        const numA = parseInt(a[key]);
        const numB = parseInt(b[key]);
        if (numA < numB) return direction === "ascending" ? -1 : 1;
        if (numA > numB) return direction === "ascending" ? 1 : -1;
        return 0;
      } else {
        const valueA = a[key].toLowerCase();
        const valueB = b[key].toLowerCase();
        if (valueA < valueB) return direction === "ascending" ? -1 : 1;
        if (valueA > valueB) return direction === "ascending" ? 1 : -1;
        return 0;
      }
    });
    setSortedEmployees(sorted);
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset à la première page
  };

  const resetSort = () => {
    setSortedEmployees(employees);
    setSortConfig({ key: null, direction: "" });
    setCurrentPage(1);
  };

  const getSortIcon = (key: keyof EmployeeType) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? " ▲" : " ▼";
    } else {
      return " ▾";
    }
  };

  // Filtrage
  const filteredEmployees = useMemo(() => {
    return sortedEmployees.filter((employee) =>
      entries.some((entry) =>
        employee[entry.key]
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [sortedEmployees, entries, searchTerm]);

  // Pagination
  const totalEmployees = filteredEmployees.length;
  const totalPages = Math.ceil(totalEmployees / itemsPerPage);
  const indexOfLastEmployee = currentPage * itemsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  // Génération des numéros de page
  const pageNumbers: number[] = useMemo(() => {
    const pages: number[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          currentPage - 1,
          currentPage,
          currentPage + 1,
          totalPages
        );
      }
    }
    return pages;
  }, [totalPages, currentPage]);

  const handleItemsPerPageChange = (e: number) => {
    setItemsPerPage(e);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCellClick = (
    e: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
    employee: EmployeeType,
    fieldKey: keyof EmployeeType
  ) => {
    const x = e.clientX;
    const y = e.clientY;
    setSelectedEmployee(employee);
    setSelectedField(fieldKey);
    setCursorPosition({ x, y });
    setPopoverVisible(true);
  };

  const closePopover = () => setPopoverVisible(false);

  return {
    currentEmployees,
    pageNumbers,
    currentPage,
    totalPages,
    itemsPerPage,
    searchTerm,
    popoverVisible,
    selectedEmployee,
    selectedField,
    cursorPosition,
    sortConfig,
    onSort,
    resetSort,
    getSortIcon,
    handleItemsPerPageChange,
    handlePageChange,
    handleCellClick,
    setSearchTerm,
    closePopover,
  };
};
