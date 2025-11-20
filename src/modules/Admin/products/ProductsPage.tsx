import { useEffect, useState, type FormEvent } from "react";
import { api } from "../../../services/api";
import toast from "react-hot-toast";
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
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Error al cargar productos";
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
      toast.success("Producto eliminado correctamente.")
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "No se pudo eliminar el producto";
      alert(message);
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
      toast.success("Producto agregado/actualizado correctamente.")
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0D47A1]">
            Gestión de Productos
          </h1>
          <p className="text-sm text-gray-600">
            Administra el catálogo de productos de la tienda.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-[#E91E63] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#d81b60] transition-colors"
        >
          + Nuevo producto
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-2 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-600">Cargando productos...</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-gray-600">
          Aún no hay productos registrados. Crea el primero.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Imagen
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Categoría
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Precio
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Stock
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Estado
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="px-4 py-3">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-12 w-12 rounded-md object-cover border"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-2">
                      {product.description}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700">
                      {product.category === "ACCESSORY" && "Accesorio"}
                      {product.category === "FOOD" && "Alimento"}
                      {product.category === "TOY" && "Juguete"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    S/. {Number(product.price).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-semibold ${
                        product.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {product.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(product)}
                      className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-700 hover:bg-red-100"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal/Formulario */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setIsFormOpen(false)}
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-[#0D47A1] mb-4">
              {isEditing ? "Editar producto" : "Nuevo producto"}
            </h2>

            {error && (
              <div className="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-2 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E91E63]"
                  value={form.name}
                  onChange={handleChange("name")}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E91E63] min-h-[70px]"
                  value={form.description}
                  onChange={handleChange("description")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E91E63]"
                    value={form.category}
                    onChange={handleChange("category")}
                  >
                    <option value="ACCESSORY">Accesorio</option>
                    <option value="FOOD">Alimento</option>
                    <option value="TOY">Juguete</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio (S/.)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E91E63]"
                    value={form.price}
                    onChange={handleChange("price")}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    min={0}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E91E63]"
                    value={form.stock}
                    onChange={handleChange("stock")}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Imagen {isEditing ? "(opcional al editar)" : "(requerida)"}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full text-sm"
                    onChange={handleChange("imageFile")}
                  />
                </div>

                <div className="flex items-center mt-6">
                  <input
                    id="isActive"
                    type="checkbox"
                    checked={form.isActive}
                    onChange={handleChange("isActive")}
                    className="h-4 w-4 text-[#E91E63] border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isActive"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Activo
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-sm rounded-lg bg-[#E91E63] text-white font-semibold hover:bg-[#d81b60] disabled:opacity-60"
                >
                  {saving
                    ? isEditing
                      ? "Guardando..."
                      : "Creando..."
                    : isEditing
                    ? "Guardar cambios"
                    : "Crear producto"}
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
