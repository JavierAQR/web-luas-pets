import { useEffect, useState } from "react";
import {
  Loader2,
  AlertCircle,
  Eye,
  Sparkles,
  X,
  Calendar,
  User,
  Package,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { api } from "../../../services/api";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get("/orders");
      setOrders(data);
    } catch (err) {
      setError("Error al cargar las órdenes");
      console.error(err)
    } finally {
      setLoading(false);
    }
  };

  const openDetail = async (orderId) => {
    try {
      setDetailLoading(true);
      const { data } = await api.get(`/orders/${orderId}`);
      setSelectedOrder(data);
    } catch {
      toast.error("No se pudo cargar el detalle de la orden");
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    const map = {
      PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
      COMPLETED: "bg-green-100 text-green-700 border-green-200",
      CANCELLED: "bg-red-100 text-red-700 border-red-200",
    };
    return map[status] ?? "bg-gray-100 text-gray-600 border-gray-200";
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
                Gestión de Órdenes
              </h1>
            </div>
            <p className="text-pink-100">
              Visualiza y administra todas las órdenes registradas
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Loader */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm">
          <Loader2 className="animate-spin text-[#E91E63] mb-4" size={40} />
          <p className="text-gray-600">Cargando órdenes...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Sparkles size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium mb-2">
            No hay órdenes registradas
          </p>
          <p className="text-sm text-gray-500">
            Cuando se generen órdenes aparecerán aquí
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-600">
                <th className="px-6 py-4 font-semibold">Orden</th>
                <th className="px-6 py-4 font-semibold">Cliente</th>
                <th className="px-6 py-4 font-semibold">Fecha</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr
                  key={o.id}
                  className="border-b hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium">{o.orderNumber}</td>
                  <td className="px-6 py-4">
                    {o.user.name} {o.user.lastname}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    S/. {Number(o.total).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1.5 rounded-full border text-xs font-semibold ${getStatusBadge(
                        o.status
                      )}`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openDetail(o.id)}
                      className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors text-xs"
                    >
                      <Eye size={16} /> Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal DETALLE */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-[#E91E63] to-[#C2185B] rounded-xl flex items-center justify-center">
                  <Sparkles size={20} className="text-white" />
                </div>

                <div>
                  <h2 className="text-lg font-bold">Detalle de la orden</h2>
                  <p className="text-xs text-gray-500">
                    #{selectedOrder.orderNumber}
                  </p>
                </div>
              </div>

              <button
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                onClick={() => setSelectedOrder(null)}
              >
                <X size={24} />
              </button>
            </div>

            {detailLoading ? (
              <div className="p-10 flex justify-center">
                <Loader2 className="animate-spin text-[#E91E63]" size={40} />
              </div>
            ) : (
              <div className="p-6 space-y-6">

                {/* Info del cliente */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <User size={18} className="text-gray-500" /> Cliente
                  </h3>
                  <p className="text-gray-700 font-medium">
                    {selectedOrder.user.name} {selectedOrder.user.lastname}
                  </p>
                  <p className="text-gray-600 text-sm">{selectedOrder.user.email}</p>
                </div>

                {/* Info de la orden */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Calendar size={18} className="text-gray-500" /> Información
                    de la orden
                  </h3>
                  <p className="text-gray-700">
                    Fecha:{" "}
                    <span className="font-medium">
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </span>
                  </p>

                  <p className="text-gray-700">
                    Total:{" "}
                    <span className="font-semibold">
                      S/. {selectedOrder.total.toFixed(2)}
                    </span>
                  </p>

                  <p className="text-gray-700">
                    Estado:{" "}
                    <span
                      className={`px-3 py-1.5 rounded-full border text-xs font-semibold ${getStatusBadge(
                        selectedOrder.status
                      )}`}
                    >
                      {selectedOrder.status}
                    </span>
                  </p>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Package size={18} className="text-gray-500" /> Productos
                  </h3>

                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200"
                      >
                        <img
                          src={item.productImage ?? "/placeholder.png"}
                          className="w-16 h-16 object-cover rounded-xl"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {item.productName}
                          </p>
                          <p className="text-gray-600 text-sm">
                            Cantidad: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">
                          S/. {(item.unitPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
