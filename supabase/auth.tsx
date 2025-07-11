import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";

type AdminUser = {
  id: string;
  username: string;
  email: string;
  full_name: string;
};

type AuthContextType = {
  user: AdminUser | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem("vhp_admin_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (username: string, password: string) => {
    const { data, error } = await supabase
      .from("admin_users")
      .select("id, username, email, full_name")
      .eq("username", username)
      .eq("password", password)
      .eq("is_active", true)
      .single();

    if (error || !data) {
      throw new Error("Invalid username or password");
    }

    setUser(data);
    localStorage.setItem("vhp_admin_user", JSON.stringify(data));
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem("vhp_admin_user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
