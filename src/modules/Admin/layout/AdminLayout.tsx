import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "../../../stores/authStore";
import AdminSidebar from "../components/AdminSidebar";

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, isAuthenticated, hydrateFromStorage } = useAuthStore();
  // const location = useLocation();

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);
  

  const isAdmin = isAuthenticated && user?.role === "ADMIN";
  console.log(isAdmin);
  

  // if (!isAdmin) {
  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // }

  return (
    <div className="min-h-screen flex bg-linear-to-br from-gray-50 to-gray-100">
      <AdminSidebar />

      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {children ?? <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;