import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Package,
  Eye,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { api } from "../../../services/api";


const MyOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get("/orders/me");
      setOrders(data);
    } catch (err) {
      const message = err?.response?.data?.message || "Error al cargar tus órdenes";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: {
        label: "Pendiente",
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
        icon: Clock,
      },
      COMPLETED: {
        label: "Completada",
        color: "bg-green-100 text-green-700 border-green-200",
        icon: CheckCircle,
      },
      CANCELLED: {
        label: "Cancelada",
        color: "bg-red-100 text-red-700 border-red-200",
        icon: XCircle,
      },
    };
    return configs[status] || configs.PENDING;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("es-PE", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="animate-spin text-[#0D47A1] mb-4" size={40} />
            <p className="text-gray-600">Cargando tus órdenes...</p>
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
            Mis Órdenes
          </h1>
          <p className="text-gray-600">Historial de todas tus compras</p>
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

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium mb-2">No tienes órdenes</p>
            <p className="text-sm text-gray-500 mb-6">
              Cuando realices compras, aparecerán aquí
            </p>
            <button
              onClick={() => navigate("/#productos")}
              className="inline-flex items-center gap-2 bg-[#0D47A1] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#0d3a7a] transition-all"
            >
              <Package size={20} />
              Ver Productos
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 p-6"
                >
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Orden #{order.orderNumber}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${statusConfig.color}`}
                      >
                        <StatusIcon size={14} />
                        {statusConfig.label}
                      </span>
                      <p className="font-bold text-lg text-gray-900">
                        S/. {Number(order.total).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <img
                          key={idx}
                          src={item.productImage}
                          alt={item.productName}
                          className="w-12 h-12 rounded-lg object-cover border-2 border-white"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      {order.items.length} {order.items.length === 1 ? "producto" : "productos"}
                    </p>
                  </div>

                  {/* Shipping Info Preview */}
                  <div className="text-sm text-gray-600 mb-4">
                    <p>
                      <span className="font-medium">Enviar a:</span>{" "}
                      {order.shippingName}
                    </p>
                    <p>{order.shippingAddress}, {order.shippingCity}</p>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="w-full flex items-center justify-center gap-2 bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-100 transition-colors text-sm"
                  >
                    <Eye size={16} />
                    Ver detalles
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Detail Modal */}
        {isDetailOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Orden #{selectedOrder.orderNumber}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {formatDate(selectedOrder.createdAt)}
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
                {/* Status */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-600 mb-2">Estado</p>
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border ${
                      getStatusConfig(selectedOrder.status).color
                    }`}
                  >
                    {(() => {
                      const StatusIcon = getStatusConfig(selectedOrder.status).icon;
                      return <StatusIcon size={18} />;
                    })()}
                    {getStatusConfig(selectedOrder.status).label}
                  </span>
                </div>

                {/* Products */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Productos</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                      >
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 mb-1">
                            {item.productName}
                          </p>
                          <p className="text-sm text-gray-600">
                            Cantidad: {item.quantity}
                          </p>
                          <p className="text-sm font-bold text-gray-900">
                            S/. {Number(item.unitPrice).toFixed(2)} c/u
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-900">
                            S/. {(Number(item.unitPrice) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Información de Envío
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Nombre:</span>{" "}
                      {selectedOrder.shippingName}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedOrder.shippingEmail}
                    </p>
                    <p>
                      <span className="font-medium">Teléfono:</span>{" "}
                      {selectedOrder.shippingPhone}
                    </p>
                    <p>
                      <span className="font-medium">Dirección:</span>{" "}
                      {selectedOrder.shippingAddress}
                    </p>
                    <p>
                      <span className="font-medium">Ciudad:</span>{" "}
                      {selectedOrder.shippingCity}
                    </p>
                    {selectedOrder.shippingNotes && (
                      <p>
                        <span className="font-medium">Notas:</span>{" "}
                        {selectedOrder.shippingNotes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total Pagado</span>
                    <span className="font-bold text-2xl text-gray-900">
                      S/. {Number(selectedOrder.total).toFixed(2)}
                    </span>
                  </div>
                  {selectedOrder.paypalOrderId && (
                    <p className="text-xs text-gray-500 mt-2">
                      PayPal ID: {selectedOrder.paypalOrderId}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;