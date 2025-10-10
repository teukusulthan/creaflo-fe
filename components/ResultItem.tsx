"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Copy, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export function ResultItem({
  text,
  onRegenerate,
}: {
  text: string;
  onRegenerate?: () => void;
}) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      // Fallback (rare) if Clipboard API fails
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        toast.success("Copied to clipboard");
      } catch {
        toast.error("Failed to copy");
      }
    }
  };

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
            className="rounded-full cursor-pointer"
            onClick={handleCopy}
          >
            <Copy className="mr-2 h-4 w-4" /> Copy
          </Button>
        </div>
        <Button
          variant="outline"
          className="rounded-full cursor-pointer"
          onClick={onRegenerate}
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Regenerate
        </Button>
      </div>
    </div>
  );
}
