import { useState, useEffect } from "react";
import { Sparkles, Stethoscope, Syringe, Clock, DollarSign, Loader2, AlertCircle } from "lucide-react";
import { api } from "../../services/api";


const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("ALL");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get("/services");
      setServices(data.filter((service) => service.isActive));
    } catch (err) {
      setError("No se pudieron cargar los servicios");
    } finally {
      setLoading(false);
    }
  };

  const getServicesByType = (type) => {
    if (type === "ALL") return services;
    return services.filter((service) => service.type === type);
  };

  const tabs = [
    { id: "ALL", label: "Todos", icon: Sparkles },
    { id: "GROOMING", label: "Grooming", icon: Sparkles },
    { id: "CONSULTATION", label: "Consultas", icon: Stethoscope },
    { id: "VACCINE", label: "Vacunas", icon: Syringe },
  ];

  const displayedServices = getServicesByType(activeTab);

  if (loading) {
    return (
      <section className="py-16 bg-white" id="servicios">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="animate-spin text-[#E91E63] mb-4" size={40} />
            <p className="text-gray-600">Cargando servicios...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white" id="servicios">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 min-h-screen" id="servicios" >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0D47A1] mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ofrecemos una amplia gama de servicios veterinarios especializados para el cuidado integral de tu mascota
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? "bg-[#E91E63] text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-pink-50 border border-gray-200"
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Services Grid */}
        {displayedServices.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No hay servicios disponibles en esta categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/90 backdrop-blur-sm text-[#E91E63] border border-pink-200">
                      {service.type === "GROOMING" && (
                        <>
                          <Sparkles size={14} />
                          Grooming
                        </>
                      )}
                      {service.type === "CONSULTATION" && (
                        <>
                          <Stethoscope size={14} />
                          Consulta
                        </>
                      )}
                      {service.type === "VACCINE" && (
                        <>
                          <Syringe size={14} />
                          Vacuna
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-10]">
                    {service.description || "Servicio especializado para tu mascota"}
                  </p>

                  {/* Details */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm">
                      {service.durationMin && (
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Clock size={16} className="text-gray-400" />
                          <span>{service.durationMin} min</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <DollarSign size={18} className="text-[#E91E63]" />
                        <span className="font-bold text-gray-900">
                          S/. {Number(service.price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;