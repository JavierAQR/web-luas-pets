import { FaPhone, FaWhatsapp, FaEnvelope, FaBook, FaShieldAlt, FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Contáctanos */}
        <div className="footer-section">
          <h3>Contáctanos</h3>
          <p><FaPhone /> Central: 01 748 8000</p>
          <p><FaWhatsapp /> WhatsApp: 01 748 8000</p>
          <p><FaEnvelope /> Email: vetluaspets@gmail.com</p>
        </div>

        {/* Legales */}
        <div className="footer-section">
          <h3>Legales</h3>
          <p><FaShieldAlt /> Términos y Condiciones</p>
          <p><FaBook /> Libro de reclamaciones</p>
        </div>

        {/* Redes Sociales */}
        <div className="footer-section">
          <h3>Redes Sociales</h3>
          
<a href="https://www.facebook.com/Luaspets" target="_blank" rel="noopener noreferrer">
    <FaFacebook /> Facebook
  </a>
  <a href="https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.instagram.com%2Fveterinarialuaspets&h=AT1cBq0rP3LnGzKgvdcMbqmXBQ5t658AcB1lRJhhbfjVjVL1hFMOfnQOZQ7h4uXHud_6Vrn8DbfyqnPRVuQaxmNJJ7PVKo6SB5gIGVgQypgqeHY2L08IPlLYh1owHe3LvJQ07-3v5zOxmmeBb2ez" target="_blank" rel="noopener noreferrer">
    <FaInstagram /> Instagram
  </a>
  <a href="https://tiktok.com/@luaspets" target="_blank" rel="noopener noreferrer">
    <FaTiktok /> TikTok
  </a>

        </div>
      </div>

      <div className="footer-bottom">
        <p>LUAS PETS © {new Date().getFullYear()} | Lima, Perú</p>
      </div>
    </footer>
  );
};

export default Footer;