import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiChevronDown, FiMenu, FiX } from "react-icons/fi";

export default function ProtectedTopbar() {
  const [open, setOpen] = useState(false);
  const [staffOpen, setStaffOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const staffRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
      if (staffRef.current && !staffRef.current.contains(e.target as Node)) setStaffOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  function handleLogout() {
    sessionStorage.removeItem("token");
    navigate("/login");
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
    setOpen(false);
    setStaffOpen(false);
  }

  return (
    <div className="w-full sticky top-0 z-50">
      <div style={{ backgroundColor: "#00bddb" }} className="text-white py-3 md:py-2">
        <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16">
          {/* Mobile Header */}
          <div className="flex md:hidden items-center justify-between">
            <span className="text-lg font-bold">Metro</span>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2"
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div ref={ref} className="relative">
                <button
                  type="button"
                  onClick={() => setOpen((s) => !s)}
                  className="flex items-center gap-2 text-white font-medium text-base"
                >
                  Admin
                  <FiChevronDown className="w-4 h-4" />
                </button>

                {open && (
                  <div className="absolute left-0 mt-2 bg-[#00bddb] text-white rounded shadow-md w-40 z-50">
                    <NavLink to="/admin/account" className="block px-3 py-2 hover:bg-[#00a5c3]">
                      Account
                    </NavLink>
                    <NavLink to="/admin/transfer" className="block px-3 py-2 hover:bg-[#00a5c3]">
                      Transfer
                    </NavLink>
                  </div>
                )}
              </div>

              <NavLink to="/customer" className="text-white text-base hover:opacity-80">
                Customer
              </NavLink>
              <NavLink to="/model" className="text-white text-base hover:opacity-80">
                Model
              </NavLink>
              <NavLink to="/company" className="text-white text-base hover:opacity-80">
                Company
              </NavLink>
              <NavLink to="/shops" className="text-white text-base hover:opacity-80">
                Shops
              </NavLink>
              <NavLink to="/works" className="text-white text-base hover:opacity-80">
                Works
              </NavLink>
            </div>

            <div className="flex items-center gap-6">
              <div ref={staffRef} className="relative">
                <button
                  type="button"
                  onClick={() => setStaffOpen((s) => !s)}
                  className="flex items-center gap-2 text-white font-medium text-base"
                >
                  Staff
                  <FiChevronDown className="w-4 h-4" />
                </button>

                {staffOpen && (
                  <div className="absolute right-0 mt-2 bg-[#00bddb] text-white rounded shadow-md w-40 z-50">
                    <NavLink to="/staff/details" className="block px-3 py-2 hover:bg-[#00a5c3]">
                      Staff Details
                    </NavLink>
                    <NavLink to="/staff/salary" className="block px-3 py-2 hover:bg-[#00a5c3]">
                      Salary
                    </NavLink>
                  </div>
                )}
              </div>

              <button onClick={handleLogout} className="text-white text-base hover:opacity-80">
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 px-4 pb-4 border-t border-white/20 pt-4">
            <div className="flex flex-col space-y-3">
              {/* Admin Dropdown Mobile */}
              <div>
                <button
                  type="button"
                  onClick={() => setOpen((s) => !s)}
                  className="flex items-center justify-between w-full text-white font-medium text-base py-2"
                >
                  Admin
                  <FiChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
                {open && (
                  <div className="ml-4 mt-2 space-y-2">
                    <NavLink
                      to="/admin/account"
                      onClick={closeMobileMenu}
                      className="block py-2 text-white/90 hover:text-white"
                    >
                      Account
                    </NavLink>
                    <NavLink
                      to="/admin/transfer"
                      onClick={closeMobileMenu}
                      className="block py-2 text-white/90 hover:text-white"
                    >
                      Transfer
                    </NavLink>
                  </div>
                )}
              </div>

              <NavLink
                to="/customer"
                onClick={closeMobileMenu}
                className="text-white text-base py-2 hover:opacity-80"
              >
                Customer
              </NavLink>
              <NavLink
                to="/model"
                onClick={closeMobileMenu}
                className="text-white text-base py-2 hover:opacity-80"
              >
                Model
              </NavLink>
              <NavLink
                to="/company"
                onClick={closeMobileMenu}
                className="text-white text-base py-2 hover:opacity-80"
              >
                Company
              </NavLink>
              <NavLink
                to="/shops"
                onClick={closeMobileMenu}
                className="text-white text-base py-2 hover:opacity-80"
              >
                Shops
              </NavLink>
              <NavLink
                to="/works"
                onClick={closeMobileMenu}
                className="text-white text-base py-2 hover:opacity-80"
              >
                Works
              </NavLink>

              {/* Staff Dropdown Mobile */}
              <div>
                <button
                  type="button"
                  onClick={() => setStaffOpen((s) => !s)}
                  className="flex items-center justify-between w-full text-white font-medium text-base py-2"
                >
                  Staff
                  <FiChevronDown className={`w-4 h-4 transition-transform ${staffOpen ? 'rotate-180' : ''}`} />
                </button>
                {staffOpen && (
                  <div className="ml-4 mt-2 space-y-2">
                    <NavLink
                      to="/staff/details"
                      onClick={closeMobileMenu}
                      className="block py-2 text-white/90 hover:text-white"
                    >
                      Staff Details
                    </NavLink>
                    <NavLink
                      to="/staff/salary"
                      onClick={closeMobileMenu}
                      className="block py-2 text-white/90 hover:text-white"
                    >
                      Salary
                    </NavLink>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
                className="text-white text-base py-2 hover:opacity-80 text-left"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
