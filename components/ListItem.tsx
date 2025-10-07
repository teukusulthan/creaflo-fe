"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export function ListItem({
  icon: Icon,
  title,
  subtitle,
  actionLabel = "View",
  onAction,
}: {
  icon: React.ElementType; // ⬅️ longgarkan tipe agar semua ikon React bisa diterima
  title: string;
  subtitle: { label: string; value: string }[];
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-3xl border bg-card px-6 py-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />{" "}
            {/* aman untuk semua icon yang terima className */}
          </div>
          <div className="space-y-0.5">
            <h3 className="text-base font-semibold">{title}</h3>
            <div className="text-sm text-muted-foreground">
              {subtitle.map((s, idx) => (
                <span key={idx} className={idx > 0 ? "ml-0 block" : ""}>
                  {s.label ? `${s.label}: ` : ""}
                  {s.value}
                </span>
              ))}
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={onAction} className="rounded-full">
          <Eye className="mr-2 h-4 w-4" /> {actionLabel}
        </Button>
      </div>
    </div>
  );
}
