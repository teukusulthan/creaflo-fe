"use client";
import * as React from "react";
import { meRequest } from "@/services/auth.services";

type AuthStatus = "checking" | "authenticated" | "unauthenticated";

type User = {
  id: string;
  name: string;
  email: string;
} | null;

type AuthCtx = {
  user: User;
  status: AuthStatus;
};

const AuthContext = React.createContext<AuthCtx>({
  user: null,
  status: "checking",
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User>(null);
  const [status, setStatus] = React.useState<AuthStatus>("checking");

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const u = await meRequest();
        if (!active) return;
        if (u) {
          setUser(u);
          setStatus("authenticated");
        } else {
          setUser(null);
          setStatus("unauthenticated");
        }
      } catch {
        if (!active) return;
        setUser(null);
        setStatus("unauthenticated");
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, status }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => React.useContext(AuthContext);
