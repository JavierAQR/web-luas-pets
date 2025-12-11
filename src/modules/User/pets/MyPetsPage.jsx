import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PawPrint,
  Plus,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  Calendar,
  Weight,
  Heart,
} from "lucide-react";
import { api } from "../../../services/api";
import toast from "react-hot-toast";

const MyPetsPage = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchMyPets();
  }, []);

  const fetchMyPets = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get("/pets");
      setPets(data);
    } catch (err) {
      const message =
        err?.response?.data?.message || "Error al cargar tus mascotas";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (petId, petName) => {
    if (!window.confirm(`¿Estás seguro de eliminar a ${petName}?`)) return;

    try {
      setDeleting(petId);
      await api.delete(`/pets/${petId}`);
      setPets((prev) => prev.filter((p) => p.id !== petId));
      toast.success("Mascota eliminada correctamente");
    } catch (err) {
      const message =
        err?.response?.data?.message || "No se pudo eliminar la mascota";
      toast.error(message);
    } finally {
      setDeleting(null);
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
      years--;
    }
    return years > 0 ? `${years} año${years > 1 ? "s" : ""}` : "Menos de 1 año";
  };

  const getSexIcon = (sex) => {
    if (sex === "MALE") return "♂️";
    if (sex === "FEMALE") return "♀️";
    return "⚪";
  };

  if (loading) {
    return (
      <div className="bg-gray-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="animate-spin text-[#E91E63] mb-4" size={40} />
            <p className="text-gray-600">Cargando tus mascotas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0D47A1] mb-2">
            Mis Mascotas
          </h1>
          <p className="text-gray-600">
            Gestiona la información de tus compañeros peludos
          </p>
        </div>

        <div className="mb-6">
          <button
            onClick={() => navigate("/pets/new")}
            className="flex items-center gap-2 bg-[#E91E63] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#d81b60] transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <Plus size={20} />
            Registrar Mascota
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

        {/* Pets Grid */}
        {pets.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PawPrint size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium mb-2">
              No tienes mascotas registradas
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Comienza registrando a tu primera mascota
            </p>
            <button
              onClick={() => navigate("/pets/new")}
              className="inline-flex items-center gap-2 bg-[#E91E63] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#d81b60] transition-all"
            >
              <Plus size={20} />
              Registrar Mascota
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => {
              const age = calculateAge(pet.birthDate);
              return (
                <div
                  key={pet.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {pet.imageUrl ? (
                      <img
                        src={pet.imageUrl}
                        alt={pet.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-pink-100 to-purple-100">
                        <PawPrint size={64} className="text-gray-300" />
                      </div>
                    )}
                    {pet.sex && (
                      <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-2xl border border-gray-200">
                        {getSexIcon(pet.sex)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-900 mb-1">
                          {pet.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {pet.species}
                          {pet.breed && ` • ${pet.breed}`}
                        </p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mb-4">
                      {age && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Calendar size={16} className="text-gray-400" />
                          <span>{age}</span>
                        </div>
                      )}
                      {pet.weightKg && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Weight size={16} className="text-gray-400" />
                          <span>{pet.weightKg} kg</span>
                        </div>
                      )}
                      {pet.notes && (
                        <div className="mt-3 p-3 bg-pink-50 rounded-lg border border-pink-100">
                          <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                            <Heart size={12} />
                            Notas
                          </p>
                          <p className="text-sm text-gray-900 line-clamp-2">
                            {pet.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => navigate(`/pets/edit/${pet.id}`)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors font-medium text-sm"
                      >
                        <Edit size={16} />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(pet.id, pet.name)}
                        disabled={deleting === pet.id}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors font-medium text-sm disabled:opacity-50"
                      >
                        {deleting === pet.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPetsPage;