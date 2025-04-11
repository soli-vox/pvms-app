const InputField = ({
  label,
  id,
  name,
  type = "text",
  value,
  checked, // Add for checkboxes
  onChange,
  placeholder,
  required = false,
  className = "",
  error,
}) => {
  return (
    <div className={type === "checkbox" ? "flex items-center" : "space-y-1"}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {type === "checkbox" ? (
        <input
          id={id}
          name={name}
          type={type}
          checked={checked}
          onChange={onChange}
          className={`mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 ${className}`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`appearance-none rounded-md w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${className}`}
        />
      )}
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
};

export default InputField;
