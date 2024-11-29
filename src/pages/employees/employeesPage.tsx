import { useState, useEffect } from "react";
import useEmployees from "../../hooks/useEmployees";
import { EmployeeType } from "../../utils/employeesContext";
import { entries } from "../../utils/data";
import UpdateEmployeePopOver from "./components/updateEmployeePopOver";
import { CircleX } from "lucide-react";

export type Entry = {
  label: string;
  key: keyof EmployeeType;
};

type SortDirection = "ascending" | "descending" | "";
interface SortConfig {
  key: keyof EmployeeType | null;
  direction: SortDirection;
}

const EmployeesPage = () => {
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
  }>({ x: 0, y: 0 });
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
        if (dateA < dateB) {
          return direction === "ascending" ? -1 : 1;
        }
        if (dateA > dateB) {
          return direction === "ascending" ? 1 : -1;
        }
        return 0;
      } else if (key === "zipCode") {
        const numA = parseInt(a[key]);
        const numB = parseInt(b[key]);
        if (numA < numB) {
          return direction === "ascending" ? -1 : 1;
        }
        if (numA > numB) {
          return direction === "ascending" ? 1 : -1;
        }
        return 0;
      } else {
        const valueA = a[key].toLowerCase();
        const valueB = b[key].toLowerCase();
        if (valueA < valueB) {
          return direction === "ascending" ? -1 : 1;
        }
        if (valueA > valueB) {
          return direction === "ascending" ? 1 : -1;
        }
        return 0;
      }
    });
    setSortedEmployees(sorted);
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page after sorting
  };

  const resetSort = () => {
    setSortedEmployees(employees);
    setSortConfig({ key: null, direction: "" });
    setCurrentPage(1); // Reset to first page after reset
  };

  const getSortIcon = (key: keyof EmployeeType) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? " ▲" : " ▼";
    } else {
      return " ▾";
    }
  };

  // Filter logic
  const filteredEmployees = sortedEmployees.filter((employee) =>
    entries.some((entry) =>
      employee[entry.key]
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );

  // Pagination logic
  const totalEmployees = filteredEmployees.length;
  const totalPages = Math.ceil(totalEmployees / itemsPerPage);

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const indexOfLastEmployee = currentPage * itemsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  const pageNumbers: number[] = [];

  if (totalPages <= 5) {
    // If total pages are 3 or less, show all page numbers
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    if (currentPage === 1 || currentPage === 2 || currentPage === 3) {
      // On first page
      pageNumbers.push(1);
      pageNumbers.push(2);
      pageNumbers.push(3);
      pageNumbers.push(4);
      pageNumbers.push(totalPages);
    } else if (
      currentPage === totalPages ||
      currentPage === totalPages - 1 ||
      currentPage === totalPages - 2
    ) {
      // On last page
      pageNumbers.push(1);
      pageNumbers.push(totalPages - 3);
      pageNumbers.push(totalPages - 2);
      pageNumbers.push(totalPages - 1);
      pageNumbers.push(totalPages);
    } else {
      // On any other page
      pageNumbers.push(1);
      if (currentPage > 3) {
        pageNumbers.push(currentPage - 1);
      }
      pageNumbers.push(currentPage);
      if (currentPage < totalPages - 2) {
        pageNumbers.push(currentPage + 1);
      }
      pageNumbers.push(totalPages);
    }
  }

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

  return (
    <>
      <h2 className="text-center text-lg font-semibold pb-8">Employees</h2>

      {/* Barre de recherche */}
      <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
        <div>
          <label htmlFor="itemsPerPage" className="mr-2">
            Show
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border rounded p-1"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="ml-2">entries</span>
        </div>
        {/* Champ de recherche */}
        <div className="relative">
          <label htmlFor="search" className="mr-2">
            Search :
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page after search
            }}
            className="border rounded w-44 p-1 pr-7"
          />
          {searchTerm && (
            <CircleX
              className="absolute right-1 top-[5px] cursor-pointer hover:text-red-500"
              onClick={() => setSearchTerm("")}
            />
          )}
        </div>
      </div>

      <div className="overflow-x-auto xl:overflow-x-visible relative">
        <table className="border-collapse table-auto w-full text-sm">
          <thead className="bg-slate-200">
            <tr>
              {entries.map((entry) => (
                <th
                  key={entry.key}
                  onClick={() => onSort(entry.key)}
                  className="border-b font-medium pl-8 py-4 text-slate-800 text-left cursor-pointer"
                >
                  {entry.label}
                  {getSortIcon(entry.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentEmployees.length > 0 ? (
              currentEmployees.map((employee, index) => (
                <tr className="hover:bg-slate-50" key={index}>
                  {entries.map((entry) => (
                    <td
                      key={entry.key}
                      className="border-b border-slate-100 p-4 pl-8 text-slate-500 cursor-pointer"
                      onClick={(e) => handleCellClick(e, employee, entry.key)}
                    >
                      {employee[entry.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={entries.length}
                  className="text-center p-4 text-slate-500"
                >
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {popoverVisible && selectedEmployee && selectedField && (
        <UpdateEmployeePopOver
          employee={selectedEmployee}
          entryKey={selectedField}
          cursorPosition={cursorPosition}
          visible={popoverVisible}
          onClose={() => setPopoverVisible(false)} // Prop pour fermer le popover
        />
      )}
      {/* Pagination controls */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-end sm:items-center mt-4 gap-4">
        <button
          onClick={resetSort}
          className="bg-blue-500 text-white p-2 rounded-lg order-2 sm:order-1"
        >
          Reset initial order
        </button>
        <div className="flex flex-wrap items-center order-1 sm:order-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`w-20 p-2 rounded-l-lg ${
              currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"
            }`}
          >
            Previous
          </button>
          {pageNumbers.map((item, index) =>
            typeof item === "number" ? (
              <button
                key={item}
                onClick={() => handlePageChange(item)}
                className={`p-2 min-w-10 ${
                  currentPage === item
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {item}
              </button>
            ) : (
              <span
                key={`ellipsis-${index}`}
                className="flex w-10 h-10 items-center justify-center bg-gray-200 text-gray-700"
              >
                {item}
              </span>
            )
          )}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`w-20 p-2 rounded-r-lg ${
              currentPage === totalPages || totalPages === 0
                ? "bg-gray-300"
                : "bg-blue-500 text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default EmployeesPage;
