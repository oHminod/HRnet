type InputProps = {
  label: string;
  name: string;
  placeholder: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const Input = ({ label, name, placeholder, value, onChange }: InputProps) => {
  if (onChange) {
    return (
      <label className="flex flex-wrap items-center gap-2">
        <span>{label}</span>
        <input
          name={name}
          className="border-2 border-gray-400 p-2 rounded-lg hover:bg-gray-100"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
        />
      </label>
    );
  }

  return (
    <label className="flex flex-wrap items-center gap-2">
      <span>{label}</span>
      <input
        name={name}
        className="border-2 border-gray-400 p-2 rounded-lg hover:bg-gray-100"
        type="text"
        placeholder={placeholder}
        required
      />
    </label>
  );
};

export default Input;
