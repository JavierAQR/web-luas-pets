import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import WhatsAppButton from "./FloatingButtons/WhatsAppButton";
import ScrollTopButton from "./FloatingButtons/ScrollTopButton";

export default function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <WhatsAppButton />
      <ScrollTopButton />
    </>
  );
}
