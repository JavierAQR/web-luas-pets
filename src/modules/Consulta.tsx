import "./Consulta.css";
import { FaCalendarAlt, FaCheckCircle } from "react-icons/fa";

const Consulta: React.FC = () => {
  const senales = [
    "Vómitos o diarrea",
    "Pérdida de apetito o aumento del apetito",
    "Mal aliento o dificultad al comer",
    "Picazón y rascado constante",
    "Excesiva caída de pelo o pelaje opaco",
    "Aumento de la sed y la micción",
    "Decaimiento, hiperactividad o cambios en el comportamiento"
  ];

  return (
    <div className="consulta">
      {/* Hero */}
      <section className="consulta-hero fade-in">
        <div className="hero-text">
          <h1>Consulta veterinaria</h1>
          <p>
            Contamos con un equipo de veterinarios para brindarte una atención
            interdisciplinaria que asegura el mejor cuidado de tu mascota.
          </p>
          <a href="https://wa.me/51968328872" className="cta-btn">
            <FaCalendarAlt /> Agenda una consulta
          </a>
        </div>
        <div className="hero-image">
          <img src="/consulta-hero.jpg" alt="Veterinario atendiendo mascota" />
        </div>
      </section>

      {/* Descripción */}
      <section className="consulta-info fade-in">
        <h2>
          Una consulta veterinaria permite detectar problemas de salud en sus
          primeras etapas o manejar eficazmente enfermedades crónicas.
        </h2>
        <p>
          Trabajamos para identificar la causa de cualquier problema y definir el
          enfoque más adecuado para su tratamiento.
        </p>
        <p>
          Nuestro objetivo es <strong>aliviar los síntomas más molestos</strong>,
          <strong> solucionar la causa subyacente</strong> y
          <strong> prevenir complicaciones futuras</strong>, brindando una atención
          integral desde el primer día.
        </p>
      </section>

      {/* Banner CTA */}
      <section className="consulta-banner fade-in">
        <div className="banner-text">
          <h3>¿Tu mascota presenta síntomas de una enfermedad?</h3>
          <p>No esperes más.</p>
          <a href="/reservas" className="cta-btn">
            <FaCalendarAlt /> Agenda una consulta
          </a>
        </div>
        <div className="banner-image">
          <img src="/consulta-banner.jpg" alt="Mascota feliz" />
        </div>
      </section>

      {/* Señales */}
      <section className="consulta-senales fade-in">
        <div className="senales-text">
          <h3>
            Señales que indican que tu perro o gato necesita una consulta veterinaria
          </h3>
          <ul>
            {senales.map((item, index) => (
              <li key={index}>
                <FaCheckCircle className="icon" /> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="senales-image">
          <img src="/consulta-senales.jpg" alt="Chequeo veterinario" />
        </div>
      </section>
    </div>
  );
};

export default Consulta;