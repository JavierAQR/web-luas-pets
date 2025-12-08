import { useEffect, useState, type FormEvent } from "react";
import { api } from "../../../services/api";
import toast from "react-hot-toast";
import { AlertCircle, Clock, DollarSign, Edit, ImageIcon, Loader2, Plus, Sparkles, Trash2, X } from "lucide-react";

type ServiceType = "GROOMING" | "CONSULTATION" | "VACCINE";

export interface AdminService {
  id: string;
  name: string;
  description?: string | null;
  type: ServiceType;
  durationMin?: number | null;
  price: number;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
}

interface ServiceFormState {
  id?: string;
  name: string;
  description: string;
  type: ServiceType;
  durationMin: string;
  price: string;
  imageFile: File | null;
}

const initialForm: ServiceFormState = {
  name: "",
  description: "",
  type: "GROOMING",
  durationMin: "",
  price: "",
  imageFile: null,
};

const ServicesPage = () => {
  const [services, setServices] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<ServiceFormState>(initialForm);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get<AdminService[]>("/services");
      setServices(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Error al cargar servicios";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenCreate = () => {
    setForm(initialForm);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (service: AdminService) => {
    setForm({
      id: service.id,
      name: service.name,
      description: service.description ?? "",
      type: service.type,
      durationMin: service.durationMin ? String(service.durationMin) : "",
      price: String(service.price),
      imageFile: null,
    });
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleDelete = async (service: AdminService) => {
    if (!window.confirm(`¿Eliminar el servicio "${service.name}"?`)) return;
    try {
      await api.delete(`/services/${service.id}`);
      setServices((prev) => prev.filter((s) => s.id !== service.id));
      toast.success("Servicio eliminado correctamente.");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "No se pudo eliminar el servicio";
      toast.error(message);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("type", form.type);
      if (form.durationMin) formData.append("durationMin", form.durationMin);
      if (form.price) formData.append("price", form.price);
      if (!isEditing && !form.imageFile) {
        throw new Error("La imagen es obligatoria para crear un servicio");
      }
      if (form.imageFile) {
        formData.append("image", form.imageFile);
      }

      let response;
      if (isEditing && form.id) {
        response = await api.put<AdminService>(`/services/${form.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await api.post<AdminService>("/services", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      const saved = response.data;

      setServices((prev) => {
        if (isEditing) {
          return prev.map((s) => (s.id === saved.id ? saved : s));
        }
        return [saved, ...prev];
      });

      setIsFormOpen(false);
      setForm(initialForm);
      setIsEditing(false);
      toast.success(
        isEditing
          ? "Servicio actualizado correctamente."
          : "Servicio creado correctamente."
      );
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error)?.message ||
        "No se pudo guardar el servicio";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange =
    (field: keyof ServiceFormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      if (field === "imageFile" && e.target instanceof HTMLInputElement) {
        const file = e.target.files?.[0] ?? null;
        setForm((prev) => ({ ...prev, imageFile: file }));
      } else {
        const value = e.target.value;
        setForm((prev) => ({ ...prev, [field]: value }));
      }
    };

  const getTypeConfig = (type: AdminService["type"]) => {
    const configs = {
      GROOMING: {
        label: "Grooming",
        color: "bg-purple-100 text-purple-700 border-purple-200",
      },
      CONSULTATION: {
        label: "Consulta",
        color: "bg-blue-100 text-blue-700 border-blue-200",
      },
      VACCINE: {
        label: "Vacuna",
        color: "bg-green-100 text-green-700 border-green-200",
        icon: "💉",
      },
    };
    return configs[type];
  };

  return (
    <div className="space-y-6">
      {/* Header con gradiente */}
      <div className="bg-linear-to-r from-[#E91E63] to-[#C2185B] rounded-2xl shadow-lg p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={24} />
              <h1 className="text-2xl md:text-3xl font-bold">
                Gestión de Servicios
              </h1>
            </div>
            <p className="text-pink-100">
              Administra los servicios de  clínica veterinaria
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 bg-white text-[#E91E63] px-5 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <Plus size={20} />
            <span>Nuevo servicio</span>
          </button>
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
          <p className="text-gray-600">Cargando servicios...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Sparkles size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium mb-2">
            No hay servicios registrados
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Comienza creando tu primer servicio
          </p>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-[#E91E63] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#d81b60] transition-colors"
          >
            <Plus size={18} />
            Crear servicio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const typeConfig = getTypeConfig(service.type);
            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
              >
                {/* Imagen */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border  ${typeConfig.color}`}
                    >
                      {typeConfig.label}
                    </span>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-10">
                    {service.description || "Sin descripción"}
                  </p>

                  {/* Detalles */}
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <span className="font-bold">
                        S/. {Number(service.price).toFixed(2)}
                      </span>
                    </div>
                    {service.durationMin && (
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Clock size={16} className="text-gray-400" />
                        <span>{service.durationMin} min</span>
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEdit(service)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors font-medium text-sm"
                    >
                      <Edit size={16} />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(service)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors font-medium text-sm"
                    >
                      <Trash2 size={16} />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal/Formulario */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-[#E91E63] to-[#C2185B] rounded-xl flex items-center justify-center">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {isEditing ? "Editar servicio" : "Nuevo servicio"}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {isEditing
                      ? "Modifica la información del servicio"
                      : "Completa los datos para crear un servicio"}
                  </p>
                </div>
              </div>
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                onClick={() => setIsFormOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            {/* Contenido del formulario */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3">
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Error al guardar</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre del servicio
                </label>
                <input
                  type="text"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E91E63] transition-colors"
                  placeholder="Ej: Baño medicado"
                  value={form.name}
                  onChange={handleChange("name")}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E91E63] transition-colors min-h-[100px] resize-none"
                  placeholder="Describe el servicio..."
                  value={form.description}
                  onChange={handleChange("description")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipo de servicio
                  </label>
                  <select
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E91E63] transition-colors bg-white"
                    value={form.type}
                    onChange={handleChange("type")}
                  >
                    <option value="GROOMING">✨ Grooming</option>
                    <option value="CONSULTATION">🩺 Consulta</option>
                    <option value="VACCINE">💉 Vacuna</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duración (min)
                  </label>
                  <div className="relative">
                    <Clock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="number"
                      min={0}
                      className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#E91E63] transition-colors"
                      placeholder="30"
                      value={form.durationMin}
                      onChange={handleChange("durationMin")}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Precio (S/.)
                  </label>
                  <div className="relative">
                    <DollarSign
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#E91E63] transition-colors"
                      placeholder="50.00"
                      value={form.price}
                      onChange={handleChange("price")}
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <ImageIcon size={16} className="inline mr-1" />
                  Imagen del servicio{" "}
                  {isEditing && (
                    <span className="text-gray-500 font-normal">
                      (opcional al editar)
                    </span>
                  )}
                  {!isEditing && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl px-4 py-3 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#E91E63] file:text-white hover:file:bg-[#d81b60] file:cursor-pointer cursor-pointer"
                  onChange={handleChange("imageFile")}
                />
              </div>

              {/* Botones del footer */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-3 text-sm rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 text-sm rounded-xl bg-linear-to-r from-[#E91E63] to-[#C2185B] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {isEditing ? "Guardando..." : "Creando..."}
                    </>
                  ) : (
                    <>{isEditing ? "Guardar cambios" : "Crear servicio"}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;