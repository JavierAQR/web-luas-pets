import "./QuienesSomos.css";

const QuienesSomos: React.FC = () => {
  return (
    <div className="quienes-somos">
      {/* Hero */}
      <section className="qs-hero">
        <div className="qs-text">
          <h1>Somos LUAS PETS</h1>
          <p>
            Somos una clínica veterinaria comprometida con ofrecer atención integral,
            basada en la ciencia, tecnología avanzada y un cuidado ético y respetuoso
            para tu mascota.
          </p>
        </div>
        <div className="qs-image">
          <img src="/quienes-hero.jpg" alt="Mascotas felices" />
        </div>
      </section>

      {/* Misión */}
      <section className="qs-mision">
        <h2>Queremos mejorar la calidad de vida de cada mascota.</h2>
        <p>
          <strong>Promovemos la excelencia en la atención veterinaria</strong> a través del uso
          de <strong>prácticas clínicas avanzadas, tecnología de última generación e innovación constante.</strong>
        </p>
        <p>
          <strong>Impulsamos la prevención</strong> como clave para evitar enfermedades,
          garantizando una vida larga y saludable para cada mascota.
        </p>
        <p>
          <strong>Ofrecemos una atención veterinaria integral y de alta calidad</strong>,
          respaldada por 5 pilares fundamentales: ética profesional, excelencia médica,
          tecnología avanzada, prácticas basadas en evidencia científica y un trato amable y respetuoso.
        </p>
      </section>

      {/* Pilares */}
      <section className="qs-pilares">
        <div className="pilar">
          <div className="pilar-text">
            <h3>Pilar 1</h3>
            <h4>Ética profesional: la base de todo</h4>
            <p>
              Creemos firmemente que <strong>sin ética, no hay nada</strong>. Cada acción está guiada por
              principios éticos sólidos, priorizando el <strong>bienestar de tu mascota</strong>.
            </p>
          </div>
          <div className="pilar-img">
            <img src="/pilar-1.jpg" alt="Ética profesional" />
          </div>
        </div>

        <div className="pilar reverse">
          <div className="pilar-img">
            <img src="/pilar-2.jpg" alt="Excelentes profesionales" />
          </div>
          <div className="pilar-text">
            <h3>Pilar 2</h3>
            <h4>Excelentes profesionales: conocimiento y experiencia</h4>
            <p>
              Nuestro equipo está formado por veterinarios altamente capacitados, combinando
              <strong>profundo conocimiento</strong> con <strong>dedicación absoluta</strong>.
            </p>
          </div>
        </div>

        <div className="pilar">
          <div className="pilar-text">
            <h3>Pilar 3</h3>
            <h4>Tecnología avanzada: las mejores herramientas</h4>
            <p>
              Contamos con <strong>equipos de última generación</strong> para ofrecer diagnósticos
              y tratamientos <strong>precisos y eficientes</strong>.
            </p>
          </div>
          <div className="pilar-img">
            <img src="/pilar-3.jpg" alt="Tecnología avanzada" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default QuienesSomos;