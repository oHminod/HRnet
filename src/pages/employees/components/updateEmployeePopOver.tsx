// updateEmployeePopOver.tsx
import { useEffect, useRef, useState } from "react";
import useEmployees from "../../../hooks/useEmployees";
import { EmployeeType } from "../../../utils/employeesContext";
import { CircleX } from "lucide-react";
import { departmentsList, statesList } from "../../../utils/data";
import DatePicker from "../../../components/datePicker/DatePicker";

interface UpdateEmployeePopOverProps {
  employee: EmployeeType;
  entryKey: keyof EmployeeType;
  cursorPosition: { x: number; y: number };
  visible: boolean;
  onClose: () => void;
}

const UpdateEmployeePopOver = ({
  employee,
  entryKey,
  cursorPosition,
  visible,
  onClose,
}: UpdateEmployeePopOverProps) => {
  const { updateEmployee } = useEmployees();
  const [inputBuffer, setInputBuffer] = useState(employee[entryKey]);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popoverPosition, setPopoverPosition] = useState<{
    top: number;
    left: number;
  }>({
    top: cursorPosition.y,
    left: cursorPosition.x,
  });

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      if (e.key === "Enter") {
        updateEmployee({ ...employee, [entryKey]: inputBuffer });
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [employee, entryKey, inputBuffer, updateEmployee, onClose]);

  useEffect(() => {
    if (popoverRef.current) {
      const popoverRect = popoverRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;

      let newLeft = cursorPosition.x;
      const padding = 10; // Espace entre le popover et le bord de la fenêtre

      // Vérifier si le popover dépasse du côté droit
      if (cursorPosition.x + popoverRect.width + padding > windowWidth) {
        newLeft = cursorPosition.x - popoverRect.width;
      }

      // Vérifier si le popover dépasse du côté gauche
      if (newLeft < padding) {
        newLeft = padding;
      }

      setPopoverPosition({
        top: cursorPosition.y,
        left: newLeft,
      });
    }
  }, [cursorPosition, visible]);

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setInputBuffer(e.target.value);
  };

  const dynamicInput = (entryKey: keyof EmployeeType) => {
    if (entryKey === "department") {
      return (
        <select
          value={inputBuffer}
          onChange={handleInputChange}
          className="border p-1 rounded"
        >
          {departmentsList.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>
      );
    }
    if (entryKey === "dateOfBirth" || entryKey === "startDate") {
      return (
        <DatePicker
          value={inputBuffer}
          onChange={(date) => setInputBuffer(date)}
        />
        // <input
        //   type="date"
        //   value={inputBuffer}
        //   onChange={handleInputChange}
        //   className="border p-1 rounded"
        // />
      );
    }
    if (entryKey === "state") {
      return (
        <select
          value={inputBuffer}
          onChange={handleInputChange}
          className="border p-1 rounded"
        >
          {statesList.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      );
    }
    return (
      <input
        type="text"
        value={inputBuffer}
        onChange={handleInputChange}
        placeholder={entryKey}
        className="border p-1 rounded"
      />
    );
  };

  if (!visible) return null;

  return (
    <div
      ref={popoverRef}
      className="absolute bg-white border rounded-md shadow-lg p-2 z-50 flex gap-2 items-center"
      style={{ top: popoverPosition.top, left: popoverPosition.left }}
    >
      {dynamicInput(entryKey)}
      <button onClick={() => onClose()}>
        <CircleX />
      </button>
    </div>
  );
};

export default UpdateEmployeePopOver;
