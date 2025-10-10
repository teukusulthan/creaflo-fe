"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ListItem } from "@/components/ListItem";
import {
  Lightbulb,
  PenTool,
  Target,
  Hash,
  Loader2,
  Bookmark,
  Clipboard,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { getSaved } from "@/services/history.services";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type ToolType = "caption" | "hook" | "idea" | "hashtag";
const TOOL_ICON: Record<ToolType, React.ElementType> = {
  caption: PenTool,
  hook: Target,
  idea: Lightbulb,
  hashtag: Hash,
};

type Generation = {
  id: string;
  tool: ToolType;
  inputText: string;
  outputText: string;
  isSaved: boolean;
  createdAt: string;
};

function toRawOutput(text: string): string {
  if (!text) return "";
  const trimmed = text.trim();
  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === "object" && "output" in parsed) {
        const o = (parsed as any).output;
        return Array.isArray(o) ? o.join("\n") : String(o ?? "");
      }
      return JSON.stringify(parsed, null, 2);
    } catch {
      /* ignore */
    }
  }
  return trimmed;
}

export default function SavedPage() {
  const router = useRouter();

  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState<Generation[]>([]);

  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Generation | null>(null);
  const [copied, setCopied] = React.useState<"input" | "output" | null>(null);

  React.useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getSaved();
        const arr = Array.isArray(res?.data) ? (res.data as Generation[]) : [];
        setItems(arr);
      } catch (e: any) {
        toast.error(e?.message || "Failed to load saved generations");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const onView = (g: Generation) => {
    setSelected(g);
    setOpen(true);
  };

  const onCopy = async (text: string, which: "input" | "output") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 1200);
      toast.success(`Copied ${which}`);
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-3xl border bg-card/40 px-8 py-7">
        <div className="flex items-center gap-2">
          <Bookmark className="h-7 w-7 mr-2 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Saved</h1>
        </div>
        <p className="mt-1 text-muted-foreground">
          View your manually saved content
        </p>
      </section>

      {/* List */}
      {loading ? (
        <div className="flex h-40 items-center justify-center text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading...
        </div>
      ) : items.length === 0 ? (
        <div className="py-10 text-center text-muted-foreground">
          No saved generations yet.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((g) => {
            const Icon = TOOL_ICON[g.tool];
            const preview = toRawOutput(g.outputText);
            const date = new Date(g.createdAt).toLocaleString();
            return (
              <ListItem
                key={g.id}
                icon={Icon}
                title={`${g.tool[0].toUpperCase()}${g.tool.slice(1)} Generator`}
                subtitle={[
                  {
                    label: "",
                    value: g.inputText,
                  },
                  { label: "", value: date },
                ]}
                actionLabel="View"
                onAction={() => onView(g)}
              />
            );
          })}
        </div>
      )}

      {/* Detail dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selected ? (
                <>
                  {React.createElement(TOOL_ICON[selected.tool], {
                    className: "h-5 w-5 text-primary",
                  })}
                  {selected.tool[0].toUpperCase()}
                  {selected.tool.slice(1)} Detail
                </>
              ) : (
                "Detail"
              )}
            </DialogTitle>
            <DialogDescription>
              {selected
                ? new Date(selected.createdAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "-"}
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="space-y-5">
              {/* Input */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium">Input</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => onCopy(selected.inputText, "input")}
                  >
                    {copied === "input" ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Clipboard className="mr-2 h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <div className="rounded-xl border bg-muted/30 p-3 text-sm">
                  <pre className="whitespace-pre-wrap break-words">
                    {selected.inputText}
                  </pre>
                </div>
              </div>

              <Separator />

              {/* Output */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium">Output</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() =>
                      onCopy(toRawOutput(selected.outputText), "output")
                    }
                  >
                    {copied === "output" ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Clipboard className="mr-2 h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <div className="rounded-xl border bg-muted/30 p-3 text-sm">
                  <pre className="whitespace-pre-wrap break-words">
                    {toRawOutput(selected.outputText)}
                  </pre>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <Button onClick={() => setOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
