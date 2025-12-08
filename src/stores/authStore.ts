import { create } from "zustand";
import { api } from "../services/api";

export interface AuthUser {
  id: string;
  name: string;
  lastname: string;
  email: string;
  phoneNumber?: string | null;
  role?: "ADMIN" | "USER"; 
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  logout: () => Promise<void>;
  hydrateFromStorage: () => void;
}

const STORAGE_KEY = "luaspets_auth";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isHydrated: false,

  setAuth: (user, token) => {
    set({ user, token, isAuthenticated: true });
    localStorage.setItem("luaspets_auth", JSON.stringify({ user, token }));
  },

  hydrateFromStorage: () => {
    try {
      const raw = localStorage.getItem("luaspets_auth");

      if (raw) {
        const parsed = JSON.parse(raw);
        set({
          user: parsed.user,
          token: parsed.token,
          isAuthenticated: true,
          isHydrated: true,
        });
      } else {
        set({ isHydrated: true });
      }

    } catch (err) {
      console.error("Error hydrating auth store:", err);
      localStorage.removeItem("luaspets_auth");
      set({ isHydrated: true });
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
