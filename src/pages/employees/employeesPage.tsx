import { EmployeeType } from "../../utils/employeesContext";
import { entries } from "../../utils/data";
import UpdateEmployeePopOver from "./components/updateEmployeePopOver";
import { CircleX } from "lucide-react";
import Select from "../../components/Select";
import { useEmployeesPage } from "./components/useEmployeesPage";

export type Entry = {
  label: string;
  key: keyof EmployeeType;
};

const EmployeesPage = () => {
  const {
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
    onSort,
    resetSort,
    getSortIcon,
    handleItemsPerPageChange,
    handlePageChange,
    handleCellClick,
    setSearchTerm,
    closePopover,
  } = useEmployeesPage({ entries });

  return (
    <>
      <h2 className="text-center text-lg font-semibold pb-8">Employees</h2>

      {/* Barre de recherche */}
      <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
        <div>
          <label htmlFor="itemsPerPage" className="mr-2">
            Show
          </label>
          <Select
            defaultValue={itemsPerPage}
            placeholder={itemsPerPage.toString()}
            onOptionChange={(value) => handleItemsPerPageChange(value)}
            options={[1, 2, 10, 25, 50, 100]}
          />
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
              handlePageChange(1); // Reset to first page after search
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
          onClose={closePopover} // Prop pour fermer le popover
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
              currentPage === 1
                ? "bg-gray-300 hover:cursor-not-allowed"
                : "bg-blue-500 text-white"
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
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
                ? "bg-gray-300 hover:cursor-not-allowed"
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
