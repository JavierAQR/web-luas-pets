import "./Vacunacion.css";
import { useEffect } from "react";

function Vacunacion() {
  useEffect(() => {
    const sections = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    });
    sections.forEach((section) => observer.observe(section));
  }, []);

  return (
    <div className="vacunacion-container">
      {/* Hero Section */}
      <section className="hero-section fade-in">
        <div className="hero-text">
          <h1>Vacunación para perros y gatos</h1>
          <p>
            Prevenir enfermedades es fácil. Protege a tu mascota con un calendario de vacunación al día.
          </p>
          <a href="https://wa.me/51968328872" className="cta-button">
            📅 Agenda una consulta
          </a>
        </div>
        <div className="hero-image">
          <img src="/vacunacion-gato.jpg" alt="Vacunación para gatos" />
        </div>
      </section>

      {/* Info Section */}
      <section className="info-section fade-in">
        <div className="info-text">
          <h2>Vacunar a tu mascota es esencial para prevenir enfermedades graves.</h2>
          <p>
            Un <strong>calendario de vacunación adecuado</strong> es la mejor defensa para evitar enfermedades graves que puedan poner en riesgo la vida de tu perro o gato.
          </p>
          <p>
            Trabajamos para asegurarnos de que cada mascota reciba <strong>las vacunas que necesita</strong>, ajustando nuestro enfoque a su edad, estado de salud y estilo de vida.
          </p>
          <p>
            Nuestro objetivo es <strong>proteger a tu mascota contra enfermedades mortales</strong>, fortaleciendo su sistema inmunológico y garantizando que pueda disfrutar de una vida larga y saludable.
          </p>
        </div>
        <div className="info-image">
          <img src="/vacunacion-perro.jpg" alt="Vacunación para perros" />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section fade-in">
        <h3>Importancia de vacunar a tu mascota</h3>
        <ul>
          <li>✅ Prevención de enfermedades graves y mortales.</li>
          <li>✅ Protección de la salud pública ante la rabia.</li>
          <li>✅ Bienestar animal y tu tranquilidad.</li>
          <li>✅ Reducción de costos a largo plazo.</li>
          <li>✅ Requisito para viajes y eventos.</li>
        </ul>
      </section>
    </div>
  );
}

export default Vacunacion;