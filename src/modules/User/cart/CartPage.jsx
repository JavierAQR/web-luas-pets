import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Loader2,
  AlertCircle,
  ChevronLeft,
  Package,
} from "lucide-react";
import { api } from "../../../services/api";
import toast from "react-hot-toast";

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get("/carts");
      setCart(data);
    } catch (err) {
      const message = err?.response?.data?.message || "Error al cargar el carrito";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setUpdating(itemId);
      const { data } = await api.put(`/carts/items/${itemId}`, {
        quantity: newQuantity,
      });
      setCart(data);
    } catch (err) {
      const message = err?.response?.data?.message || "No se pudo actualizar la cantidad";
      toast.error(message);
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId) => {
    if (!window.confirm("¿Eliminar este producto del carrito?")) return;

    try {
      setUpdating(itemId);
      const { data } = await api.delete(`/carts/items/${itemId}`);
      setCart(data);
      toast.success("Producto eliminado del carrito");
    } catch (err) {
      const message = err?.response?.data?.message || "No se pudo eliminar el producto";
      toast.error(message);
    } finally {
      setUpdating(null);
    }
  };

  const clearCart = async () => {
    if (!window.confirm("¿Vaciar todo el carrito?")) return;

    try {
      const { data } = await api.delete("/carts");
      setCart(data);
      toast.success("Carrito vaciado");
    } catch (err) {
      const message = err?.response?.data?.message || "No se pudo vaciar el carrito";
      toast.error(message);
    }
  };

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((sum, item) => {
      return sum + Number(item.unitPrice) * item.quantity;
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="animate-spin text-[#0D47A1] mb-4" size={40} />
            <p className="text-gray-600">Cargando carrito...</p>
          </div>
        </div>
      </div>
    );
  }

  const total = calculateTotal();
  const itemsCount = cart?.items?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-[#0D47A1] transition-colors mb-6"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Seguir comprando</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0D47A1] mb-2">
            Carrito de Compras
          </h1>
          <p className="text-gray-600">
            {itemsCount === 0
              ? "Tu carrito está vacío"
              : `Tienes ${itemsCount} ${itemsCount === 1 ? "producto" : "productos"} en tu carrito`}
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

        {/* Empty Cart */}
        {itemsCount === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium mb-2">Tu carrito está vacío</p>
            <p className="text-sm text-gray-500 mb-6">
              Explora nuestra tienda y agrega productos a tu carrito
            </p>
            <button
              onClick={() => navigate("/productos")}
              className="inline-flex items-center gap-2 bg-[#0D47A1] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#0d3a7a] transition-all"
            >
              <Package size={20} />
              Ver Productos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Productos</h2>
                {itemsCount > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Vaciar carrito
                  </button>
                )}
              </div>

              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 mb-1 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {item.product.category === "FOOD" && "🍖 Alimento"}
                        {item.product.category === "ACCESSORY" && "🎒 Accesorio"}
                        {item.product.category === "TOY" && "🎾 Juguete"}
                      </p>

                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-gray-900">
                          S/. {Number(item.unitPrice).toFixed(2)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || updating === item.id}
                            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="w-12 text-center font-semibold">
                            {updating === item.id ? (
                              <Loader2 size={16} className="animate-spin mx-auto" />
                            ) : (
                              item.quantity
                            )}
                          </span>

                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={
                              item.quantity >= item.product.stock || updating === item.id
                            }
                            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus size={16} />
                          </button>

                          <button
                            onClick={() => removeItem(item.id)}
                            disabled={updating === item.id}
                            className="ml-2 w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 mt-2">
                        Stock disponible: {item.product.stock} unidades
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Resumen del pedido
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">S/. {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Envío</span>
                    <span className="font-medium text-green-600">Gratis</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-xl text-gray-900">
                      S/. {total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-[#0D47A1] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0d3a7a] transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  Proceder al pago
                </button>

                <button
                  onClick={() => navigate("/#productos")}
                  className="w-full mt-3 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all"
                >
                  Seguir comprando
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;