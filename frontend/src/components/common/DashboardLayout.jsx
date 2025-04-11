import React from "react";
import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";
import SideBar from "./SideBar";

const DashboardLayout = ({ role }) => {
  return (
    <div className="flex h-screen bg-gray-700">
      <SideBar role={role} />
      <div className="flex-1 flex flex-col h-full">
        <TopNav role={role} />
        <main className="flex-1 p-6 overflow-auto bg-gray-700">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
