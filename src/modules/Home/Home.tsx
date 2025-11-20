import { useState } from "react";
import { Link } from "react-router-dom";

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
      question:
        "Equipo veterinario especializado, con experiencia y ética profesional",
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
    <div className="font-[Poppins]">
      {/* Hero */}
      <section className="flex flex-wrap items-center justify-between bg-[#FCE4EC] py-16 px-6 md:px-10 rounded-xl gap-8">
        <div className="max-w-xl space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0a2d63]">
            Atención Veterinaria 24/7
          </h1>
          <p className="font-semibold text-[#E91E63]">
            Saludable desde la nariz hasta la cola
          </p>
          <p className="text-lg">
            Cuidado especializado y la más alta tecnología para tu mascota en un
            solo lugar.
          </p>

          <button
            className="inline-flex items-center gap-3 bg-[#E91E63] text-white py-3.5 px-6 text-lg rounded-lg border-none cursor-pointer transition duration-300 hover:bg-[#C2185B] hover:scale-105"
            onClick={() => window.open("https://wa.me/51968328872", "_blank")}
          >
            <FaCalendarAlt />
            Reserva tu cita
          </button>
        </div>

        <div className="flex justify-center w-full md:w-auto">
          <img
            src="/hero-mascota.png"
            alt="Mascota feliz"
            className="max-w-xs sm:max-w-sm md:max-w-md rounded-2xl"
          />
        </div>
      </section>


      <section className="text-center my-16">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0a3068] mb-10">
          ¿Qué podemos hacer por tu mascota hoy?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-5">
          <Link
            to="/consulta"
            className="bg-white rounded-2xl py-8 px-5 shadow-md flex flex-col items-center justify-center gap-3 text-lg text-[#0a3069] font-semibold transition transform hover:-translate-y-1 hover:shadow-xl no-underline"
          >
            <FaPaw className="text-3xl text-[#E91E63]" />
            Consultas
          </Link>
          <Link
            to="/bano-corte"
            className="bg-white rounded-2xl py-8 px-5 shadow-md flex flex-col items-center justify-center gap-3 text-lg text-[#0a3069] font-semibold transition transform hover:-translate-y-1 hover:shadow-xl no-underline"
          >
            <FaCut className="text-3xl text-[#E91E63]" />
            Baño y corte
          </Link>
          <Link
            to="/vacunacion"
            className="bg-white rounded-2xl py-8 px-5 shadow-md flex flex-col items-center justify-center gap-3 text-lg text-[#0a3069] font-semibold transition transform hover:-translate-y-1 hover:shadow-xl no-underline"
          >
            <FaSyringe className="text-3xl text-[#E91E63]" />
            Vacunación
          </Link>
          <Link
            to="/"
            className="bg-white rounded-2xl py-8 px-5 shadow-md flex flex-col items-center justify-center gap-3 text-lg text-[#0a3069] font-semibold transition transform hover:-translate-y-1 hover:shadow-xl no-underline"
          >
            <FaBone className="text-3xl text-[#E91E63]" />
            Desparasitación
          </Link>
          <Link
            to="/"
            className="bg-white rounded-2xl py-8 px-5 shadow-md flex flex-col items-center justify-center gap-3 text-lg text-[#0a3069] font-semibold transition transform hover:-translate-y-1 hover:shadow-xl no-underline"
          >
            <FaCalendarAlt className="text-3xl text-[#E91E63]" />
            Esterilización
          </Link>
        </div>
      </section>

      <section className="text-center my-16">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0a2d63] mb-8">
          Veterinaria LUAS PETS
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="flex flex-col items-center">
            <img
              src="/beneficio-tecnologia.jpg"
              alt="Tecnología"
              className="w-full max-w-xl rounded-xl"
            />
            <p className="mt-3 text-lg text-[#0D47A1]">
              La más alta tecnología
            </p>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="/infraestructura.jpg"
              alt="Infraestructura"
              className="w-full max-w-xl rounded-xl"
            />
            <p className="mt-3 text-lg text-[#0D47A1]">
              Infraestructura moderna
            </p>
          </div>
        </div>
      </section>

      <section className="text-center my-16">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0a2d63] mb-8">
          Lo que nuestros clientes dicen
        </h2>
        <div className="flex flex-wrap justify-center gap-5">
          <div className="bg-white rounded-lg p-5 shadow-md w-72">
            <img
              src="/testimonio-1.jpg"
              alt="Cliente 1"
              className="w-full rounded-md mb-3"
            />
            <p className="text-base text-gray-600">
              “Excelente atención y cuidado para mi mascota. ¡Muy recomendados!”
            </p>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-md w-72">
            <img
              src="/testimonio-2.jpg"
              alt="Cliente 2"
              className="w-full rounded-md mb-3"
            />
            <p className="text-base text-gray-600">
              “Profesionales atentos y dedicados. Mi mascota está feliz.”
            </p>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-md w-72">
            <img
              src="/testimonio-3.jpg"
              alt="Cliente 3"
              className="w-full rounded-md mb-3"
            />
            <p className="text-base text-gray-600">
              “Servicio rápido y confiable. ¡Gracias LUAS PETS!”
            </p>
          </div>
        </div>
      </section>

      <section className="text-center my-16">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0a2d63] mb-8">
          Encuéntranos en San Borja
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-6">
          <img
            src="/mapa-clinica.png"
            alt="Mapa de la clínica"
            className="w-full max-w-md rounded-xl"
          />
          <div className="text-left max-w-sm space-y-4">
            <p>
              Mz F Lt 1 El Haras de Chillon, Puente Piedra, Lima, Perú lima18
            </p>
            <a
              href="https://maps.app.goo.gl/YqviqwVBYewqd4Ku6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#E91E63] text-white py-3 px-5 rounded-md font-semibold no-underline transition duration-300 hover:bg-[#C2185B] hover:scale-105"
            >
              Abrir en Google Maps
            </a>
          </div>
        </div>
      </section>
      
      <section className="text-center my-16">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0a2d63] mb-8">
          ¿Por qué elegirnos como tu veterinaria de confianza?
        </h2>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => {
            const isOpen = openFAQ === index;
            return (
              <div
                key={index}
                className="bg-white rounded-xl mb-4 shadow-md hover:shadow-lg transition-shadow"
              >
                <button
                  className={`w-full flex justify-between items-center py-4 px-5 text-left text-lg font-semibold cursor-pointer ${
                    isOpen ? "text-[#E91E63]" : "text-[#0a2d63]"
                  }`}
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{faq.question}</span>
                  <FaChevronDown
                    className={`transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className="px-5 text-base text-gray-800 leading-relaxed border-t border-gray-200 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out"
                  style={{
                    maxHeight: isOpen ? "500px" : "0",
                    opacity: isOpen ? 1 : 0
                  }}
                >
                  <p className="my-4">{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;
