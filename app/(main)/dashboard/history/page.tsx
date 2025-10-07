"use client";

import * as React from "react";
import { ListItem } from "@/components/ListItem";
import { PenTool, Target, Lightbulb, Hash } from "lucide-react";

type ToolType = "caption" | "hook" | "idea" | "hashtag";

const TOOL_ICON: Record<ToolType, React.ElementType> = {
  caption: PenTool,
  hook: Target,
  idea: Lightbulb,
  hashtag: Hash,
};

export default function HistoryPage() {
  const rows = Array.from({ length: 6 }).map((_, i) => {
    const tool = ["caption", "hook", "idea", "hashtag"][i % 4] as ToolType;
    return {
      id: `${i + 1}`,
      tool,
      title: `${tool[0].toUpperCase()}${tool.slice(1)} Generator`,
      input: "tes123",
      date: "10/07/2025, 08:13 PM",
    };
  });

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card/40 px-8 py-7">
        <h1 className="text-3xl font-bold tracking-tight">History</h1>
        <p className="mt-1 text-muted-foreground">
          All generated content is automatically saved here
        </p>
      </section>

      <div className="space-y-4">
        {rows.map((r) => {
          const Icon = TOOL_ICON[r.tool];
          return (
            <ListItem
              key={r.id}
              icon={Icon}
              title={r.title}
              subtitle={[
                { label: "Input", value: r.input },
                { label: "", value: r.date },
              ]}
              actionLabel="View"
              onAction={() => {}}
            />
          );
        })}
      </div>
    </div>
  );
}
