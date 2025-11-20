import "./Home.css";
import { useState } from "react";
import { Link } from "react-router-dom"; // ✅ Importación necesaria

import {
  FaCalendarAlt,
  FaSyringe,
  FaCut,
  FaPaw,
  FaBone,
  FaChevronDown
} from "react-icons/fa";

const Home: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "Equipo veterinario especializado, con experiencia y ética profesional",
      answer:
        "Nuestro equipo está formado por veterinarios con amplia experiencia, comprometidos con los más altos estándares de ética profesional. Cada miembro se dedica a brindar un cuidado personalizado y compasivo, garantizando que tu mascota reciba la mejor atención posible, siempre con respeto y responsabilidad."
    },
    {
      question: "Tecnología avanzada para diagnósticos y tratamientos precisos",
      answer:
        "Contamos con equipos de última generación para garantizar diagnósticos rápidos y tratamientos efectivos, reduciendo riesgos y mejorando la calidad de vida de tu mascota."
    },
    {
      question: "Infraestructura cómoda y manejo libre de estrés",
      answer:
        "Nuestras instalaciones están diseñadas para reducir el estrés de tu mascota, con áreas amplias, limpias y seguras."
    },
    {
      question: "Servicio veterinario integral en un solo lugar",
      answer:
        "Ofrecemos consultas, cirugías, vacunación, estética y más, todo en un mismo centro para tu comodidad."
    }
  ];

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-text">
          <h1>Atención Veterinaria 24/7</h1>
          <p className="subtitle">Saludable desde la nariz hasta la cola</p>
          <p>
            Cuidado especializado y la más alta tecnología para tu mascota en un
            solo lugar.
          </p>
          
          <button
            className="cta-btn"
            onClick={() => window.open("https://wa.me/51968328872", "_blank")}
          >
  
            <FaCalendarAlt /> Reserva tu cita
          </button>
        </div>
        <div className="hero-image">
          <img src="/hero-mascota.png" alt="Mascota feliz" />
        </div>
      </section>

      {/* Servicios */}
      <section className="services">
        <h2>¿Qué podemos hacer por tu mascota hoy?</h2>
        <div className="service-grid">
          <Link to="/consulta" className="service-card"><FaPaw /> Consultas</Link>
          <Link to="/bano-corte" className="service-card"><FaCut /> Baño y corte</Link>
          <Link to="/vacunacion" className="service-card"><FaSyringe /> Vacunación</Link>
          <Link to="/" className="service-card"><FaBone /> Desparasitación</Link>
          <Link to="/" className="service-card"><FaCalendarAlt /> Esterilización</Link>
        </div>
      </section>

      {/* Beneficios */}
      <section className="benefits">
        <h2>Veterinaria LUAS PETS</h2>
        <div className="benefit-list">
          <div className="benefit-item">
            <img src="/beneficio-tecnologia.jpg" alt="Tecnología" />
            <p>La más alta tecnología</p>
          </div>
          <div className="benefit-item">
            <img src="/infraestructura.jpg" alt="Infraestructura" />
            <p>Infraestructura moderna</p>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="testimonials">
        <h2>Lo que nuestros clientes dicen</h2>
        <div className="testimonial-grid">
          <div className="testimonial-card">
            <img src="/testimonio-1.jpg" alt="Cliente 1" />
            <p>“Excelente atención y cuidado para mi mascota. ¡Muy recomendados!”</p>
          </div>
          <div className="testimonial-card">
            <img src="/testimonio-2.jpg" alt="Cliente 2" />
            <p>“Profesionales atentos y dedicados. Mi mascota está feliz.”</p>
          </div>
          <div className="testimonial-card">
            <img src="/testimonio-3.jpg" alt="Cliente 3" />
            <p>“Servicio rápido y confiable. ¡Gracias LUAS PETS!”</p>
          </div>
        </div>
      </section>

      {/* Ubicación */}
      <section className="location">
        <h2>Encuéntranos en San Borja</h2>
        <div className="map-container">
          <img src="/mapa-clinica.png" alt="Mapa de la clínica" />
          <div className="map-info">
            <p>Mz F Lt 1 El Haras de Chillon, Puente Piedra, Lima, Perú lima18</p>
            <a
              href="https://maps.app.goo.gl/YqviqwVBYewqd4Ku6"
              target="_blank"
              rel="noopener noreferrer"
              className="map-btn"
            >
              Abrir en Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq">
        <h2>¿Por qué elegirnos como tu veterinaria de confianza?</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className={`faq-item ${openFAQ === index ? "open" : ""}`}>
              <button className="faq-header" onClick={() => toggleFAQ(index)}>
                <span>{faq.question}</span>
                <FaChevronDown className="faq-icon" />
              </button>
              <div
                className="faq-content"
                style={{
                  maxHeight: openFAQ === index ? "500px" : "0",
                  opacity: openFAQ === index ? 1 : 0,
                  overflow: "hidden",
                  transition: "max-height 0.4s ease, opacity 0.3s ease"
                }}
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;