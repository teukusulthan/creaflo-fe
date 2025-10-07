"use client";

import * as React from "react";
import { ListItem } from "@/components/ListItem";
import { Lightbulb } from "lucide-react";

export default function SavedPage() {
  const rows = Array.from({ length: 5 }).map((_, i) => ({
    id: `${i + 1}`,
    title: "Idea Generator",
    input: "tesdfas",
    date: "10/07/2025, 08:14 PM",
    icon: Lightbulb,
  }));

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card/40 px-8 py-7">
        <h1 className="text-3xl font-bold tracking-tight">Saved</h1>
        <p className="mt-1 text-muted-foreground">
          View your manually saved content
        </p>
      </section>

      <div className="space-y-4">
        {rows.map((r) => (
          <ListItem
            key={r.id}
            icon={r.icon}
            title={r.title}
            subtitle={[
              { label: "Input", value: r.input },
              { label: "", value: r.date },
            ]}
            actionLabel="View"
            onAction={() => {}}
          />
        ))}
      </div>
    </div>
  );
}
