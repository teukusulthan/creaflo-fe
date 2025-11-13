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
  Quote,
  Megaphone,
  Lightbulb,
  Hash,
  History as HistoryIcon,
  Bookmark,
  LayoutGrid,
} from "lucide-react";
import { ThemeButton } from "@/components/ThemeButton";
import { NavButton } from "@/components/NavButton";
import { CreafloLogoSmall, CreafloLogoBig } from "@/components/Logo";
import FadeContent from "@/components/FadeContent";
import TrueFocus from "@/components/TrueFocus";
// Squares dihapus karena tidak dipakai
// import Squares from "@/components/Squares";

export default function Landing() {
  const router = useRouter();

  const scrollTo = React.useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <FadeContent
        blur={true}
        duration={2000}
        easing="ease-out"
        initialOpacity={0}
      >
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
            <NavButton onClick={() => scrollTo("design")}>Why</NavButton>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeButton />
            <Button
              className="cursor-pointer"
              type="button"
              onClick={() => router.push("/login")}
            >
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

            <TrueFocus
              sentence="A focused workspace for content creation"
              blurAmount={2}
              borderColor="var(--primary)"
              glowColor="rgba(99,102,241,0.5)"
              animationDuration={1.2}
              pauseBetweenAnimations={0.8}
              groupSize={2}
            />

            <p className="mt-3 max-w-[720px] text-muted-foreground">
              Generate captions, hooks, content ideas, and hashtags in one calm,
              distraction-free environment. Built for clarity, speed, and
              consistency.
            </p>

            <Button
              type="button"
              onClick={() => router.push("/register")}
              className="mt-4 px-10 py-4 cursor-pointer text-md"
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
                    Find relevant, clean hashtags to improve reach and
                    visibility.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </section>

          {/* Design */}
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
                    Work across multiple tools without breaking focus or
                    changing tabs.
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
                  Keep your best-performing content in one organized list ready
                  to use again, saving you hours of repetitive work.
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

        <footer className="border-t bg-background/50 backdrop-blur-sm">
          <div className="mx-auto flex max-w-[1100px] flex-col items-center justify-between gap-4 px-6 py-8 text-center text-sm text-muted-foreground md:flex-row md:text-left">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <CreafloLogoSmall />
              <span className="text-muted-foreground">
                © {new Date().getFullYear()} Creaflo App
              </span>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-primary"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.22 4.22 0 001.85-2.34 8.2 8.2 0 01-2.63 1 4.11 4.11 0 00-7 3.75A11.66 11.66 0 013 5.1a4.1 4.1 0 001.27 5.47 4 4 0 01-1.86-.5v.05a4.11 4.11 0 003.3 4 4.1 4.1 0 01-1.85.07 4.12 4.12 0 003.84 2.85A8.25 8.25 0 012 19.54 11.63 11.63 0 008.29 21c7.55 0 11.68-6.26 11.68-11.68v-.53A8.4 8.4 0 0022.46 6z" />
                </svg>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-primary"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .5A12 12 0 000 12.67a12.1 12.1 0 008.21 11.52c.6.11.82-.26.82-.58v-2c-3.34.73-4.04-1.62-4.04-1.62a3.18 3.18 0 00-1.34-1.76c-1.1-.77.09-.75.09-.75a2.5 2.5 0 011.83 1.23 2.53 2.53 0 003.45 1 2.54 2.54 0 01.75-1.6c-2.67-.3-5.47-1.36-5.47-6.07a4.77 4.77 0 011.27-3.31 4.43 4.43 0 01.12-3.26s1-.32 3.3 1.24a11.44 11.44 0 016 0C16.58 4.18 17.6 4.5 17.6 4.5a4.42 4.42 0 01.12 3.26 4.77 4.77 0 011.27 3.31c0 4.72-2.81 5.76-5.49 6.06a2.84 2.84 0 01.81 2.2v3.26c0 .32.22.7.83.58A12.1 12.1 0 0024 12.67 12 12 0 0012 .5z" />
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </FadeContent>
    </div>
  );
}
