import { useEffect, useState } from "react";
import { api } from "../../../services/api";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  Loader2,
  Mail,
  Phone,
  RefreshCw,
  Sparkles,
  User,
  X,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get("/appointments");
      setAppointments(data);
      setFilteredAppointments(data);
    } catch (err) {
      const message = err?.response?.data?.message || "Error al cargar citas";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Filtrar citas
  useEffect(() => {
    let filtered = [...appointments];

    // Filtro por estado
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    // Filtro por fecha
    if (dateFilter) {
      filtered = filtered.filter((app) => app.date === dateFilter);
    }

    // Búsqueda por nombre de usuario o mascota
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.user.name.toLowerCase().includes(term) ||
          app.user.lastname.toLowerCase().includes(term) ||
          app.pet.name.toLowerCase().includes(term) ||
          app.user.email.toLowerCase().includes(term)
      );
    }

    setFilteredAppointments(filtered);
  }, [statusFilter, dateFilter, searchTerm, appointments]);

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailOpen(true);
  };

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      setUpdatingStatus(true);
      const { data } = await api.patch(
        `/appointments/${appointmentId}/status`,
        { status: newStatus }
      );

      // Actualizar en el estado
      setAppointments((prev) =>
        prev.map((app) => (app.id === appointmentId ? data : app))
      );

      if (selectedAppointment?.id === appointmentId) {
        setSelectedAppointment(data);
      }

      toast.success("Estado actualizado correctamente");
    } catch (err) {
      const message =
        err?.response?.data?.message || "No se pudo actualizar el estado";
      toast.error(message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("¿Estás seguro de cancelar esta cita?")) return;

    try {
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
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: {
        label: "Pendiente",
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
        icon: Clock,
        bgClass: "bg-yellow-50",
      },
      CONFIRMED: {
        label: "Confirmada",
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: CheckCircle,
        bgClass: "bg-blue-50",
      },
      CANCELLED: {
        label: "Cancelada",
        color: "bg-red-100 text-red-700 border-red-200",
        icon: XCircle,
        bgClass: "bg-red-50",
      },
      COMPLETED: {
        label: "Completada",
        color: "bg-green-100 text-green-700 border-green-200",
        icon: CheckCircle,
        bgClass: "bg-green-50",
      },
    };
    return configs[status];
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("es-PE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const clearFilters = () => {
    setStatusFilter("ALL");
    setDateFilter("");
    setSearchTerm("");
  };

  const hasActiveFilters = statusFilter !== "ALL" || dateFilter || searchTerm;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-[#E91E63] to-[#C2185B] rounded-2xl shadow-lg p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={24} />
              <h1 className="text-2xl md:text-3xl font-bold">
                Gestión de Citas
              </h1>
            </div>
            <p className="text-pink-100">
              Administra y gestiona todas las citas de la clínica
            </p>
          </div>
          <button
            onClick={fetchAppointments}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-white text-[#E91E63] px-5 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-60"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-gray-600" />
          <h2 className="font-semibold text-gray-900">Filtros</h2>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto text-sm text-[#E91E63] hover:text-[#d81b60] font-medium flex items-center gap-1"
            >
              <X size={16} />
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <input
              type="text"
              placeholder="Nombre, mascota, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E91E63] transition-colors"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E91E63] transition-colors bg-white"
            >
              <option value="ALL">Todos los estados</option>
              <option value="PENDING">Pendiente</option>
              <option value="CONFIRMED">Confirmada</option>
              <option value="COMPLETED">Completada</option>
              <option value="CANCELLED">Cancelada</option>
            </select>
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E91E63] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Error global */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm">
          <Loader2 className="animate-spin text-[#E91E63] mb-4" size={40} />
          <p className="text-gray-600">Cargando citas...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Calendar size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium mb-2">
            {hasActiveFilters
              ? "No hay citas con los filtros aplicados"
              : "No hay citas registradas"}
          </p>
          <p className="text-sm text-gray-500">
            {hasActiveFilters
              ? "Intenta cambiar los criterios de búsqueda"
              : "Las citas aparecerán aquí cuando los usuarios las agenden"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Mostrando{" "}
              <span className="font-semibold">
                {filteredAppointments.length}
              </span>{" "}
              {filteredAppointments.length === 1 ? "cita" : "citas"}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredAppointments.map((appointment) => {
              const statusConfig = getStatusConfig(appointment.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={appointment.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 p-5 cursor-pointer group"
                  onClick={() => handleViewDetails(appointment)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl ${statusConfig.bgClass} flex items-center justify-center`}
                      >
                        <StatusIcon
                          size={24}
                          className={statusConfig.color.split(" ")[1]}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-[#E91E63] transition-colors">
                          {appointment.service.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {formatDate(appointment.date)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${statusConfig.color}`}
                    >
                      {statusConfig.label}
                    </span>
                  </div>

                  {/* Detalles */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock size={16} className="text-gray-400" />
                      <span className="font-medium">
                        {formatDate(appointment.date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <User size={16} className="text-gray-400" />
                      <span>
                        {appointment.user.name} {appointment.user.lastname}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Sparkles size={16} className="text-gray-400" />
                      <span>
                        {appointment.pet.name} ({appointment.pet.species})
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900">
                      S/. {Number(appointment.service.price).toFixed(2)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(appointment);
                      }}
                      className="text-sm text-[#E91E63] hover:text-[#d81b60] font-medium"
                    >
                      Ver detalles →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal de detalles */}
      {isDetailOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-[#E91E63] to-[#C2185B] rounded-xl flex items-center justify-center">
                  <Calendar size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Detalles de la Cita
                  </h2>
                  <p className="text-xs text-gray-500">
                    ID: {selectedAppointment.id.slice(0, 8)}...
                  </p>
                </div>
              </div>
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                onClick={() => setIsDetailOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Estado actual */}
              <div className="bg-linear-to-r from-gray-50 to-gray-100 rounded-xl p-4">
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

              {/* Información del servicio */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Sparkles size={18} className="text-[#E91E63]" />
                  Servicio
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <p className="font-bold text-lg">
                    {selectedAppointment.service.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Tipo: {selectedAppointment.service.type}
                  </p>
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

              {/* Cliente */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User size={18} className="text-[#E91E63]" />
                  Cliente
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <p className="font-medium">
                    {selectedAppointment.user.name}{" "}
                    {selectedAppointment.user.lastname}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={14} />
                    <span>{selectedAppointment.user.email}</span>
                  </div>
                  {selectedAppointment.user.phoneNumber && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={14} />
                      <span>{selectedAppointment.user.phoneNumber}</span>
                    </div>
                  )}
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

              {/* Acciones */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Cambiar estado
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedAppointment.id, "CONFIRMED")
                    }
                    disabled={
                      updatingStatus ||
                      selectedAppointment.status === "CONFIRMED"
                    }
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle size={18} />
                    Confirmar
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedAppointment.id, "COMPLETED")
                    }
                    disabled={
                      updatingStatus ||
                      selectedAppointment.status === "COMPLETED"
                    }
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle size={18} />
                    Completar
                  </button>
                  <button
                    onClick={() =>
                      handleCancelAppointment(selectedAppointment.id)
                    }
                    disabled={
                      updatingStatus ||
                      selectedAppointment.status === "CANCELLED" ||
                      selectedAppointment.status === "COMPLETED"
                    }
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed col-span-2"
                  >
                    <XCircle size={18} />
                    Cancelar cita
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;
