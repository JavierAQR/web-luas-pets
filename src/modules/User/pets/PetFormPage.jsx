import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  PawPrint,
  Calendar,
  Weight,
  Heart,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";
import { api } from "../../../services/api";
import toast from "react-hot-toast";


const PetFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    sex: "",
    birthDate: "",
    weightKg: "",
    notes: "",
    imageFile: null,
  });

  useEffect(() => {
    if (isEditing) {
      fetchPet();
    }
  }, [id]);

  const fetchPet = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/pets/${id}`);
      setFormData({
        name: data.name || "",
        species: data.species || "",
        breed: data.breed || "",
        sex: data.sex || "",
        birthDate: data.birthDate ? data.birthDate.split("T")[0] : "",
        weightKg: data.weightKg ? String(data.weightKg) : "",
        notes: data.notes || "",
        imageFile: null,
      });
      if (data.imageUrl) {
        setImagePreview(data.imageUrl);
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || "Error al cargar la mascota";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    if (field === "imageFile") {
      const file = e.target.files?.[0];
      if (file) {
        setFormData((prev) => ({ ...prev, imageFile: file }));
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.species) {
      toast.error("Nombre y especie son obligatorios");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const data = new FormData();
      data.append("name", formData.name);
      data.append("species", formData.species);
      if (formData.breed) data.append("breed", formData.breed);
      if (formData.sex) data.append("sex", formData.sex);
      if (formData.birthDate) data.append("birthDate", formData.birthDate);
      if (formData.weightKg) data.append("weightKg", formData.weightKg);
      if (formData.notes) data.append("notes", formData.notes);
      if (formData.imageFile) data.append("image", formData.imageFile);

      if (isEditing) {
        await api.put(`/pets/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Mascota actualizada correctamente");
      } else {
        await api.post("/pets", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Mascota registrada correctamente");
      }

      navigate("/my-pets");
    } catch (err) {
      const message =
        err?.response?.data?.message || "No se pudo guardar la mascota";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="animate-spin text-[#E91E63] mb-4" size={40} />
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => navigate("/my-pets")}
          className="flex items-center gap-2 text-gray-600 hover:text-[#E91E63] transition-colors mb-6"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Volver a mis mascotas</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0D47A1] mb-2">
            {isEditing ? "Editar Mascota" : "Registrar Nueva Mascota"}
          </h1>
          <p className="text-gray-600">
            {isEditing
              ? "Actualiza la información de tu mascota"
              : "Completa los datos de tu mascota"}
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

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6"
        >
          {/* Image Upload */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <ImageIcon size={18} className="text-[#E91E63]" />
              Foto de tu mascota
              <span className="text-gray-500 font-normal">(opcional)</span>
            </label>

            <div className="flex flex-col items-center gap-4">
              {imagePreview && (
                <div className="w-40 h-40 rounded-xl overflow-hidden border-2 border-gray-200">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleChange("imageFile")}
                className="w-full border-2 border-dashed border-gray-300 rounded-xl px-4 py-3 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#E91E63] file:text-white hover:file:bg-[#d81b60] file:cursor-pointer cursor-pointer"
              />
            </div>
          </div>

          {/* Name & Species */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <PawPrint size={18} className="text-[#E91E63]" />
                Nombre
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleChange("name")}
                placeholder="Ej: Max"
                required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E91E63] transition-colors"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                Especie
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.species}
                onChange={handleChange("species")}
                placeholder="Ej: Perro, Gato"
                required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E91E63] transition-colors"
              />
            </div>
          </div>

          {/* Breed & Sex */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Raza
                <span className="text-gray-500 font-normal ml-1">(opcional)</span>
              </label>
              <input
                type="text"
                value={formData.breed}
                onChange={handleChange("breed")}
                placeholder="Ej: Labrador"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E91E63] transition-colors"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Sexo
                <span className="text-gray-500 font-normal ml-1">(opcional)</span>
              </label>
              <select
                value={formData.sex}
                onChange={handleChange("sex")}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E91E63] transition-colors bg-white"
              >
                <option value="">Selecciona</option>
                <option value="MALE">Macho ♂️</option>
                <option value="FEMALE">Hembra ♀️</option>
                <option value="OTHER">Otro</option>
              </select>
            </div>
          </div>

          {/* Birth Date & Weight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar size={18} className="text-[#E91E63]" />
                Fecha de nacimiento
                <span className="text-gray-500 font-normal">(opcional)</span>
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={handleChange("birthDate")}
                max={new Date().toISOString().split("T")[0]}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E91E63] transition-colors"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Weight size={18} className="text-[#E91E63]" />
                Peso (kg)
                <span className="text-gray-500 font-normal">(opcional)</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.weightKg}
                onChange={handleChange("weightKg")}
                placeholder="Ej: 15.5"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E91E63] transition-colors"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Heart size={18} className="text-[#E91E63]" />
              Notas adicionales
              <span className="text-gray-500 font-normal">(opcional)</span>
            </label>
            <textarea
              value={formData.notes}
              onChange={handleChange("notes")}
              placeholder="Alergias, comportamiento, cuidados especiales..."
              rows={4}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E91E63] transition-colors resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate("/my-pets")}
              className="px-6 py-3 text-sm rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 sm:flex-none px-6 py-3 text-sm rounded-xl bg-[#E91E63] text-white font-semibold hover:bg-[#d81b60] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {isEditing ? "Guardando..." : "Registrando..."}
                </>
              ) : (
                <>
                  <PawPrint size={18} />
                  {isEditing ? "Guardar Cambios" : "Registrar Mascota"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PetFormPage;