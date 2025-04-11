import { Link } from "react-router-dom";
import PvmsLogo from "../../assets/pvms-logo.png";
const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/">
              <img className="h-10 w-auto" src={PvmsLogo} alt="PVMS Logo" />
            </Link>
            <span className="ml-3 text-2xl font-bold text-white">PVMS</span>
          </div>
          <div className="flex space-x-4">
            <Link to="/login">
              <button className="px-4 py-2 text-white border border-white rounded-md hover:bg-white hover:text-blue-600 transition duration-300">
                Login
              </button>
            </Link>
            <Link to="/join-us">
              <button className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-500 transition duration-300">
                Join Us
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
