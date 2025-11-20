import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";
import toast from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, hydrateFromStorage } = useAuthStore();

  useEffect(() => {
    // hidrata solo una vez al montar el navbar (o hazlo en el App)
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    toast.success("Cerraste sesión correctamente.")
  };

  return (
    <div className="relative">
      <nav className="navbar flex items-center justify-between bg-white py-5 px-6 md:px-10 shadow-md font-[Poppins]">
        {/* Logo */}
        <div className="navbar-logo flex items-center gap-4">
          <Link to="/" className="logo-link flex items-center">
            <img
              src="/logo-luaspets.png"
              alt="LUAS PETS Logo"
              className="logo-img h-[70px] w-auto"
            />
          </Link>
          <div className="logo-text-block flex flex-col justify-center border-l-2 border-[#E91E63] pl-4">
            <h1 className="logo-title text-2xl font-bold text-[#0D47A1] m-0">
              LUAS PETS
            </h1>
            <span className="logo-subtitle text-base text-[#666] font-medium">
              Clínica Veterinaria Especializada
            </span>
          </div>
        </div>

        {/* Auth actions */}
        <div className="flex items-center gap-4">
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
              <span className="hidden md:inline text-sm text-gray-700">
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
      </nav>
    </div>
  );
};

export default Navbar;
