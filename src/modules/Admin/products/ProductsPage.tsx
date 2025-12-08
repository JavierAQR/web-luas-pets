import { useEffect, useState, type FormEvent } from "react";
import { api } from "../../../services/api";
import toast from "react-hot-toast";
import { AlertCircle, DollarSign, Edit, ImageIcon, Loader2, Package, Plus, ShoppingBag, Trash2, X } from "lucide-react";
type ProductCategory = "ACCESSORY" | "FOOD" | "TOY";

export interface AdminProduct {
  id: string;
  name: string;
  description?: string | null;
  category: ProductCategory;
  price: number;
  stock: number;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
}

interface ProductFormState {
  id?: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: string;
  stock: string;
  imageFile: File | null;
  isActive: boolean;
}

const initialForm: ProductFormState = {
  name: "",
  description: "",
  category: "ACCESSORY",
  price: "",
  stock: "",
  imageFile: null,
  isActive: true,
};

const ProductsPage = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<ProductFormState>(initialForm);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get<AdminProduct[]>("/products");
      setProducts(data);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Error al cargar productos";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenCreate = () => {
    setForm(initialForm);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product: AdminProduct) => {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description ?? "",
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      imageFile: null,
      isActive: product.isActive,
    });
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleDelete = async (product: AdminProduct) => {
    if (!window.confirm(`¿Eliminar el producto "${product.name}"?`)) return;
    try {
      await api.delete(`/products/${product.id}`);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      toast.success("Producto eliminado correctamente.");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "No se pudo eliminar el producto";
      toast.error(message);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("category", form.category);
      if (form.price) formData.append("price", form.price);
      if (form.stock) formData.append("stock", form.stock);
      formData.append("isActive", String(form.isActive));

      if (!isEditing && !form.imageFile) {
        throw new Error("La imagen es obligatoria para crear un producto");
      }
      if (form.imageFile) {
        formData.append("image", form.imageFile);
      }

      let response;

      if (isEditing && form.id) {
        response = await api.put<AdminProduct>(
          `/products/${form.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await api.post<AdminProduct>("/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      const saved = response.data;

      setProducts((prev) => {
        if (isEditing) {
          return prev.map((p) => (p.id === saved.id ? saved : p));
        }
        return [saved, ...prev];
      });

      setIsFormOpen(false);
      setForm(initialForm);
      setIsEditing(false);
      toast.success(
        isEditing
          ? "Producto actualizado correctamente."
          : "Producto creado correctamente."
      );
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error)?.message ||
        "No se pudo guardar el producto";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange =
    (field: keyof ProductFormState) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLSelectElement>
        | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      if (field === "imageFile" && e.target instanceof HTMLInputElement) {
        const file = e.target.files?.[0] ?? null;
        setForm((prev) => ({ ...prev, imageFile: file }));
      } else if (field === "isActive" && e.target instanceof HTMLInputElement) {
        const checked = e.target.checked;
        setForm((prev) => ({ ...prev, isActive: checked }));
      } else {
        const value = e.target.value;
        setForm((prev) => ({ ...prev, [field]: value }));
      }
    };

  const getCategoryConfig = (category: AdminProduct["category"]) => {
    const configs = {
      ACCESSORY: {
        label: "Accesorio",
        color: "bg-blue-100 text-blue-700 border-blue-200",
      },
      FOOD: {
        label: "Alimento",
        color: "bg-orange-100 text-orange-700 border-orange-200",
      },
      TOY: {
        label: "Juguete",
        color: "bg-pink-100 text-pink-700 border-pink-200",
      },
    };
    return configs[category];
  };

  return (
    <div className="space-y-6">
      {/* Header con gradiente */}
      <div className="bg-linear-to-r from-[#0D47A1] to-[#1565C0] rounded-2xl shadow-lg p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShoppingBag size={24} />
              <h1 className="text-2xl md:text-3xl font-bold">
                Gestión de Productos
              </h1>
            </div>
            <p className="text-blue-100">
              Administra el catálogo de la clínica veterinaria
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 bg-white text-[#0D47A1] px-5 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <Plus size={20} />
            <span>Nuevo producto</span>
          </button>
        </div>
      </div>

      {/* Error global */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm">
          <Loader2 className="animate-spin text-[#0D47A1] mb-4" size={40} />
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Package size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium mb-2">
            No hay productos registrados
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Comienza agregando tu primer producto al catálogo
          </p>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-[#0D47A1] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#0d3a7a] transition-colors"
          >
            <Plus size={18} />
            Crear producto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const categoryConfig = getCategoryConfig(product.category);
            const isLowStock = product.stock < 10;
            
            return (
              <div
                key={product.id}
                className={`bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border ${
                  product.isActive ? "border-gray-100" : "border-gray-300 opacity-75"
                }`}
              >
                {/* Imagen */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${categoryConfig.color}`}
                    >
                      {categoryConfig.label}
                    </span>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-10">
                    {product.description || "Sin descripción"}
                  </p>

                  {/* Detalles */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-lg text-gray-900">
                        S/. {Number(product.price).toFixed(2)}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg ${
                        isLowStock
                          ? "bg-red-50 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <Package size={16} />
                      <span className="text-sm font-semibold">
                        {product.stock} unid.
                      </span>
                    </div>
                  </div>

                  {isLowStock && (
                    <div className="mb-3 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs text-yellow-800 font-medium">
                        Stock bajo - Considera reabastecer
                      </p>
                    </div>
                  )}

                  {/* Acciones */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEdit(product)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors font-medium text-sm"
                    >
                      <Edit size={16} />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors font-medium text-sm"
                    >
                      <Trash2 size={16} />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal/Formulario */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-[#0D47A1] to-[#1565C0] rounded-xl flex items-center justify-center">
                  <Package size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {isEditing ? "Editar producto" : "Nuevo producto"}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {isEditing
                      ? "Modifica la información del producto"
                      : "Completa los datos para agregar un producto"}
                  </p>
                </div>
              </div>
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                onClick={() => setIsFormOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            {/* Contenido del formulario */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3">
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Error al guardar</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre del producto
                </label>
                <input
                  type="text"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D47A1] transition-colors"
                  placeholder="Ej: Collar antipulgas"
                  value={form.name}
                  onChange={handleChange("name")}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D47A1] transition-colors min-h-[100px] resize-none"
                  placeholder="Describe el producto..."
                  value={form.description}
                  onChange={handleChange("description")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Categoría
                  </label>
                  <select
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0D47A1] transition-colors bg-white"
                    value={form.category}
                    onChange={handleChange("category")}
                  >
                    <option value="ACCESSORY">Accesorio</option>
                    <option value="FOOD">Alimento</option>
                    <option value="TOY">Juguete</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Precio (S/.)
                  </label>
                  <div className="relative">
                    <DollarSign
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#0D47A1] transition-colors"
                      placeholder="25.00"
                      value={form.price}
                      onChange={handleChange("price")}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Stock disponible
                  </label>
                  <div className="relative">
                    <Package
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="number"
                      min={0}
                      className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#0D47A1] transition-colors"
                      placeholder="50"
                      value={form.stock}
                      onChange={handleChange("stock")}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <ImageIcon size={16} className="inline mr-1" />
                    Imagen del producto{" "}
                    {isEditing && (
                      <span className="text-gray-500 font-normal">
                        (opcional al editar)
                      </span>
                    )}
                    {!isEditing && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full border-2 border-dashed border-gray-300 rounded-xl px-4 py-3 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#0D47A1] file:text-white hover:file:bg-[#0d3a7a] file:cursor-pointer cursor-pointer"
                    onChange={handleChange("imageFile")}
                  />
                </div>

              </div>

              {/* Botones del footer */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-3 text-sm rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 text-sm rounded-xl bg-linear-to-r from-[#0D47A1] to-[#1565C0] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {isEditing ? "Guardando..." : "Creando..."}
                    </>
                  ) : (
                    <>{isEditing ? "Guardar cambios" : "Crear producto"}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
