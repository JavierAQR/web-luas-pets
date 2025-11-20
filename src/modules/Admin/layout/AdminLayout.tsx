import { useEffect, type ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../../stores/authStore";
import AdminSidebar from "../components/AdminSidebar";

interface AdminLayoutProps {
  children?: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, isAuthenticated, hydrateFromStorage } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  const isAdmin = isAuthenticated && user?.role === "ADMIN";

  if (!isAdmin) {
    // redirige si no es admin
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        {children ?? <Outlet />}
      </main>
    </div>
  );
};

export default AdminLayout;
