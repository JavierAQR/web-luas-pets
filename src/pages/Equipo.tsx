import "./Equipo.css";
import { FaCalendarAlt } from "react-icons/fa";

const Equipo: React.FC = () => {
  return (
    <div className="equipo">
      {/* Hero */}
      <section className="equipo-hero">
        <div className="hero-overlay">
          <div className="hero-text">
            <h1 >Staff Profesional</h1>
            <p>
              Médicos que combinan experiencia, calidez y diagnóstico preciso para
              cuidar y recuperar la salud de tu mascota.
            </p>
            <a href="/reservas" className="cta-btn">
              <FaCalendarAlt /> Reservar cita
            </a>
          </div>
        </div>
      </section>

      {/* Tarjetas del equipo */}
      <section className="equipo-list">
        <h2>Conoce a tu médico veterinario</h2>
        <div className="equipo-grid">
          <div className="equipo-card fade-in">
            <img src="/doctor-1.jpg" alt="Veterinario 1" />
            <h3>Dr. Renzo Limas O.</h3>
            <p>Médico Veterinario</p>
          </div>
          <div className="equipo-card fade-in">
            <img src="/doctor-2.jpg" alt="Veterinario 2" />
            <h3>Dra. Yoko Tacunan M.</h3>
            <p>Médico Veterinario</p>
          </div>
          <div className="equipo-card fade-in">
            <img src="/doctor-3.jpg" alt="Veterinario 3" />
            <h3>Dra. Ivana Velarde D.</h3>
            <p>Especialista en Dermatología Veterinaria</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Equipo;