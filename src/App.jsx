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
import AppointmentsPage from "./modules/Admin/appointments/AppointmentsPage";
import DashboardPage from "./modules/Admin/dashboard/DashboardPage";
import ServicesSection from "./modules/Home/ServiceSection";
import MyAppointmentsPage from "./modules/User/appointments/MyAppointmentsPage";
import NewAppointmentPage from "./modules/User/appointments/NewAppointmentPage";
import MyPetsPage from "./modules/User/pets/MyPetsPage";
import PetFormPage from "./modules/User/pets/PetFormPage";

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

          <Route path="/servicios" element={<ServicesSection />} />
          <Route path="/my-appointments" element={<MyAppointmentsPage />} />
          <Route path="/appointments/new" element={<NewAppointmentPage />} />
          <Route path="/my-pets" element={<MyPetsPage />} />
          <Route path="/pets/new" element={<PetFormPage />} />
          <Route path="/pets/edit/:id" element={<PetFormPage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="appointments" element={<AppointmentsPage/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
