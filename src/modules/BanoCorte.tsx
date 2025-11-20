import "./BanoCorte.css";
import { useEffect } from "react";

function BanoCorte() {
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
    <div className="bano-container">
      {/* Hero */}
      <section className="hero-section fade-in">
        <div className="hero-text">
          <h1>Baño y corte para perros</h1>
          <p>
            Grooming profesional, un trato cuidadoso y los mejores productos para su higiene.
          </p>
          <a
            href="https://wa.me/51968328872"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-button"
          >
            🛁 Reservar baño
          </a>
        </div>
        <div className="hero-image">
          <img src="/bano-perro-hero.jpg" alt="Baño y corte para perros" />
        </div>
      </section>

      {/* Info */}
      <section className="info-section fade-in">
        <div className="info-text">
          <h2>Trabajamos para identificar las necesidades específicas de cada mascota</h2>
          <p>
            Nuestro objetivo es <strong>eliminar la suciedad</strong> y el exceso de pelo, evitar problemas dermatológicos y asegurar que tu mascota se sienta cómoda y feliz.
          </p>
          <p>
            Un baño y corte regular es esencial para la salud y bienestar de tu perro.
          </p>
        </div>
        <div className="info-image">
          <img src="/bano-perro-info.jpg" alt="Grooming profesional" />
        </div>
      </section>

      {/* Lista de pasos */}
      <section className="steps-section fade-in">
        <h3>El baño incluye:</h3>
        <ul>
          <li>✅ Cepillado básico</li>
          <li>✅ Limpieza de glándulas anales</li>
          <li>✅ Limpieza de orejas</li>
          <li>✅ Corte y limado de uñas</li>
          <li>✅ Corte higiénico</li>
          <li>✅ Perfume</li>
        </ul>
      </section>

      {/* Acordeones */}
      <section className="accordion-section fade-in">
        <h3>Tipos de Baños</h3>
        <div className="accordion">
          <details>
            <summary>Baño Estándar</summary>
            <p>Incluye limpieza básica y secado.</p>
          </details>
          <details>
            <summary>Baño Premium</summary>
            <p>Incluye productos especiales y masaje relajante.</p>
          </details>
          <details>
            <summary>Baño Hipoalergénico</summary>
            <p>Ideal para piel sensible.</p>
          </details>
          <details>
            <summary>Baño Medicado</summary>
            <p>Tratamiento especial para problemas dermatológicos.</p>
          </details>
          <details>
            <summary>Baño Antipulgas</summary>
            <p>Protección contra parásitos externos.</p>
          </details>
        </div>
      </section>
    </div>
  );
}

export default BanoCorte;