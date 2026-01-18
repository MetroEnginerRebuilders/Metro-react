import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Sidebar from "./Sidebar";

const ProtectedRoute = () => {
  const token = sessionStorage.getItem("token");
  const location = useLocation();

  useEffect(() => {
    if (!token) {
      toast.warn("Please login again");
    }
  }, [token, location]);

  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="pt-16">
      <Sidebar />
      <main className="lg:ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedRoute;
