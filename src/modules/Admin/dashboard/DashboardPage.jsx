import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  PawPrint,
  Sparkles,
  Package,
  Calendar,
  Clock,
  TrendingUp,
  AlertTriangle,
  Loader2,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  XCircle,
  UserPlus,
  Mail,
  Phone,
} from "lucide-react";
import { api } from "../../../services/api";
import toast from "react-hot-toast";

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: dashboardData } = await api.get("/admin/dashboard");
      setData(dashboardData);
    } catch (err) {
      const message = err?.response?.data?.message || "Error al cargar el dashboard";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: {
        label: "Pendiente",
        color: "text-yellow-700",
        bgColor: "bg-yellow-100",
        icon: Clock,
      },
      CONFIRMED: {
        label: "Confirmada",
        color: "text-blue-700",
        bgColor: "bg-blue-100",
        icon: CheckCircle,
      },
      CANCELLED: {
        label: "Cancelada",
        color: "text-red-700",
        bgColor: "bg-red-100",
        icon: XCircle,
      },
      COMPLETED: {
        label: "Completada",
        color: "text-green-700",
        bgColor: "bg-green-100",
        icon: CheckCircle,
      },
    };
    return configs[status];
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("es-PE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="animate-spin text-[#E91E63] mb-4" size={48} />
        <p className="text-gray-600">Cargando dashboard...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3">
        <AlertCircle size={20} className="shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const statCards = [
    {
      title: "Usuarios Totales",
      value: data.cards.totalUsers,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Mascotas Registradas",
      value: data.cards.totalPets,
      icon: PawPrint,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Servicios Activos",
      value: data.cards.totalActiveServices,
      icon: Sparkles,
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      textColor: "text-pink-600",
    },
    {
      title: "Productos Activos",
      value: data.cards.totalActiveProducts,
      icon: Package,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
    },
    {
      title: "Total Citas",
      value: data.cards.totalAppointments,
      icon: Calendar,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Citas Hoy",
      value: data.cards.appointmentsToday,
      icon: Clock,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
  ];

  const appointmentStats = [
    {
      label: "Pendientes",
      value: data.appointmentsByStatus.PENDING,
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    {
      label: "Confirmadas",
      value: data.appointmentsByStatus.CONFIRMED,
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    {
      label: "Completadas",
      value: data.appointmentsByStatus.COMPLETED,
      color: "bg-green-100 text-green-700 border-green-200",
    },
    {
      label: "Canceladas",
      value: data.appointmentsByStatus.CANCELLED,
      color: "bg-red-100 text-red-700 border-red-200",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-[#E91E63] to-[#C2185B] rounded-2xl shadow-lg p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <LayoutDashboard size={24} />
              <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
            </div>
            <p className="text-pink-100">
              Resumen general de tu clínica veterinaria
            </p>
          </div>
          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-white text-[#E91E63] px-5 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-60"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {card.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center`}
                >
                  <Icon size={24} className={card.textColor} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Citas por Estado */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-[#E91E63]" />
          <h2 className="text-lg font-bold text-gray-900">
            Estadísticas de Citas
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {appointmentStats.map((stat, index) => (
            <div
              key={index}
              className={`rounded-xl border p-4 text-center ${stat.color}`}
            >
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-xs font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas Citas */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={20} className="text-[#E91E63]" />
            <h2 className="text-lg font-bold text-gray-900">Próximas Citas</h2>
          </div>

          {data.upcomingAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No hay citas próximas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.upcomingAppointments.map((appointment) => {
                const statusConfig = getStatusConfig(appointment.status);
                const StatusIcon = statusConfig.icon;
                return (
                  <div
                    key={appointment.id}
                    className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">
                          {appointment.service.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {appointment.user.name} {appointment.user.lastname}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${statusConfig.bgColor} ${statusConfig.color}`}
                      >
                        <StatusIcon size={12} />
                        {statusConfig.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{formatDate(appointment.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{appointment.startTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <PawPrint size={12} />
                        <span>{appointment.pet.name}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Productos con Poco Stock */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={20} className="text-orange-600" />
            <h2 className="text-lg font-bold text-gray-900">Stock Bajo</h2>
          </div>

          {data.lowStockProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Todos los productos tienen stock</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="border border-orange-100 bg-orange-50/30 rounded-xl p-4 hover:bg-orange-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                          {product.category === "ACCESSORY" && "Accesorio"}
                          {product.category === "FOOD" && "Alimento"}
                          {product.category === "TOY" && "Juguete"}
                        </span>
                        <span className="text-xs font-semibold text-gray-900">
                          S/. {Number(product.price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Stock</p>
                      <p
                        className={`text-lg font-bold ${
                          product.stock === 0
                            ? "text-red-600"
                            : product.stock <= 2
                            ? "text-orange-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {product.stock}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Usuarios Recientes */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus size={20} className="text-[#E91E63]" />
          <h2 className="text-lg font-bold text-gray-900">
            Usuarios Registrados Recientemente
          </h2>
        </div>

        {data.recentUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No hay usuarios registrados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">
                    Usuario
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">
                    Contacto
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">
                    Rol
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">
                    Registro
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.recentUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#E91E63] to-[#C2185B] flex items-center justify-center text-white font-bold text-sm">
                          {user.name[0]}
                          {user.lastname[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {user.name} {user.lastname}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Mail size={12} />
                          <span>{user.email}</span>
                        </div>
                        {user.phoneNumber && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Phone size={12} />
                            <span>{user.phoneNumber}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${
                          user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-600">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;