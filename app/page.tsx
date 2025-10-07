"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Play,
  Quote,
  Megaphone,
  Lightbulb,
  Hash,
  History as HistoryIcon,
  Bookmark,
  LayoutGrid,
  Sun,
  Moon,
} from "lucide-react";

/* ——— Simple Theme Toggle (no next-themes) ——— */
function ThemeButton() {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const saved = localStorage.getItem("theme");
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const dark = saved === "dark" || (!saved && systemDark);
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="flex h-9 w-9 items-center justify-center rounded-md border hover:bg-accent transition-colors"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

/* LOGO */
function CreafloLogoSmall() {
  return (
    <span className="flex items-center text-primary">
      CRE
      <Play
        className="mx-[2px] h-5 w-5 -rotate-[90deg] translate-y-[1px]"
        fill="currentColor"
        stroke="currentColor"
      />
      FLO
    </span>
  );
}

function CreafloLogoBig() {
  return (
    <span className="flex items-center text-5xl font-semibold text-primary sm:text-6xl">
      CRE
      <Play
        className="mx-[2px] h-16 w-16 -rotate-[90deg] translate-y-[1px]"
        fill="currentColor"
        stroke="currentColor"
      />
      FLO
    </span>
  );
}

function NavButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
    >
      {children}
    </button>
  );
}

/* Landing Page */
export default function Landing() {
  const router = useRouter();

  const scrollTo = React.useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 mx-auto flex max-w-[1100px] items-center justify-between bg-background/80 px-6 py-5 backdrop-blur-md">
        <button
          type="button"
          onClick={() => scrollTo("overview")}
          className="inline-flex items-center"
          aria-label="CREAFLO Home"
        >
          <CreafloLogoSmall />
        </button>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <NavButton onClick={() => scrollTo("overview")}>Overview</NavButton>
          <NavButton onClick={() => scrollTo("features")}>Features</NavButton>
          <NavButton onClick={() => scrollTo("design")}>Design</NavButton>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeButton />
          <Button type="button" onClick={() => router.push("/register")}>
            Sign in
          </Button>
        </div>
      </header>

      <main>
        {/* Overview */}
        <section
          id="overview"
          className="mx-auto max-w-[1100px] scroll-mt-20 px-6 pb-10 pt-14"
        >
          <div className="mb-6">
            <CreafloLogoBig />
          </div>

          <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            A focused workspace for content creation
          </h1>

          <p className="mt-3 max-w-[720px] text-muted-foreground">
            Generate captions, hooks, content ideas, and hashtags in one calm,
            distraction-free environment. Built for clarity, speed, and
            consistency.
          </p>

          <Button
            type="button"
            onClick={() => router.push("/register")}
            className="mt-4 px-10 py-4 text-md"
          >
            Get Started
          </Button>
        </section>

        {/* Features */}
        <section
          id="features"
          className="mx-auto max-w-[1100px] scroll-mt-20 px-6 pb-4"
        >
          <h2 className="text-xl font-semibold tracking-tight">
            What you can create
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="space-y-2">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border">
                  <Quote className="h-4 w-4" />
                </div>
                <CardTitle className="text-lg">Caption Generator</CardTitle>
                <CardDescription>
                  Create several caption variations quickly, tuned to your
                  audience.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="space-y-2">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border">
                  <Megaphone className="h-4 w-4" />
                </div>
                <CardTitle className="text-lg">Hook Generator</CardTitle>
                <CardDescription>
                  Draft attention-grabbing openers that stop the scroll
                  instantly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="space-y-2">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border">
                  <Lightbulb className="h-4 w-4" />
                </div>
                <CardTitle className="text-lg">Idea Generator</CardTitle>
                <CardDescription>
                  Discover new content angles and creative directions for your
                  brand.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="space-y-2">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border">
                  <Hash className="h-4 w-4" />
                </div>
                <CardTitle className="text-lg">Hashtag Generator</CardTitle>
                <CardDescription>
                  Find relevant, clean hashtags to improve reach and visibility.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Design  */}
        <section
          id="design"
          className="mx-auto max-w-[1100px] scroll-mt-20 px-6 py-10"
        >
          <h2 className="text-xl font-semibold tracking-tight">
            Why creators love it
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="space-y-2">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border">
                  <LayoutGrid className="h-4 w-4" />
                </div>
                <CardTitle className="text-base">Unified dashboard</CardTitle>
                <CardDescription>
                  Work across multiple tools without breaking focus or changing
                  tabs.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Everything you create—captions, ideas, hashtags—lives in one
                consistent space. No clutter, no switching context, just
                creation.
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="space-y-2">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border">
                  <HistoryIcon className="h-4 w-4" />
                </div>
                <CardTitle className="text-base">History</CardTitle>
                <CardDescription>
                  Every generated output is stored automatically and easily
                  revisited.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Your past ideas stay accessible—browse by date, topic, or type
                to refine or reuse the best results anytime.
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="space-y-2">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border">
                  <Bookmark className="h-4 w-4" />
                </div>
                <CardTitle className="text-base">Saved</CardTitle>
                <CardDescription>
                  Pin your favorite outputs for instant access when planning
                  campaigns.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Keep your best-performing content in one organized list ready to
                use again, saving you hours of repetitive work.
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="space-y-2">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border">
                  <LayoutGrid className="h-4 w-4" />
                </div>
                <CardTitle className="text-base">
                  Streamlined experience
                </CardTitle>
                <CardDescription>
                  Designed to remove noise—just clear input fields and instant
                  results.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Minimal colors, clean typography, and fluid spacing let your
                focus stay where it should be—on creating, not managing tools.
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <div className="mx-auto max-w-[1100px] px-6">
        <Separator />
      </div>

      <footer className="px-6 py-6">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} CREAFLO</span>
        </div>
      </footer>
    </div>
  );
}
