import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  User,
  Mail,
  Phone,
  Loader2,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../../services/api";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const paypalRef = useRef();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const backendOrderId = useRef(null);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });

  useEffect(() => {
    fetchCart();
    loadPayPalScript();
  }, []);

  const loadPayPalScript = () => {
    // Reemplaza con tu Client ID de PayPal
    const PAYPAL_CLIENT_ID = "AZI4NjEvyLgQYTTZ1s_EmTmo-HAp4DtKaVnzc7h8Ea30gAmLH4aNs35yJYtYmJIH_CBjh3O9d2oBQCy-";
    
    if (window.paypal) {
      setPaypalLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
    script.addEventListener("load", () => setPaypalLoaded(true));
    script.addEventListener("error", () => {
      toast.error("Error al cargar PayPal");
    });
    document.body.appendChild(script);
  };

  useEffect(() => {
    if (paypalLoaded && cart && cart.items?.length > 0 && shippingInfo.fullName) {
      renderPayPalButton();
    }
  }, [paypalLoaded, cart, shippingInfo]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get("/carts");
      
      if (!data.items || data.items.length === 0) {
        navigate("/cart");
        return;
      }
      
      setCart(data);
    } catch (err) {
      const message = err?.response?.data?.message || "Error al cargar el carrito";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setShippingInfo((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((sum, item) => {
      return sum + Number(item.unitPrice) * item.quantity;
    }, 0);
  };

  const validateForm = () => {
    if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city) {
      toast.error("Por favor completa todos los campos obligatorios");
      return false;
    }
    return true;
  };

  const createOrder = async () => {
    if (!validateForm()) {
      throw new Error("Formulario incompleto");
    }

    try {
      const { data } = await api.post("/orders", shippingInfo);
      backendOrderId.current = data.id;
      return data.id; // Retorna el ID de la orden creada
    } catch (err) {
      const message = err?.response?.data?.message || "Error al crear la orden";
      toast.error(message);
      throw err;
    }
  };

  const renderPayPalButton = () => {
    if (!paypalRef.current) return;
    
    // Limpiar botones previos
    paypalRef.current.innerHTML = "";

    const total = calculateTotal();

    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'pay'
      },
      
      createOrder: async (data, actions) => {
        try {
          setProcessing(true);
          
          // Crear orden en tu backend
          const orderId = await createOrder();
          
          // Crear orden en PayPal
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: total.toFixed(2),
                currency_code: 'USD'
              },
              description: `Orden #${orderId.slice(0, 8)}`
            }]
          });
        } catch (err) {
          setProcessing(false);
          throw err;
        }
      },
      
      onApprove: async (data, actions) => {
        try {
          // Capturar el pago
          const details = await actions.order.capture();
          
          await api.patch(`/orders/${backendOrderId.current}/complete`, { 
            paypalOrderId: details.id 
          });
          
          setProcessing(false);
          toast.success("¡Pago completado exitosamente!");
          
          // Redirigir a página de éxito
          navigate("/order-success", { 
            state: { 
              orderDetails: details 
            } 
          });
        } catch (err) {
          setProcessing(false);
          toast.error("Error al procesar el pago");
        }
      },
      
      onError: (err) => {
        setProcessing(false);
        console.error("Error de PayPal:", err);
        toast.error("Error al procesar el pago");
      },
      
      onCancel: () => {
        setProcessing(false);
        toast.info("Pago cancelado");
      }
    }).render(paypalRef.current);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="animate-spin text-[#0D47A1] mb-4" size={40} />
            <p className="text-gray-600">Cargando checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  const total = calculateTotal();
  const isFormValid = shippingInfo.fullName && shippingInfo.email && shippingInfo.phone && shippingInfo.address && shippingInfo.city;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-gray-600 hover:text-[#0D47A1] transition-colors mb-6"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Volver al carrito</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0D47A1] mb-2">
            Finalizar Compra
          </h1>
          <p className="text-gray-600">Completa tu información para proceder con el pago</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Shipping Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User size={20} className="text-[#0D47A1]" />
                Información de Contacto
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre completo
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.fullName}
                    onChange={handleChange("fullName")}
                    required
                    placeholder="Juan Pérez"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D47A1] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <Mail size={16} className="text-[#0D47A1]" />
                      Email
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={shippingInfo.email}
                      onChange={handleChange("email")}
                      required
                      placeholder="correo@ejemplo.com"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D47A1] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <Phone size={16} className="text-[#0D47A1]" />
                      Teléfono
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={handleChange("phone")}
                      required
                      placeholder="999 999 999"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D47A1] transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-[#0D47A1]" />
                Dirección de Envío
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Dirección
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.address}
                    onChange={handleChange("address")}
                    required
                    placeholder="Av. Principal 123"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D47A1] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ciudad
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.city}
                      onChange={handleChange("city")}
                      required
                      placeholder="Lima"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D47A1] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Código Postal
                      <span className="text-gray-500 font-normal ml-1">(opcional)</span>
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.postalCode}
                      onChange={handleChange("postalCode")}
                      placeholder="15001"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D47A1] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notas adicionales
                    <span className="text-gray-500 font-normal ml-1">(opcional)</span>
                  </label>
                  <textarea
                    value={shippingInfo.notes}
                    onChange={handleChange("notes")}
                    rows={3}
                    placeholder="Indicaciones de entrega, referencias, etc."
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D47A1] transition-colors resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Resumen del Pedido
              </h2>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {cart?.items.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        Cantidad: {item.quantity}
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        S/. {(Number(item.unitPrice) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t">
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

              {/* PayPal Button */}
              {!isFormValid && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <p className="text-sm text-yellow-800 font-medium">
                    ⚠️ Completa todos los campos obligatorios para continuar
                  </p>
                </div>
              )}

              {isFormValid && (
                <div>
                  {!paypalLoaded ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="animate-spin text-[#0D47A1]" size={32} />
                    </div>
                  ) : (
                    <div ref={paypalRef} className={processing ? "opacity-50 pointer-events-none" : ""} />
                  )}
                  
                  {processing && (
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <Loader2 className="animate-spin text-[#0D47A1]" size={20} />
                      <span className="text-sm text-gray-600">Procesando pago...</span>
                    </div>
                  )}
                </div>
              )}

              <p className="text-xs text-gray-500 text-center">
                🔒 Pago 100% seguro con PayPal
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;