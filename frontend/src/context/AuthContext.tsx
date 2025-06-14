import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import api from "../lib/axios";

interface Restaurant {
  id: string;
  name: string;
  pincode: string;
  menuItems: MenuItem[];
}

interface MenuItem {
  id: string;
  name: string;
  price: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  image: string;
  onboarded: boolean;
  restaurants: Restaurant[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refresh user details
  const refreshUser = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users/me");
      setUser(res.data.user);
      setError(null);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Refresh auth token
  const refreshToken = async () => {
    try {
      setIsRefreshing(true);
      await api.post("/auth/refresh");
      await refreshUser();
      return true;
    } catch (err) {
      console.error("Refresh failed", err);
      setUser(null);
      return false;
    } finally {
      setIsRefreshing(false);
    }
  };

  // Login
  const login = async (credential: string) => {
    try {
      if (!credential) throw new Error("Missing credential");
      await api.post("/auth/google", { credential });
      await refreshUser();
    } catch (err) {
      setError("Login failed");
      throw err;
    }
  };

  // Login
  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Interceptor for refreshing tokens, on 401
  useEffect(() => {
    refreshUser();

    const interceptor = api.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !isRefreshing
        ) {
          originalRequest._retry = true;
          const refreshed = await refreshToken();
          if (refreshed) return api(originalRequest);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
