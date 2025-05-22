
import { useState } from "react";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navbar = ({ activeTab, onTabChange }: NavbarProps) => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-teal-600">MediReg</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <button
                onClick={() => onTabChange("register")}
                className={`${
                  activeTab === "register"
                    ? "border-teal-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Register Patient
              </button>
              <button
                onClick={() => onTabChange("patients")}
                className={`${
                  activeTab === "patients"
                    ? "border-teal-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Patient Records
              </button>
              <button
                onClick={() => onTabChange("query")}
                className={`${
                  activeTab === "query"
                    ? "border-teal-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                SQL Query
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="flex justify-around pt-2 pb-3 space-x-1">
          <button
            onClick={() => onTabChange("register")}
            className={`${
              activeTab === "register"
                ? "bg-teal-50 border-teal-500 text-teal-700"
                : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            } flex-1 block py-2 px-3 border-b-2 text-xs font-medium`}
          >
            Register
          </button>
          <button
            onClick={() => onTabChange("patients")}
            className={`${
              activeTab === "patients"
                ? "bg-teal-50 border-teal-500 text-teal-700"
                : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            } flex-1 block py-2 px-3 border-b-2 text-xs font-medium`}
          >
            Records
          </button>
          <button
            onClick={() => onTabChange("query")}
            className={`${
              activeTab === "query"
                ? "bg-teal-50 border-teal-500 text-teal-700"
                : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            } flex-1 block py-2 px-3 border-b-2 text-xs font-medium`}
          >
            Query
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
