import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import {
  FiSearch,
  FiGrid,
  FiBarChart2,
  FiPackage,
  FiBriefcase,
  FiList,
  FiTrendingUp,
  FiTrendingDown,
  FiFileText,
  FiCreditCard,
  FiFile,
  FiMenu,
  FiX,
  FiDatabase,
  FiLogOut
} from "react-icons/fi";

const tabs = [
  { to: "/search", label: "Search", key: "search" },
  { to: "/", label: "Dashboard", key: "dashboard" },
  { to: "/master", label: "Master Data", key: "master" },
  { to: "/stock", label: "Stock", key: "stock" },
  { to: "/jobs", label: "Jobs", key: "jobs" },
    { to: "/invoice", label: "Invoice", key: "invoice" },
  { to: "/income", label: "Income", key: "income" },
  { to: "/expenditure", label: "Expenditure", key: "expenditure" },
  // { to: "/payment", label: "Payment", key: "payment" },
    { to: "/monthly-reports", label: "Monthly Reports", key: "reports" },
    { to: "/transaction-logs", label: "Transaction Logs", key: "transactions" },
  { to: "/statement", label: "Statement", key: "statement" }
];

const iconsMap: Record<string, ReactElement> = {
  search: <FiSearch className="w-5 h-5" />,
  dashboard: <FiGrid className="w-5 h-5" />,
  master: <FiDatabase className="w-5 h-5" />,
  stock: <FiPackage className="w-5 h-5" />,
  jobs: <FiBriefcase className="w-5 h-5" />,
    invoice: <FiFileText className="w-5 h-5" />,
  income: <FiTrendingUp className="w-5 h-5" />,
  expenditure: <FiTrendingDown className="w-5 h-5" />,
  // payment: <FiCreditCard className="w-5 h-5" />,
    reports: <FiBarChart2 className="w-5 h-5" />,
    transactions: <FiList className="w-5 h-5" />,
  statement: <FiFile className="w-5 h-5" />
};

function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Close mobile sidebar when route changes
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-20 z-50 lg:hidden bg-white p-2 rounded-md shadow-md text-gray-700 hover:bg-gray-100"
        aria-label="Toggle menu"
      >
        {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100%-4rem)] w-64 bg-gray-100 shadow-sm overflow-auto z-40 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
      <nav className="pt-2">
        <ul className="space-y-1">
          {tabs.map((t, idx) => (
            <li key={t.to} className={idx === 0 ? "mb-3" : ""}>
              <NavLink
                to={t.to}
                end={t.to === "/"}
                className={({ isActive }) =>
                  (isActive
                    ? "flex items-center gap-3 px-3 py-2 rounded-md border border-transparent bg-[#e6f2ff] text-[#3A5795]"
                    : "flex items-center gap-3 px-3 py-2 rounded-md border border-gray-200 bg-white text-[#60A5FA] hover:bg-gray-50 hover:text-[#1e4a8b]") +
                  " transition-colors"
                }
              >
                <span className="w-5 h-5 flex items-center justify-center text-current">
                  {iconsMap[t.key]}
                </span>
                <span className="text-sm font-medium">{t.label}</span>
              </NavLink>
            </li>
          ))}

          {/* Logout Button */}
          <li className="mt-4 pt-4 border-t border-gray-300">
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md border border-gray-200 bg-white text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <span className="w-5 h-5 flex items-center justify-center text-current">
                <FiLogOut className="w-5 h-5" />
              </span>
              <span className="text-sm font-medium">Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
    </>
  );
}

export default Sidebar;
