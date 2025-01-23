import { EmployeeType } from "../../../utils/employeesContext";
import { Entry } from "../employeesPage";

type TableProps = {
  entries: Entry[];
  onSort: (key: keyof EmployeeType) => void;
  getSortIcon: (key: keyof EmployeeType) => " ▲" | " ▼" | " ▾";
  currentEmployees: EmployeeType[];
  handleCellClick: (
    e: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
    employee: EmployeeType,
    fieldKey: keyof EmployeeType
  ) => void;
};

const Table = ({
  entries,
  onSort,
  getSortIcon,
  currentEmployees,
  handleCellClick,
}: TableProps) => {
  return (
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
                  {entry.key === "dateOfBirth" || entry.key === "startDate"
                    ? employee[entry.key].split("-").reverse().join("/")
                    : employee[entry.key]}
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
  );
};

export default Table;
