import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Sparkles,
  CheckCircle,
  XCircle,
  Eye,
  X,
  Loader2,
  AlertCircle,
  Plus,
} from "lucide-react";
import { api } from "../../../services/api";
import toast from "react-hot-toast";
import { formatDate, formatTime } from "../../../utils/format";

const MyAppointmentsPage = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchMyAppointments();
  }, []);

  const fetchMyAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get("/appointments/me");
      setAppointments(data);
    } catch (err) {
      const message =
        err?.response?.data?.message || "Error al cargar tus citas";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailOpen(true);
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("¿Estás seguro de cancelar esta cita?")) return;

    try {
      setCancelling(true);
      await api.delete(`/appointments/${appointmentId}`);

      setAppointments((prev) =>
        prev.map((app) =>
          app.id === appointmentId ? { ...app, status: "CANCELLED" } : app
        )
      );

      if (selectedAppointment?.id === appointmentId) {
        setSelectedAppointment({ ...selectedAppointment, status: "CANCELLED" });
      }

      toast.success("Cita cancelada correctamente");
    } catch (err) {
      const message =
        err?.response?.data?.message || "No se pudo cancelar la cita";
      toast.error(message);
    } finally {
      setCancelling(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: {
        label: "Pendiente",
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
        icon: Clock,
      },
      CONFIRMED: {
        label: "Confirmada",
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: CheckCircle,
      },
      CANCELLED: {
        label: "Cancelada",
        color: "bg-red-100 text-red-700 border-red-200",
        icon: XCircle,
      },
      COMPLETED: {
        label: "Completada",
        color: "bg-green-100 text-green-700 border-green-200",
        icon: CheckCircle,
      },
    };
    return configs[status];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="animate-spin text-[#E91E63] mb-4" size={40} />
            <p className="text-gray-600">Cargando tus citas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0D47A1] mb-2">
            Mis Citas
          </h1>
          <p className="text-gray-600">
            Administra y consulta todas tus citas veterinarias
          </p>
        </div>

        <div className="mb-6">
          <button
            onClick={() => navigate("/appointments/new")}
            className="flex items-center gap-2 bg-[#E91E63] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#d81b60] transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <Plus size={20} />
            Nueva Cita
          </button>
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

        {/* Appointments List */}
        {appointments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium mb-2">
              No tienes citas registradas
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Agenda tu primera cita para el cuidado de tu mascota
            </p>
            <button
              onClick={() => navigate("/appointments/new")}
              className="inline-flex items-center gap-2 bg-[#E91E63] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#d81b60] transition-all"
            >
              <Plus size={20} />
              Crear Cita
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {appointments.map((appointment) => {
              const statusConfig = getStatusConfig(appointment.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={appointment.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 p-6"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {appointment.service.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(appointment.date)}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${statusConfig.color}`}
                    >
                      <StatusIcon size={14} />
                      {statusConfig.label}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock size={16} className="text-gray-400" />
                      <span className="font-medium">
                        {appointment.startTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Sparkles size={16} className="text-gray-400" />
                      <span>
                        {appointment.pet.name} ({appointment.pet.species})
                      </span>
                    </div>
                    {appointment.reason && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Motivo:</p>
                        <p className="text-sm text-gray-900">
                          {appointment.reason}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleViewDetails(appointment)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors font-medium text-sm"
                    >
                      <Eye size={16} />
                      Ver detalles
                    </button>
                    {appointment.status === "PENDING" && (
                      <button
                        onClick={() => handleCancelAppointment(appointment.id)}
                        disabled={cancelling}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors font-medium text-sm disabled:opacity-50"
                      >
                        <XCircle size={16} />
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Detail Modal */}
        {isDetailOpen && selectedAppointment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Detalles de la Cita
                  </h2>
                  <p className="text-xs text-gray-500">
                    ID: {selectedAppointment.id.slice(0, 8)}...
                  </p>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  onClick={() => setIsDetailOpen(false)}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Estado */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-600 mb-2">Estado actual</p>
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border ${
                      getStatusConfig(selectedAppointment.status).color
                    }`}
                  >
                    {(() => {
                      const StatusIcon = getStatusConfig(
                        selectedAppointment.status
                      ).icon;
                      return <StatusIcon size={18} />;
                    })()}
                    {getStatusConfig(selectedAppointment.status).label}
                  </span>
                </div>

                {/* Servicio */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Sparkles size={18} className="text-[#E91E63]" />
                    Servicio
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <p className="font-bold text-lg">
                      {selectedAppointment.service.name}
                    </p>
                    {selectedAppointment.service.description && (
                      <p className="text-sm text-gray-600">
                        {selectedAppointment.service.description}
                      </p>
                    )}
                    <p className="text-sm font-bold text-gray-900">
                      Precio: S/.{" "}
                      {Number(selectedAppointment.service.price).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Fecha y hora */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar size={18} className="text-[#E91E63]" />
                    Fecha y Hora
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Fecha:</span>{" "}
                      {formatDate(selectedAppointment.date)}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Hora:</span>{" "}
                      {formatTime(selectedAppointment.date)}
                    </p>
                  </div>
                </div>

                {/* Mascota */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Sparkles size={18} className="text-[#E91E63]" />
                    Mascota
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <p className="font-medium text-lg">
                      {selectedAppointment.pet.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Especie: {selectedAppointment.pet.species}
                    </p>
                    {selectedAppointment.pet.breed && (
                      <p className="text-sm text-gray-600">
                        Raza: {selectedAppointment.pet.breed}
                      </p>
                    )}
                  </div>
                </div>

                {/* Motivo */}
                {selectedAppointment.reason && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Motivo de la cita
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-700">
                        {selectedAppointment.reason}
                      </p>
                    </div>
                  </div>
                )}

                {/* Acción de cancelar */}
                {selectedAppointment.status === "PENDING" && (
                  <div className="border-t pt-6">
                    <button
                      onClick={() =>
                        handleCancelAppointment(selectedAppointment.id)
                      }
                      disabled={cancelling}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 transition-colors font-medium text-sm disabled:opacity-50"
                    >
                      <XCircle size={18} />
                      Cancelar esta cita
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointmentsPage;