const Button = ({
  children,
  type = "button",
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
}) => {
  const baseStyles =
    "w-full py-2 px-4 font-semibold rounded-md transition duration-300";
  const variantStyles = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-yellow-400 text-gray-900 hover:bg-yellow-500",
    outline:
      "bg-transparent text-indigo-600 border border-indigo-600 hover:bg-indigo-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
