import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  checkAccount,
  checkPassword,
  isAuthEnabled,
  useAccountList,
} from "@/lib/auth";

const STORAGE_KEY = "xuncha_manual_ok";

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (account: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthEnabled()) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(sessionStorage.getItem(STORAGE_KEY) === "1");
    }
    setLoading(false);
  }, []);

  const signIn = useCallback(async (account: string, password: string) => {
    const ok = useAccountList()
      ? checkAccount(account, password)
      : checkPassword(password);
    if (ok) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setIsAuthenticated(true);
      return { error: null };
    }
    return { error: new Error("账号或密码错误") };
  }, []);

  const signOut = useCallback(async () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
