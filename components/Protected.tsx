"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import { Spinner } from "./ui/shadcn-io/spinner";

export default function Protected({ children }: { children: React.ReactNode }) {
  const { user, status } = useAuth();
  const router = useRouter();
  const redirectedRef = React.useRef(false);

  React.useEffect(() => {
    if (status === "unauthenticated" && !redirectedRef.current) {
      redirectedRef.current = true;
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "checking") {
    return (
      <div className="flex h-dvh items-center justify-center text-sm text-muted-foreground">
        <Spinner />
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  return <>{children}</>;
}
