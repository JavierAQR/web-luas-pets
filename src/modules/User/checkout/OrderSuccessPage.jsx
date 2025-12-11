import { CheckCircle, Package, Home, ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderSuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const orderDetails = location.state?.orderDetails;
  
    useEffect(() => {
      if (!orderDetails) {
        navigate("/");
      }
    }, [orderDetails, navigate]);
  
    if (!orderDetails) {
      return null;
    }
  
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} className="text-green-600" />
            </div>
  
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¡Pago Exitoso!
            </h1>
            <p className="text-gray-600 mb-8">
              Tu orden ha sido procesada correctamente
            </p>
  
            {/* Order Details */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package size={20} className="text-[#0D47A1]" />
                Detalles del Pedido
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID de Transacción:</span>
                  <span className="font-mono font-medium">{orderDetails.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className="font-medium text-green-600">
                    {orderDetails.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monto Total:</span>
                  <span className="font-bold text-lg">
                    ${orderDetails.purchase_units[0].amount.value} USD
                  </span>
                </div>
              </div>
            </div>
  
            {/* Info Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
              <p className="text-sm text-blue-800">
                📧 Hemos enviado un correo de confirmación a tu email con todos los detalles de tu pedido.
              </p>
            </div>
  
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate("/my-orders")}
                className="flex items-center justify-center gap-2 bg-[#0D47A1] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0d3a7a] transition-all shadow-md hover:shadow-lg"
              >
                <ShoppingBag size={20} />
                Ver mis órdenes
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all"
              >
                <Home size={20} />
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default OrderSuccessPage;