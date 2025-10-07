"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Copy, Save, RotateCcw } from "lucide-react";

export function ResultItem({
  text,
  onRegenerate,
}: {
  text: string;
  onRegenerate?: () => void;
}) {
  return (
    <div className="rounded-3xl border bg-card p-5">
      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
        {text}
      </p>
      <Separator className="my-4" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => navigator.clipboard.writeText(text)}
          >
            <Copy className="mr-2 h-4 w-4" /> Copy
          </Button>
          <Button variant="outline" className="rounded-full">
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
        </div>
        <Button
          variant="outline"
          className="rounded-full"
          onClick={onRegenerate}
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Regenerate
        </Button>
      </div>
    </div>
  );
}
