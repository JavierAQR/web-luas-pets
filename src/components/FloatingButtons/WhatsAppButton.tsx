
import "./FloatingButtons.css";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  const whatsappLink = "https://wa.me/51968328872"; // Cambia por tu número

  return (
    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="floating-btn whatsapp-btn">
      <FaWhatsapp />
    </a>
  );
};

export default WhatsAppButton;
