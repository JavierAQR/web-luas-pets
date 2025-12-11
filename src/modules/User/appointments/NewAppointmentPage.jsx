import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Calendar,
  Clock,
  Sparkles,
  PawPrint,
  MessageSquare,
  Loader2,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../../services/api";

const NewAppointmentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedService = location.state?.serviceId;

  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    petId: "",
    serviceId: preselectedService || "",
    date: "",
    startTime: "",
    reason: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [petsRes, servicesRes] = await Promise.all([
        api.get("/pets"),
        api.get("/services"),
      ]);

      setPets(petsRes.data);
      setServices(servicesRes.data.filter((s) => s.isActive));
    } catch (err) {
      setError("Error al cargar los datos");
      toast.error("No se pudieron cargar las mascotas o servicios");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.petId || !formData.serviceId || !formData.date || !formData.startTime) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Combinar fecha y hora para enviar al backend
      const dateTime = new Date(`${formData.date}T${formData.startTime}:00`);

      await api.post("/appointments", {
        petId: formData.petId,
        serviceId: formData.serviceId,
        date: dateTime.toISOString(),
        startTime: formData.startTime,
        reason: formData.reason || null,
      });

      toast.success("¡Cita agendada exitosamente!");
      navigate("/my-appointments");
    } catch (err) {
      const message =
        err?.response?.data?.message || "No se pudo crear la cita";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedService = services.find((s) => s.id === formData.serviceId);

  if (loading) {
    return (
      <div className="bg-gray-50 pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="animate-spin text-[#E91E63] mb-4" size={40} />
            <p className="text-gray-600">Cargando formulario...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 pt-10 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-[#E91E63] transition-colors mb-6"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Volver</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0D47A1] mb-2">
            Agendar Nueva Cita
          </h1>
          <p className="text-gray-600">
            Completa los datos para reservar tu cita veterinaria
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* No pets warning */}
        {pets.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle size={24} className="text-yellow-600 shrink-0" />
              <div>
                <p className="font-semibold text-yellow-900 mb-1">
                  No tienes mascotas registradas
                </p>
                <p className="text-sm text-yellow-700 mb-3">
                  Necesitas registrar al menos una mascota antes de agendar una cita
                </p>
                <button
                  onClick={() => navigate("/pets/new")}
                  className="text-sm font-semibold text-yellow-900 underline hover:text-yellow-800"
                >
                  Registrar mascota →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
          {/* Mascota */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <PawPrint size={18} className="text-[#E91E63]" />
              Selecciona tu mascota
              <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.petId}
              onChange={handleChange("petId")}
              required
              disabled={pets.length === 0}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E91E63] transition-colors bg-white disabled:bg-gray-100"
            >
              <option value="">Selecciona una mascota</option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name} ({pet.species} - {pet.breed || "Sin raza"})
                </option>
              ))}
            </select>
          </div>

          {/* Servicio */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Sparkles size={18} className="text-[#E91E63]" />
              Servicio
              <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.serviceId}
              onChange={handleChange("serviceId")}
              required
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E91E63] transition-colors bg-white"
            >
              <option value="">Selecciona un servicio</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - S/. {Number(service.price).toFixed(2)}
                  {service.durationMin && ` (${service.durationMin} min)`}
                </option>
              ))}
            </select>

            {selectedService && (
              <div className="mt-3 p-4 bg-pink-50 border border-pink-100 rounded-xl">
                <p className="text-sm text-gray-700 mb-2">
                  {selectedService.description || "Sin descripción"}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  {selectedService.durationMin && (
                    <span className="text-gray-600">
                      ⏱️ {selectedService.durationMin} minutos
                    </span>
                  )}
                  <span className="font-bold text-gray-900">
                    💰 S/. {Number(selectedService.price).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Fecha y Hora */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar size={18} className="text-[#E91E63]" />
                Fecha
                <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={handleChange("date")}
                min={new Date().toISOString().split("T")[0]}
                required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E91E63] transition-colors"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Clock size={18} className="text-[#E91E63]" />
                Hora
                <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={handleChange("startTime")}
                required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E91E63] transition-colors"
              />
            </div>
          </div>

          {/* Motivo */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <MessageSquare size={18} className="text-[#E91E63]" />
              Motivo de la consulta
              <span className="text-gray-500 font-normal">(opcional)</span>
            </label>
            <textarea
              value={formData.reason}
              onChange={handleChange("reason")}
              placeholder="Describe el motivo de la cita..."
              rows={4}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E91E63] transition-colors resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 text-sm rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || pets.length === 0}
              className="flex-1 sm:flex-none px-6 py-3 text-sm rounded-xl bg-[#E91E63] text-white font-semibold hover:bg-[#d81b60] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Agendando...
                </>
              ) : (
                <>
                  <Calendar size={18} />
                  Agendar Cita
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAppointmentPage;