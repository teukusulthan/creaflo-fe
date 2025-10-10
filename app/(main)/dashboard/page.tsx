"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { FeatureCard } from "@/components/FeatureCard";
import { PenTool, Target, Lightbulb, Hash } from "lucide-react";
import { toast } from "sonner";
import { getMe } from "@/services/auth.services";
import { ApiResponse } from "@/types/common";

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  const features = [
    {
      id: "caption",
      icon: PenTool,
      title: "Caption Generator",
      desc: "Generate engaging captions for your social media posts in seconds",
    },
    {
      id: "hook",
      icon: Target,
      title: "Hook Generator",
      desc: "Create attention-grabbing hooks that stop the scroll",
    },
    {
      id: "idea",
      icon: Lightbulb,
      title: "Idea Generator",
      desc: "Never run out of content ideas with AI-powered suggestions",
    },
    {
      id: "hashtag",
      icon: Hash,
      title: "Hashtag Generator",
      desc: "Find the perfect hashtags to maximize your reach",
    },
  ];

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = (await getMe()) as ApiResponse<User>;
        if (!mounted) return;
        setUser(res.data ?? null);
        console.log(user);
      } catch (e: any) {
        toast.error(e?.message || "Failed to load user info");
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border bg-card/40 p-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {loading
            ? "Loading..."
            : user
            ? `Welcome back, ${user.name}!`
            : "Welcome back!"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Choose a tool to start creating amazing content with AI
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {features.map((f) => (
          <FeatureCard
            key={f.id}
            icon={f.icon}
            title={f.title}
            description={f.desc}
            onClick={() => router.push(`/dashboard/tools/${f.id}`)}
          />
        ))}
      </section>
    </div>
  );
}
