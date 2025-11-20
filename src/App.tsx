import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuienesSomos from "./modules/QuienesSomos";
import Equipo from "./modules/Equipo";
import Consulta from "./modules/Consulta";
import Vacunacion from "./modules/Vacunacion";
import BanoCorte from "./modules/BanoCorte";
import Contacto from "./modules/Contacto";
import Home from "./modules/Home/Home";
import Login from "./modules/Auth/Login";
import Register from "./modules/Auth/Register";
import AdminLayout from "./modules/Admin/layout/AdminLayout";
import ServicesPage from "./modules/Admin/services/ServicesPage";
import PublicLayout from "./components/PublicLayout";
import ProductsPage from "./modules/Admin/products/ProductsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/quienes-somos" element={<QuienesSomos />} />
          <Route path="/equipo" element={<Equipo />} />
          <Route path="/consulta" element={<Consulta />} />
          <Route path="/vacunacion" element={<Vacunacion />} />
          <Route path="/bano-corte" element={<BanoCorte />} />
          <Route path="/contacto" element={<Contacto />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="services" element={<ServicesPage />} />
          <Route path="products" element={<ProductsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
