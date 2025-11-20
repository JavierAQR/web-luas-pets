import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { FaPaw } from "react-icons/fa";
import { useAuthStore } from "../../../stores/authStore";
import toast from "react-hot-toast";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const handleLogout = async () => {
    await logout();
    toast.success("Cerraste sesión correctamente.")
    window.location.href = "/login";
  };

  return (
    <>
      {/* Botón hamburguesa móvil */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-40 bg-white rounded-full shadow-lg p-2 border border-gray-200"
      >
        <FiMenu size={22} />
      </button>

      {/* Overlay móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0  w-64 bg-white shadow-xl md:shadow-none z-40 transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b bg-white">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo-luaspets.png" className="h-10" />
              <div>
                <h1 className="text-sm font-bold text-[#0D47A1] leading-none">
                  LUAS PETS
                </h1>
                <span className="text-xs text-gray-500">Panel Admin</span>
              </div>
            </Link>

            <button className="md:hidden text-gray-500" onClick={toggleSidebar}>
              <FiX size={22} />
            </button>
          </div>

          {/* User info */}
          <div className="px-4 py-3 border-b bg-gray-50">
            <p className="text-xs text-gray-500">Conectado como</p>
            <p className="text-sm font-semibold text-gray-800">
              {user?.name} {user?.lastname}
            </p>
            <p className="text-xs font-bold text-[#E91E63]">ADMIN</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            <NavLink
              to="/admin/services"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors 
                ${
                  isActive
                    ? "bg-[#E91E63]/10 text-[#E91E63]"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <FaPaw className="mr-2 text-lg" />
              Servicios
            </NavLink>

            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#E91E63]/10 text-[#E91E63]"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <span className="mr-2">🛒</span>
              Productos
            </NavLink>
          </nav>

          {/* Logout abajo — SIEMPRE pegado abajo */}
          <div className="mt-auto border-t p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg py-2 font-medium transition"
            >
              <FiLogOut /> Cerrar sesión
            </button>

            <p className="text-center text-xs text-gray-400 mt-3">
              © {new Date().getFullYear()} LUAS PETS
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
