import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import toast from "react-hot-toast";
import { LogOut, Menu, Shield, ShoppingCart, UserCircle, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, hydrateFromStorage } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    navigate("/");
    toast.success("Cerraste sesión correctamente.");
  };

  const isAdmin = user?.role === "ADMIN";

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
        scrolled ? "shadow-lg" : "shadow-md"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo-luaspets.png"
              alt="LUAS PETS Logo"
              className="h-14 w-auto transition-transform group-hover:scale-105"
            />
            <div className="hidden sm:flex flex-col border-l-2 border-[#E91E63] pl-3">
              <h1 className="text-xl font-bold text-[#0D47A1] leading-tight">
                LUAS PETS
              </h1>
              <span className="text-xs text-gray-600 font-medium">
                Clínica Veterinaria
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="servicios"
              className="text-sm font-medium text-gray-700 hover:text-[#E91E63] transition-colors px-3 py-2"
            >
              Servicios
            </Link>
            <Link
              to="productos"
              className="text-sm font-medium text-gray-700 hover:text-[#E91E63] transition-colors px-3 py-2"
            >
              Productos
            </Link>

            {isAuthenticated && !isAdmin && (
              <>
                <Link
                  to="/my-pets"
                  className="text-sm font-medium text-gray-700 hover:text-[#E91E63] transition-colors px-3 py-2"
                >
                  Mis Mascotas
                </Link>
                <Link
                  to="/my-appointments"
                  className="text-sm font-medium text-gray-700 hover:text-[#E91E63] transition-colors px-3 py-2"
                >
                  Mis Citas
                </Link>
                <Link
                  to="/cart"
                  className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <ShoppingCart size={22} className="text-gray-700" />
                </Link>
              </>
            )}

            {isAuthenticated && isAdmin && (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-2 text-sm font-semibold border-2 border-[#E91E63] text-[#E91E63] px-4 py-2 rounded-xl hover:bg-[#E91E63] hover:text-white transition-all hover:shadow-md active:scale-95"
              >
                <Shield size={18} />
                <span>Panel Admin</span>
              </Link>
            )}

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-sm font-medium text-[#0D47A1] hover:text-[#E91E63] transition-colors px-4 py-2 rounded-xl hover:bg-gray-50"
                >
                  <UserCircle size={18} />
                  <span>Iniciar sesión</span>
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold bg-linear-to-r from-[#E91E63] to-[#C2185B] text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition-all active:scale-95"
                >
                  Registrarse
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="hidden lg:flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#E91E63] to-[#C2185B] flex items-center justify-center text-white font-bold text-xs">
                    {user?.name?.[0]}
                    {user?.lastname?.[0]}
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500">Hola,</p>
                    <p className="text-sm font-semibold text-gray-900 leading-tight">
                      {user?.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium bg-gray-100 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-200 transition-all active:scale-95"
                >
                  <LogOut size={16} />
                  <span>Salir</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X size={24} className="text-gray-700" />
            ) : (
              <Menu size={24} className="text-gray-700" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-4 pb-4 pt-2 space-y-3 bg-white border-t border-gray-100">
          <Link
            to="servicios"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block w-full text-center text-sm font-medium text-gray-700 py-2.5 rounded-xl hover:bg-gray-100 transition-all"
          >
            Servicios
          </Link>
          <Link
            to="productos"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block w-full text-center text-sm font-medium text-gray-700 py-2.5 rounded-xl hover:bg-gray-100 transition-all"
          >
            Productos
          </Link>

          {isAuthenticated && !isAdmin && (
            <>
              <Link
                to="/my-pets"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center text-sm font-medium text-gray-700 py-2.5 rounded-xl hover:bg-gray-100 transition-all"
              >
                Mis Mascotas
              </Link>
              <Link
                to="/my-appointments"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center text-sm font-medium text-gray-700 py-2.5 rounded-xl hover:bg-gray-100 transition-all"
              >
                Mis Citas
              </Link>
              <Link
                to="/cart"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full text-center text-sm font-medium text-gray-700 py-2.5 rounded-xl hover:bg-gray-100 transition-all"
              >
                <ShoppingCart size={18} />
                Carrito
              </Link>
            </>
          )}

          {isAuthenticated && (
            <div className="flex items-center gap-3 p-3 bg-linear-to-r from-[#E91E63]/5 to-[#C2185B]/5 rounded-xl border border-[#E91E63]/20">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#E91E63] to-[#C2185B] flex items-center justify-center text-white font-bold text-lg">
                {user?.name?.[0]}
                {user?.lastname?.[0]}
              </div>
              <div>
                <p className="text-xs text-gray-600">Conectado como</p>
                <p className="text-sm font-bold text-gray-900">
                  {user?.name} {user?.lastname}
                </p>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#E91E63]">
                    <Shield size={12} />
                    ADMIN
                  </span>
                )}
              </div>
            </div>
          )}

          {isAuthenticated && isAdmin && (
            <Link
              to="/admin/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full text-sm font-semibold border-2 border-[#E91E63] text-[#E91E63] px-4 py-3 rounded-xl hover:bg-[#E91E63] hover:text-white transition-all active:scale-95"
            >
              <Shield size={18} />
              Panel de Administrador
            </Link>
          )}

          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full text-sm font-medium text-[#0D47A1] py-3 rounded-xl hover:bg-gray-100 transition-all"
              >
                <UserCircle size={18} />
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center text-sm font-semibold bg-linear-to-r from-[#E91E63] to-[#C2185B] text-white py-3 rounded-xl hover:shadow-lg transition-all active:scale-95"
              >
                Registrarse
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full text-sm font-medium bg-gray-100 text-gray-800 px-4 py-3 rounded-xl hover:bg-gray-200 transition-all active:scale-95"
            >
              <LogOut size={18} />
              Cerrar sesión
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;