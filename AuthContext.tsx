import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export type UserType = "restaurant" | "supplier" | "jobseeker";

type User = {
  id: string;
  email: string;
  name: string;
  restaurantName?: string;
  companyName?: string;
  userType: UserType;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    userType: UserType,
    businessName?: string
  ) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const storedUser = localStorage.getItem("foodash_user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser({
            ...parsedUser,
            id: session.user.id, // Ensure we always use the Supabase user ID
          });
        }
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const storedUser = localStorage.getItem("foodash_user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser({
            ...parsedUser,
            id: session.user.id, // Ensure we always use the Supabase user ID
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const {
        data: { user: authUser },
        error,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!authUser) throw new Error("No user returned from Supabase");

      const mockUser: User = {
        id: authUser.id,
        email,
        name: "Restaurant Owner",
        restaurantName: "Sample Restaurant",
        userType: "restaurant",
      };

      setUser(mockUser);
      localStorage.setItem("foodash_user", JSON.stringify(mockUser));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    userType: UserType,
    businessName?: string
  ) => {
    setLoading(true);
    try {
      const {
        data: { user: authUser },
        error,
      } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      if (!authUser) throw new Error("No user returned from Supabase");

      const mockUser: User = {
        id: authUser.id,
        email,
        name,
        userType,
        ...(userType === "restaurant" ? { restaurantName: businessName } : {}),
        ...(userType === "supplier" ? { companyName: businessName } : {}),
      };

      setUser(mockUser);
      localStorage.setItem("foodash_user", JSON.stringify(mockUser));
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem("foodash_user");
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
