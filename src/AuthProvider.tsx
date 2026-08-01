import type { User } from "./api/generated/models";
import { API_URL } from "./config";
import {
  createContext,
  useEffect,
  useState,
  useContext,
  useMemo,
  useCallback,
} from "react";

interface AuthContextType {
  user: User | null;
  login: (identity: string, password: string, isCode?: boolean) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/whoami`, {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const login = useCallback(async (identity: string, password: string, isCode: boolean = false) => {
    setError(null)
    const loginData = isCode ? { code: identity, password }: { username: identity, password };

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      if (!res.ok) {
        throw new Error(`Login failed ${res}`);
      }

      const me = await fetch(`${API_URL}/auth/whoami`, {
        credentials: "include",
      });

      if (!me.ok) {
        throw new Error(`whoami failed ${me.json()}`);
      }

      const data = await me.json();

      setUser(data);
    } catch(e) {
      setError(e instanceof Error ? e : new Error("Unknown error"));
      throw e; 
    }
  }, []);

  const logout = useCallback(async () => {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
  }, []);

  const values = useMemo(() => {
    return { user, login, logout, loading, error };
  }, [user, login, logout, loading, error]);

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
