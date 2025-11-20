import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore, type AuthUser } from "../../stores/authStore";
import { api } from "../../services/api";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

interface LoginResponse {
  user: AuthUser;
  token: string;
}

const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const { data } = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      setAuth(data.user, data.token);
      if (data.user.role === "ADMIN") {
          navigate("/admin/services");
      } else {
        navigate("/");
      }
      toast.success("Iniciaste sesión correctamente.");
    } catch (error) {
      let message = "Error al iniciar sesión";
      if (isAxiosError(error)) {
        message = error?.response?.data?.message || "Error al iniciar sesión";
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center from-pink-50 to-blue-50 px-4 py-10">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-xl border border-pink-200 rounded-2xl p-8 relative">
        {/* Logo */}
        <div className="flex justify-center -mt-20 mb-4">
          <div className="bg-white shadow-md rounded-full p-3 border-2 border-pink-300">
            <img
              src="/logotipo.png"
              alt="LUAS PETS Logo"
              className="h-24 w-24 object-contain"
            />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-[#0D47A1] mb-1 text-center">
          Iniciar sesión
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Bienvenido a{" "}
          <span className="font-semibold text-[#E91E63]">LUAS PETS</span>
        </p>

        {errorMsg && (
          <div className="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-2 text-sm shadow-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#E91E63] text-white font-semibold py-3 rounded-xl shadow-md hover:bg-[#d81b60] transition-all disabled:opacity-60 hover:shadow-lg"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600 text-center">
          ¿No tienes una cuenta?{" "}
          <Link
            to="/register"
            className="text-[#E91E63] font-medium hover:underline"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
