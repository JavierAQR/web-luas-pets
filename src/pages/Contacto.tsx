import "./Contacto.css";
import { useEffect } from "react";

function Contacto() {
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
    <div className="contacto-container">
      {/* Hero */}
      <section className="contacto-hero fade-in">
        <h1>Contáctanos</h1>
        <p>Estamos aquí para cuidar a tu mejor amigo. ¡Escríbenos o visítanos!</p>
      </section>

      {/* Info rápida */}
      <section className="contacto-info fade-in">
        <div className="info-card">
          <h3>📍 Dirección</h3>
          <p>Mz F Lt 1 El Haras de Chillón, Puente Piedra, Lima, Perú</p>
        </div>
        <div className="info-card">
          <h3>📞 Teléfono</h3>
          <p>968 328 872</p>
        </div>
        <div className="info-card">
          <h3>📧 Correo</h3>
          <p>Vetluaspets@gmail.com</p>
        </div>
      </section>

      {/* Formulario */}
      <section className="contacto-form fade-in">
        <h2>Envíanos un mensaje</h2>
        <form>
          <input type="text" placeholder="Tu nombre" required />
          <input type="email" placeholder="Tu correo" required />
          <textarea placeholder="Escribe tu mensaje..." required></textarea>
          <button type="submit" className="cta-button">Enviar mensaje</button>
        </form>
      </section>

      {/* WhatsApp */}
      <section className="contacto-whatsapp fade-in">
        <a href="https://wa.me/51968328872" target="_blank" rel="noopener noreferrer">
          💬 Chatea por WhatsApp
        </a>
      </section>

      {/* Mapa */}
      <section className="contacto-mapa fade-in">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.000000!2d-77.000000!3d-12.000000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDAwJzAwLjAiUyA3N8KwMDAnMDAuMCJX!5e0!3m2!1ses!2spe!4v000000000"
          width="100%"
          height="350"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </section>
    </div>
  );
}

export default Contacto;