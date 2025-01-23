// updateEmployeePopOver.tsx
import { useEffect, useRef, useState } from "react";
import useEmployees from "../../../hooks/useEmployees";
import { EmployeeType } from "../../../utils/employeesContext";
import { CircleCheck, CircleX } from "lucide-react";
import { departmentsList, statesList } from "../../../utils/data";
import { CustomSelect, DatePicker } from "hrnet-components-ohm";

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

  const updateEmp = () => {
    if (inputBuffer !== employee[entryKey]) {
      updateEmployee({ ...employee, [entryKey]: inputBuffer });
      onClose();
    }
  };

  const handleClickCheck = () => {
    updateEmp();
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      if (e.key === "Enter") {
        updateEmp();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      | string
  ) => {
    if (typeof e === "string") {
      setInputBuffer(e);
      return;
    }
    setInputBuffer(e.target.value);
  };

  const handlezipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 5 && !isNaN(Number(value))) {
      setInputBuffer(value);
    }
  };

  const dynamicInput = (entryKey: keyof EmployeeType) => {
    if (entryKey === "department") {
      return (
        <CustomSelect
          options={departmentsList}
          placeholder="Choose Department"
          name="department"
          defaultValue={inputBuffer}
          onOptionChange={(value) => handleInputChange(value)}
        />
      );
    }
    if (entryKey === "dateOfBirth" || entryKey === "startDate") {
      return (
        <DatePicker
          value={inputBuffer}
          onChange={(date) => setInputBuffer(date)}
        />
      );
    }
    if (entryKey === "state") {
      return (
        <CustomSelect
          options={statesList}
          placeholder="Choose State"
          name="state"
          defaultValue={inputBuffer}
          onOptionChange={(value) => handleInputChange(value)}
        />
      );
    }
    if (entryKey === "zipCode") {
      return (
        <input
          type="text"
          value={inputBuffer}
          onChange={handlezipCodeChange}
          placeholder={entryKey}
          className="border p-1 rounded"
        />
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
      <button onClick={() => onClose()} className="hover:text-red-500">
        <CircleX />
      </button>
      <button onClick={handleClickCheck} className="hover:text-green-500">
        <CircleCheck />{" "}
      </button>
    </div>
  );
};

export default UpdateEmployeePopOver;
