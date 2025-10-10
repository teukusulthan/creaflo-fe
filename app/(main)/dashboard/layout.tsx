"use client";

import * as React from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import Protected from "@/components/Protected";
import FadeContent from "@/components/FadeContent";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const stored = localStorage.getItem("cf-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const dark = stored ? stored === "dark" : prefersDark;
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggleTheme = () => {
    setIsDark((p) => {
      const n = !p;
      document.documentElement.classList.toggle("dark", n);
      localStorage.setItem("cf-theme", n ? "dark" : "light");
      return n;
    });
  };

  return (
    <Protected>
      <FadeContent
        blur={true}
        duration={1000}
        easing="ease-out"
        initialOpacity={0}
      >
        <div className="min-h-dvh bg-muted/30 text-foreground">
          <Navbar isDark={isDark} toggleTheme={toggleTheme} />
          <div className="flex">
            <Sidebar />
            <main className="ml-64 w-full">
              <div className="mx-auto max-w-[1200px] px-8 py-10">
                {children}
              </div>
              <Footer />
            </main>
          </div>
        </div>
      </FadeContent>
    </Protected>
  );
}
