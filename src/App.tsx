import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import WhatsAppButton from "./components/FloatingButtons/WhatsAppButton";
import ScrollTopButton from "./components/FloatingButtons/ScrollTopButton";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuienesSomos from "./modules/QuienesSomos";
import Equipo from "./modules/Equipo";
import Consulta from "./modules/Consulta"
import Vacunacion from "./modules/Vacunacion"
import BanoCorte from "./modules/BanoCorte";
import Contacto from "./modules/Contacto"
import Home from "./modules/Home/Home";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quienes-somos" element={<QuienesSomos />} />
        <Route path="/equipo" element={<Equipo />} />
        <Route path="/consulta" element={<Consulta />} />
        <Route path="/vacunacion" element={<Vacunacion />} />
        <Route path="/bano-corte" element={<BanoCorte />} />
        <Route path="/contacto" element={<Contacto />} />
       

        <Route path="/quienes-somos" element={<h1>Quiénes somos</h1>} />
        <Route path="/equipo" element={<h1>Nuestro equipo</h1>} />
        <Route path="/productos" element={<h1>Productos</h1>} />
        <Route path="/reservas" element={<h1>Reservas</h1>} />
        <Route path="/contacto" element={<h1>Contacto</h1>} />
      </Routes>
      <Footer />
      <WhatsAppButton />
      <ScrollTopButton />
    </Router>
  );
}

export default App;