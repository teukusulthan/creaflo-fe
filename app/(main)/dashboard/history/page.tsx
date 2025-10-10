"use client";

import * as React from "react";
import { ListItem } from "@/components/ListItem";
import {
  History as HistoryIcon,
  PenTool,
  Target,
  Lightbulb,
  Hash,
  Clipboard,
  Check,
} from "lucide-react";
import { getHistory, type HistoryItem } from "@/services/history.services";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { log } from "console";

type ToolType = "caption" | "hook" | "idea" | "hashtag";

const TOOL_ICON: Record<ToolType, React.ElementType> = {
  caption: PenTool,
  hook: Target,
  idea: Lightbulb,
  hashtag: Hash,
};

/** Ambil raw output saja dari string JSON atau plain text */
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
      /* fall through */
    }
  }
  return trimmed;
}

export default function HistoryPage() {
  const [loading, setLoading] = React.useState(true);
  const [history, setHistory] = React.useState<HistoryItem[]>([]);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<HistoryItem | null>(null);
  const [copied, setCopied] = React.useState<"input" | "output" | null>(null);

  React.useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getHistory();
        setHistory(res.data?.items ?? []);
      } catch (e: any) {
        toast.error(e?.message || "Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const onView = (item: HistoryItem) => {
    setSelected(item);
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

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header   */}
      <section className="rounded-3xl border bg-card/40 px-8 py-7">
        <div className="flex items-center gap-2">
          <HistoryIcon className="h-7 mr-2 w-7 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">History</h1>
        </div>
        <p className="mt-1 text-muted-foreground">
          All generated content is automatically saved here
        </p>
      </section>

      {history.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No history yet. Try generating something!
        </p>
      ) : (
        <div className="space-y-4">
          {history.map((r) => {
            const Icon = TOOL_ICON[r.tool];
            const formattedDate = new Date(r.createdAt).toLocaleString(
              "en-US",
              {
                dateStyle: "short",
                timeStyle: "short",
              }
            );
            const inputPreview = (r.inputText ?? "")
              .trim()
              .replace(/\s+/g, " ");
            console.log(inputPreview);

            return (
              <ListItem
                key={r.id}
                icon={Icon}
                title={`${r.tool[0].toUpperCase()}${r.tool.slice(1)} Generator`}
                subtitle={[
                  {
                    label: "",
                    value:
                      inputPreview.slice(0, 140) +
                      (inputPreview.length > 140 ? "…" : ""),
                  },
                  { label: "", value: formattedDate },
                ]}
                actionLabel="View"
                onAction={() => onView(r)}
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
              {/* input */}
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
