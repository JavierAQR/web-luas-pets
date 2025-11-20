import { useEffect, useState, type FormEvent } from "react";
import { api } from "../../../services/api";
import toast from "react-hot-toast";

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
    } catch (err: any) {
      const message = err?.response?.data?.message || "Error al cargar servicios";
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
      toast.success("Servicio eliminado correctamente.")
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "No se pudo eliminar el servicio";
      alert(message);
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
      toast.success("Servicio creado/actualizado correctamente.")
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "No se pudo guardar el servicio";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange =
    (field: keyof ServiceFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      if (field === "imageFile" && e.target instanceof HTMLInputElement) {
        const file = e.target.files?.[0] ?? null;
        setForm((prev) => ({ ...prev, imageFile: file }));
      } else {
        const value = e.target.value;
        setForm((prev) => ({ ...prev, [field]: value }));
      }
    };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0D47A1]">
            Gestión de Servicios
          </h1>
          <p className="text-sm text-gray-600">
            Crea, edita y elimina los servicios de la clínica.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-[#E91E63] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#d81b60] transition-colors"
        >
          + Nuevo servicio
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-2 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-600">Cargando servicios...</p>
      ) : services.length === 0 ? (
        <p className="text-sm text-gray-600">
          Aún no hay servicios registrados. Crea el primero.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Imagen
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Precio
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Duración
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-t">
                  <td className="px-4 py-3">
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="h-12 w-12 rounded-md object-cover border"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {service.name}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-2">
                      {service.description}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700">
                      {service.type === "GROOMING" && "Grooming"}
                      {service.type === "CONSULTATION" && "Consulta"}
                      {service.type === "VACCINE" && "Vacuna"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    S/. {Number(service.price).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    {service.durationMin ? `${service.durationMin} min` : "-"}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(service)}
                      className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(service)}
                      className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-700 hover:bg-red-100"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal/Formulario */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setIsFormOpen(false)}
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-[#0D47A1] mb-4">
              {isEditing ? "Editar servicio" : "Nuevo servicio"}
            </h2>

            {error && (
              <div className="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-2 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E91E63]"
                  value={form.name}
                  onChange={handleChange("name")}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E91E63] min-h-[70px]"
                  value={form.description}
                  onChange={handleChange("description")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E91E63]"
                    value={form.type}
                    onChange={handleChange("type")}
                  >
                    <option value="GROOMING">Grooming</option>
                    <option value="CONSULTATION">Consulta</option>
                    <option value="VACCINE">Vacuna</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duración (min)
                  </label>
                  <input
                    type="number"
                    min={0}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E91E63]"
                    value={form.durationMin}
                    onChange={handleChange("durationMin")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio (S/.)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E91E63]"
                    value={form.price}
                    onChange={handleChange("price")}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagen {isEditing ? "(opcional al editar)" : "(requerida)"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-sm"
                  onChange={handleChange("imageFile")}
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-sm rounded-lg bg-[#E91E63] text-white font-semibold hover:bg-[#d81b60] disabled:opacity-60"
                >
                  {saving
                    ? isEditing
                      ? "Guardando..."
                      : "Creando..."
                    : isEditing
                    ? "Guardar cambios"
                    : "Crear servicio"}
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
