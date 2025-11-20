import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPaw, FaBone, FaSyringe, FaCut } from "react-icons/fa";

const Navbar: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".navbar") && !target.closest(".dropdown-global")) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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

        {/* Menú */}
        <ul className="navbar-menu flex list-none items-center gap-6 md:gap-8">
          <li>
            <Link
              to="/"
              className="text-[#0b2f66] font-semibold text-lg pb-1 border-b-4 border-transparent transition-colors transition-border duration-300 hover:text-[#E91E63] hover:border-[#E91E63]"
            >
              Inicio
            </Link>
          </li>

          <li>
            <button
              onClick={() => toggleMenu("nosotros")}
              className={`text-[#0b2f66] font-semibold text-lg pb-1 border-b-4 border-transparent transition-colors duration-300 hover:text-[#E91E63] hover:border-[#E91E63] flex items-center ${
                openMenu === "nosotros" ? "text-[#E91E63] border-[#E91E63]" : ""
              }`}
            >
              Nosotros
              <span
                className={`arrow ml-1 inline-block transition-transform duration-300 ${
                  openMenu === "nosotros" ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>
          </li>

          <li>
            <button
              onClick={() => toggleMenu("servicios")}
              className={`text-[#0b2f66] font-semibold text-lg pb-1 border-b-4 border-transparent transition-colors duration-300 hover:text-[#E91E63] hover:border-[#E91E63] flex items-center ${
                openMenu === "servicios" ? "text-[#E91E63] border-[#E91E63]" : ""
              }`}
            >
              Servicios
              <span
                className={`arrow ml-1 inline-block transition-transform duration-300 ${
                  openMenu === "servicios" ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>
          </li>

          <li>
            <Link
              to="/contacto"
              className="text-[#0b2f66] font-semibold text-lg pb-1 border-b-4 border-transparent transition-colors duration-300 hover:text-[#E91E63] hover:border-[#E91E63]"
            >
              Contacto
            </Link>
          </li>
        </ul>
      </nav>

      {/* Dropdown Nosotros */}
      {openMenu === "nosotros" && (
        <div
          className="dropdown-global absolute left-1/2 top-[115px] z-999 w-full max-w-[1270px] -translate-x-1/2 bg-white shadow-lg rounded-lg px-6 md:px-10 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-0 animate-[fadeInDropdown_0.4s_ease_forwards]"
        >
          <Link
            to="/quienes-somos"
            className="dropdown-item bg-white rounded-lg p-5 shadow-md flex items-start gap-3 no-underline text-[#0b2f66] transition-colors duration-300 hover:bg-[#f5f5f5]"
          >
            <FaPaw className="icon text-[26px] text-[#E91E63]" />
            <div>
              <h4 className="m-0 text-xl font-bold">Quiénes somos</h4>
              <p className="m-0 text-base text-[#666]">
                Nuestra motivación y pilares.
              </p>
            </div>
          </Link>
          <Link
            to="/equipo"
            className="dropdown-item bg-white rounded-lg p-5 shadow-md flex items-start gap-3 no-underline text-[#0b2f66] transition-colors duration-300 hover:bg-[#f5f5f5]"
          >
            <FaBone className="icon text-[26px] text-[#E91E63]" />
            <div>
              <h4 className="m-0 text-xl font-bold">Nuestro equipo</h4>
              <p className="m-0 text-base text-[#666]">
                Profesionales dedicados.
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* Dropdown Servicios */}
      {openMenu === "servicios" && (
        <div
          className="dropdown-global wide absolute left-1/2 top-[115px] z-999 w-full max-w-[1270px] -translate-x-1/2 bg-white shadow-lg rounded-lg px-6 md:px-10 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-0 animate-[fadeInDropdown_0.4s_ease_forwards]"
        >
          <Link
            to="/consulta"
            className="dropdown-item bg-white rounded-lg p-5 shadow-md flex items-start gap-3 no-underline text-[#0b2f66] transition-colors duration-300 hover:bg-[#f5f5f5]"
          >
            <FaPaw className="icon text-[26px] text-[#E91E63]" />
            <div>
              <h4 className="m-0 text-xl font-bold">Consultas</h4>
              <p className="m-0 text-base text-[#666]">
                Atención integral para tu mascota.
              </p>
            </div>
          </Link>
          <Link
            to="/vacunacion"
            className="dropdown-item bg-white rounded-lg p-5 shadow-md flex items-start gap-3 no-underline text-[#0b2f66] transition-colors duration-300 hover:bg-[#f5f5f5]"
          >
            <FaSyringe className="icon text-[26px] text-[#E91E63]" />
            <div>
              <h4 className="m-0 text-xl font-bold">Vacunación</h4>
              <p className="m-0 text-base text-[#666]">
                Protección completa para su salud.
              </p>
            </div>
          </Link>
          <Link
            to="/bano-corte"
            className="dropdown-item bg-white rounded-lg p-5 shadow-md flex items-start gap-3 no-underline text-[#0b2f66] transition-colors duration-300 hover:bg-[#f5f5f5]"
          >
            <FaCut className="icon text-[26px] text-[#E91E63]" />
            <div>
              <h4 className="m-0 text-xl font-bold">Baño y corte</h4>
              <p className="m-0 text-base text-[#666]">Estética y bienestar.</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
