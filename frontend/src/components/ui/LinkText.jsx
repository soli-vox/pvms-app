import { Link } from "react-router-dom";

const LinkText = ({ to, children, className = "" }) => {
  return (
    <Link
      to={to}
      className={`font-medium text-indigo-600 hover:text-indigo-500 ${className}`}
    >
      {children}
    </Link>
  );
};

export default LinkText;
