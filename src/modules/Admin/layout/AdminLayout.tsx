import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../../stores/authStore";
import AdminSidebar from "../components/AdminSidebar";

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, isAuthenticated, isHydrated, hydrateFromStorage } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    hydrateFromStorage();
  }, []);

  const isAdmin = isAuthenticated && user?.role === "ADMIN";

  if (!isHydrated) {
    return <div>Cargando...</div>; 
  }

  if (!isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return (
    <div className="min-h-screen flex bg-linear-to-br from-gray-50 to-gray-100">
      <AdminSidebar />

      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto md:ml-70 max-md:mt-10">
        <div className="max-w-7xl mx-auto">{children ?? <Outlet />}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
