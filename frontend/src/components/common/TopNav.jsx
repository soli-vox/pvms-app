import React from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";

const TopNav = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <div className="bg-gray-800 shadow w-full p-4 flex justify-between items-center">
      <h1 className="text-xl text-white font-semibold">
        {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
      </h1>
      <div>
        <button
          onClick={handleLogout}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default TopNav;
