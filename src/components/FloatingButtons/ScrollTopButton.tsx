import "./FloatingButtons.css";
import { FaPaw } from "react-icons/fa";

const ScrollTopButton = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button onClick={scrollToTop} className="floating-btn paw-btn">
      <FaPaw />
    </button>
  );
};

export default ScrollTopButton;