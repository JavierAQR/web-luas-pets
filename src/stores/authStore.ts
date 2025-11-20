import { create } from "zustand";
import { api } from "../services/api";

export interface AuthUser {
  id: string;
  name: string;
  lastname: string;
  email: string;
  phoneNumber?: string | null;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  logout: () => Promise<void>;
  hydrateFromStorage: () => void;
}

const STORAGE_KEY = "luaspets_auth";

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    // guardar en estado
    set({ user, token, isAuthenticated: true });

    // guardar en localStorage
    const payload = JSON.stringify({ user, token });
    localStorage.setItem(STORAGE_KEY, payload);
  },

  hydrateFromStorage: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as { user: AuthUser; token: string };
      set({
        user: parsed.user,
        token: parsed.token,
        isAuthenticated: true,
      });

    } catch (err) {
      console.error("Error hydrating auth store:", err);
      localStorage.removeItem(STORAGE_KEY);
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Error en logout:", error);
    } finally {
      localStorage.removeItem(STORAGE_KEY);
      set({ user: null, token: null, isAuthenticated: false });
      delete api.defaults.headers.common.Authorization;
    }
  },
}));
