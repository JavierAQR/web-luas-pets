import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import toast from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, hydrateFromStorage } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    navigate("/");
    toast.success("Cerraste sesión correctamente.");
  };

  const isAdmin = user?.role === "ADMIN"; // ajusta si tu campo es diferente

  return (
    <header className="relative">
      <nav className="navbar flex items-center justify-between bg-white py-4 px-4 md:px-10 shadow-md font-[Poppins]">
        {/* Logo */}
        <div className="navbar-logo flex items-center gap-4">
          <Link to="/" className="logo-link flex items-center">
            <img
              src="/logo-luaspets.png"
              alt="LUAS PETS Logo"
              className="logo-img h-[60px] md:h-[70px] w-auto"
            />
          </Link>
          <div className="logo-text-block hidden sm:flex flex-col justify-center border-l-2 border-[#E91E63] pl-4">
            <h1 className="logo-title text-xl md:text-2xl font-bold text-[#0D47A1] m-0">
              LUAS PETS
            </h1>
            <span className="logo-subtitle text-sm md:text-base text-[#666] font-medium">
              Clínica Veterinaria Especializada
            </span>
          </div>
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && isAdmin && (
            <Link
              to={"/admin/services"}
              className="text-sm md:text-base font-semibold border border-[#E91E63] text-[#E91E63] px-4 py-2 rounded-full hover:bg-[#E91E63] hover:text-white transition-colors"
            >
              Ir al panel de administrador
            </Link>
          )}

          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="text-sm md:text-base font-medium text-[#0D47A1] hover:text-[#E91E63] transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="text-sm md:text-base font-semibold bg-[#E91E63] text-white px-4 py-2 rounded-full hover:bg-[#d81b60] transition-colors"
              >
                Registrarse
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="hidden lg:inline text-sm text-gray-700">
                Hola,{" "}
                <span className="font-semibold">
                  {user?.name} {user?.lastname}
                </span>
              </span>
              <button
                onClick={handleLogout}
                className="text-sm md:text-base font-medium bg-gray-100 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>

        {/* Hamburger (mobile) */}
        <button
          type="button"
          className="md:hidden flex flex-col justify-center items-center gap-1.5 w-9 h-9 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label="Abrir menú"
        >
          <span
            className={`h-0.5 w-5 bg-gray-700 transition-transform ${
              isMobileMenuOpen ? "translate-y-1.5 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-5 bg-gray-700 transition-opacity ${
              isMobileMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`h-0.5 w-5 bg-gray-700 transition-transform ${
              isMobileMenuOpen ? "-translate-y-1.5 -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-100 px-4 pb-4 pt-2 space-y-3">
          {isAuthenticated && isAdmin && (
            <button
              type="button"
              className="w-full text-sm font-semibold border border-[#E91E63] text-[#E91E63] px-4 py-2 rounded-full hover:bg-[#E91E63] hover:text-white transition-colors"
              // onClick={() => { /* futuro: ir al panel de admin */ }}
            >
              Ir al panel de administrador
            </button>
          )}

          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center text-sm font-medium text-[#0D47A1] py-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center text-sm font-semibold bg-[#E91E63] text-white py-2 rounded-full hover:bg-[#d81b60] transition-colors"
              >
                Registrarse
              </Link>
            </>
          ) : (
            <>
              <p className="text-center text-sm text-gray-700">
                Hola,{" "}
                <span className="font-semibold">
                  {user?.name} {user?.lastname}
                </span>
              </p>
              <button
                onClick={handleLogout}
                className="w-full text-sm font-medium bg-gray-100 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
