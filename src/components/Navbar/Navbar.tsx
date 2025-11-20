import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { FaPaw, FaCut, FaSyringe, FaBone } from "react-icons/fa";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  // Cerrar dropdown al hacer clic fuera
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
    <>
      <nav className="navbar">
        {/* Logo */}
        
        <div className="navbar-logo">
        <Link to="/" className="logo-link">
            <img src="/logo-luaspets.png" alt="LUAS PETS Logo" className="logo-img" />
        </Link>
        <div className="logo-text-block">
            <h1 className="logo-title">LUAS PETS</h1>
            <span className="logo-subtitle">Clínica Veterinaria Especializada</span>
        </div>
        </div>

        {/* Menu */}
        <ul className="navbar-menu">
          <li><Link to="/">Inicio</Link></li>
          <li>
  <button
    onClick={() => toggleMenu("nosotros")}
    className={openMenu === "nosotros" ? "active" : ""}
  >
    Nosotros <span className="arrow">▼</span>
  </button>
            </li>
            <li>
            <button
                onClick={() => toggleMenu("servicios")}
                className={openMenu === "servicios" ? "active" : ""}
            >
                Servicios <span className="arrow">▼</span>
            </button>
            </li>
          
          <li><Link to="/contacto">Contacto</Link></li>
          
        </ul>
      </nav>

      {/* Dropdown Nosotros */}
      {openMenu === "nosotros" && (
        <div className="dropdown-global">
          <Link to="/quienes-somos" className="dropdown-item">
            <FaPaw className="icon" />
            <div>
              <h4>Quiénes somos</h4>
              <p>Nuestra motivación y pilares.</p>
            </div>
          </Link>
          <Link to="/equipo" className="dropdown-item">
            <FaBone className="icon" />
            <div>
              <h4>Nuestro equipo</h4>
              <p>Profesionales dedicados.</p>
            </div>
          </Link>
        </div>
      )}

      {/* Dropdown Servicios */}
      {openMenu === "servicios" && (
        <div className="dropdown-global wide">
          <Link to="/consulta" className="dropdown-item">
            <FaPaw className="icon" />
            <div>
              <h4>Consultas</h4>
              <p>Atención integral para tu mascota.</p>
            </div>
          </Link>
          <Link to="/vacunacion" className="dropdown-item">
            <FaSyringe className="icon" />
            <div>
              <h4>Vacunación</h4>
              <p>Protección completa para su salud.</p>
            </div>
          </Link>
          <Link to="/bano-corte" className="dropdown-item">
            <FaCut className="icon" />
            <div>
              <h4>Baño y corte</h4>
              <p>Estética y bienestar.</p>
            </div>
          </Link>
        </div>
      )}
    </>
  );
};

export default Navbar;