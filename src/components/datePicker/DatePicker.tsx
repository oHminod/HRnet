import { useState, useRef, useEffect } from "react";
import { Calendar } from "lucide-react";
import { parseDateFromInput } from "./utils/parseDate";

interface DatePickerProps {
  name?: string;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

const DatePicker = ({
  name,
  value,
  placeholder = "jj/mm/aaaa",
  onChange,
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatDisplayDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  const [inputValue, setInputValue] = useState<string>(
    value ? formatDisplayDate(new Date(value)) : ""
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(
    selectedDate || new Date()
  );
  const datepickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datepickerRef.current &&
        !datepickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDatepicker = () => {
    setIsOpen(!isOpen);
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const parseInputDate = (input: string): Date | null => {
    const parts = input.split("/");
    if (parts.length !== 3) {
      return null;
    }
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    if (
      date.getFullYear() === year &&
      date.getMonth() === month &&
      date.getDate() === day
    ) {
      return date;
    }
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // Si l'entrée est vide, on reset
    if (input.trim().length === 0) {
      setInputValue("");
      setSelectedDate(null);
      if (onChange) onChange("");
      return;
    }

    // Limiter l'entrée à 8 chiffres (JJMMAAAA) sans compter les '/'
    const digits = input.replace(/\D/g, "").slice(0, 8);
    const formattedInput = parseDateFromInput(digits);

    setInputValue(formattedInput);

    // Tenter de parse la date complète si possible
    const date = parseInputDate(formattedInput);
    if (date) {
      setSelectedDate(date);
      setCurrentMonth(date);
      if (onChange) onChange(formatDate(date));
    } else {
      setSelectedDate(null);
      if (onChange) onChange("");
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setInputValue(formatDisplayDate(date));
    setIsOpen(false);
    if (onChange) {
      onChange(formatDate(date));
    }
  };

  const getWeekDay = (date: Date) => {
    return (date.getDay() + 6) % 7;
  };

  const renderDays = () => {
    const days: JSX.Element[] = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(firstDayOfMonth.getDate() - getWeekDay(firstDayOfMonth));

    const endDate = new Date(lastDayOfMonth);
    endDate.setDate(
      lastDayOfMonth.getDate() + (6 - getWeekDay(lastDayOfMonth))
    );

    const date = new Date(startDate);

    while (date <= endDate) {
      const dateCopy = new Date(date);

      const isCurrentMonth = dateCopy.getMonth() === month;
      const isSelected =
        selectedDate &&
        dateCopy.getFullYear() === selectedDate.getFullYear() &&
        dateCopy.getMonth() === selectedDate.getMonth() &&
        dateCopy.getDate() === selectedDate.getDate();

      days.push(
        <div
          key={dateCopy.toDateString()}
          className={`p-2 text-center cursor-pointer ${
            isSelected
              ? "bg-blue-500 text-white rounded-full"
              : !isCurrentMonth
              ? "text-gray-400"
              : "text-black hover:bg-gray-200 rounded-full cursor-pointer"
          }`}
          onClick={() => handleDateSelect(dateCopy)}
        >
          {dateCopy.getDate()}
        </div>
      );

      date.setDate(date.getDate() + 1);
    }

    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  return (
    <div className="relative inline-block w-44" ref={datepickerRef}>
      <div className="flex">
        <input
          type="text"
          value={inputValue}
          placeholder={placeholder}
          className="border border-gray-400 rounded-l px-4 py-2 w-full focus:outline-none"
          onChange={handleInputChange}
        />
        <button
          type="button"
          onClick={toggleDatepicker}
          className="border border-gray-400 border-l-0 bg-white rounded-r px-2 py-2 focus:outline-none"
        >
          <Calendar className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-80 bg-white border border-gray-400 rounded shadow p-2">
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={goToPreviousMonth}
              className="px-2 py-1"
            >
              &#8592;
            </button>
            <span className="font-semibold">
              {currentMonth.toLocaleString("fr-FR", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button type="button" onClick={goToNextMonth} className="px-2 py-1">
              &#8594;
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"].map((day) => (
              <div key={day} className="text-center font-semibold">
                {day}
              </div>
            ))}
            {renderDays()}
          </div>
        </div>
      )}
      {name && (
        <input
          type="hidden"
          name={name}
          value={selectedDate ? formatDate(selectedDate) : ""}
        />
      )}
    </div>
  );
};

export default DatePicker;
