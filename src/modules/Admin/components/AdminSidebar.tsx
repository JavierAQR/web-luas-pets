import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../stores/authStore";
import toast from "react-hot-toast";
import { Calendar, LayoutDashboard, LogOut, Menu, Package, Sparkles, X } from "lucide-react";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const handleLogout = async () => {
    await logout();
    toast.success("Cerraste sesión correctamente.");
    navigate("/login");
  };

  return (
    <>
      {/* Botón hamburguesa móvil */}
      <button
        onClick={toggleSidebar}
        className={`md:hidden fixed top-4 left-4 z-50 bg-white hover:bg-gray-50 rounded-xl shadow-lg p-3 border border-gray-200 transition-all active:scale-95 ${isOpen && "hidden"}`}
        aria-label="Abrir menú"
      >
        <Menu size={24} className="text-gray-700" />
      </button>

      {/* Overlay móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen w-72 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img 
                  src="/logo-luaspets.png" 
                  className="h-11 w-11 object-contain transition-transform group-hover:scale-105" 
                  alt="Logo"
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-base font-bold text-[#0D47A1] leading-tight">
                  LUAS PETS
                </h1>
                <span className="text-xs text-gray-500 font-medium">Panel Administrativo</span>
              </div>
            </Link>

            <button 
              className="md:hidden text-gray-400 hover:text-gray-600 transition-colors p-1" 
              onClick={toggleSidebar}
              aria-label="Cerrar menú"
            >
              <X size={24} />
            </button>
          </div>

          {/* User info card */}
          <div className="mx-4 my-4 p-4 rounded-xl bg-linear-to-br from-[#E91E63]/5 to-[#E91E63]/10 border border-[#E91E63]/20">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-linear-to-br from-[#E91E63] to-[#C2185B] flex items-center justify-center text-white font-bold text-lg shadow-md">
                {user?.name?.[0]}{user?.lastname?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium mb-0.5">Conectado como</p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name} {user?.lastname}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#E91E63] text-white text-xs font-bold">
                    <Sparkles size={10} />
                    ADMIN
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5">
          <NavLink
              to="/admin/dashboard"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group
                ${
                  isActive
                    ? "bg-linear-to-r from-[#E91E63] to-[#C2185B] text-white shadow-md shadow-[#E91E63]/30"
                    : "text-gray-700 hover:bg-gray-100 hover:translate-x-1"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <LayoutDashboard 
                    size={20} 
                    className={isActive ? "text-white" : "text-[#E91E63] group-hover:scale-110 transition-transform"} 
                  />
                  <span>Dashboard</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>
                  )}
                </>
              )}
            </NavLink>
          <NavLink
              to="/admin/appointments"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group
                ${
                  isActive
                    ? "bg-linear-to-r from-[#E91E63] to-[#C2185B] text-white shadow-md shadow-[#E91E63]/30"
                    : "text-gray-700 hover:bg-gray-100 hover:translate-x-1"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Calendar 
                    size={20} 
                    className={isActive ? "text-white" : "text-[#E91E63] group-hover:scale-110 transition-transform"} 
                  />
                  <span>Citas</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>
                  )}
                </>
              )}
            </NavLink>
            <NavLink
              to="/admin/services"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group
                ${
                  isActive
                    ? "bg-linear-to-r from-[#E91E63] to-[#C2185B] text-white shadow-md shadow-[#E91E63]/30"
                    : "text-gray-700 hover:bg-gray-100 hover:translate-x-1"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Sparkles 
                    size={20} 
                    className={isActive ? "text-white" : "text-[#E91E63] group-hover:scale-110 transition-transform"} 
                  />
                  <span>Servicios</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>
                  )}
                </>
              )}
            </NavLink>

            <NavLink
              to="/admin/products"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group
                ${
                  isActive
                    ? "bg-linear-to-r from-[#E91E63] to-[#C2185B] text-white shadow-md shadow-[#E91E63]/30"
                    : "text-gray-700 hover:bg-gray-100 hover:translate-x-1"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Package 
                    size={20} 
                    className={isActive ? "text-white" : "text-[#E91E63] group-hover:scale-110 transition-transform"} 
                  />
                  <span>Productos</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>
                  )}
                </>
              )}
            </NavLink>
          </nav>

          {/* Footer section */}
          <div className="mt-auto border-t border-gray-100 p-4 space-y-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl py-3 font-medium transition-all active:scale-95 group"
            >
              <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
              Cerrar sesión
            </button>

            <p className="text-center text-xs text-gray-400">
              © {new Date().getFullYear()} LUAS PETS
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;