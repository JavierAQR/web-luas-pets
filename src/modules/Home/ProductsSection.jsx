import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, DollarSign, ShoppingCart, Loader2, AlertCircle } from "lucide-react";
import { api } from "../../services/api";
import toast from "react-hot-toast";
import { useAuthStore } from "../../stores/authStore";


const ProductsSection = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [addingToCart, setAddingToCart] = useState(null);

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get("/products");
      setProducts(data);
    } catch (err) {
      setError("No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/productos" } });
      return;
    }

    try {
      setAddingToCart(productId);
      await api.post("/carts/items", { productId, quantity: 1 });
      toast.success("Producto agregado al carrito");
    } catch (err) {
      const message = err?.response?.data?.message || "No se pudo agregar al carrito";
      toast.error(message);
    } finally {
      setAddingToCart(null);
    }
  };

  const categories = [
    { id: "ALL", label: "Todos" },
    { id: "FOOD", label: "Alimentos", icon: "🍖" },
    { id: "ACCESSORY", label: "Accesorios", icon: "🎒" },
    { id: "TOY", label: "Juguetes", icon: "🎾" },
  ];

  const filteredProducts =
    activeCategory === "ALL"
      ? products
      : products.filter((p) => p.category === activeCategory);

  if (loading) {
    return (
      <section className="py-16 bg-white" id="productos">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="animate-spin text-[#E91E63] mb-4" size={40} />
            <p className="text-gray-600">Cargando productos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white" id="productos">
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
    <section className="py-16 bg-gray-50" id="productos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0D47A1] mb-4">
            Nuestra Tienda
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Encuentra todo lo que tu mascota necesita en nuestra tienda especializada
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? "bg-[#0D47A1] text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-blue-50 border border-gray-200"
                }`}
              >
                {cat.icon && <span>{cat.icon}</span>}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No hay productos disponibles en esta categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isLowStock = product.stock < 10;
              const isOutOfStock = product.stock === 0;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/90 backdrop-blur-sm text-[#0D47A1] border border-blue-200">
                        {product.category === "FOOD" && "🍖 Alimento"}
                        {product.category === "ACCESSORY" && "🎒 Accesorio"}
                        {product.category === "TOY" && "🎾 Juguete"}
                      </span>
                    </div>
                    {isLowStock && !isOutOfStock && (
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex px-3 py-1.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
                          ⚠️ Pocas unidades
                        </span>
                      </div>
                    )}
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg">
                          Agotado
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-10">
                      {product.description || "Producto de calidad para tu mascota"}
                    </p>

                    {/* Price & Stock */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1.5">
                        <DollarSign size={20} className="text-[#0D47A1]" />
                        <span className="font-bold text-xl text-gray-900">
                          S/. {Number(product.price).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Package size={16} />
                        <span>{product.stock} unid.</span>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      hidden={isAdmin}
                      disabled={isOutOfStock || addingToCart === product.id}
                      className="w-full flex items-center justify-center gap-2 bg-[#0D47A1] text-white px-4 py-3 rounded-xl font-semibold hover:bg-[#0d3a7a] transition-all shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addingToCart === product.id ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Agregando...
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={18} />
                          {isOutOfStock ? "Agotado" : "Agregar al carrito"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;