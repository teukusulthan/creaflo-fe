"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ResultItem } from "./ResultItem";
import { toast } from "sonner";

import type { AiTool, Lang, AiResult } from "@/services/ai.services";
import {
  generateCaption,
  generateHook,
  generateIdeas,
  generateHashtags,
  generateGeneric,
} from "@/services/ai.services";
import { toggleSaveGeneration } from "@/services/history.services";

import { LayoutGrid, PenTool, Target, Lightbulb, Hash } from "lucide-react";

const labelToLang = (v: string): Lang =>
  v === "Bahasa Indonesia" ? "id" : "en";

function explodeOutput(text?: string): string[] {
  if (!text) return [];
  const parts = text
    .split(/\r?\n+/)
    .flatMap((line) => line.split(/•\s*|- |\d+[\.)]\s+/))
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length ? parts : [text.trim()];
}

type CurrentGen = { id: string; isSaved: boolean } | null;

const TOOL_ICON: Partial<Record<AiTool, React.ElementType>> = {
  caption: PenTool,
  hook: Target,
  idea: Lightbulb,
  hashtag: Hash,
};

function AutoResizeTextarea(
  props: React.ComponentProps<typeof Textarea> & { minRows?: number }
) {
  const { value, onChange, minRows = 2, ...rest } = props;
  const ref = React.useRef<HTMLTextAreaElement | null>(null);

  const resize = React.useCallback(() => {
    if (!ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = `${ref.current.scrollHeight}px`;
  }, []);

  React.useEffect(() => {
    resize();
  }, [value, resize]);

  return (
    <Textarea
      ref={ref}
      rows={minRows}
      onInput={resize}
      value={value}
      onChange={(e) => {
        onChange?.(e);
        requestAnimationFrame(resize);
      }}
      className="resize-none rounded-xl"
      {...rest}
    />
  );
}

export function ToolScaffold({
  title,
  description,
  placeholder,
  tool,
}: {
  title: string;
  description: string;
  placeholder: string;
  tool: AiTool;
}) {
  const [topic, setTopic] = React.useState("");
  const [languageLabel, setLanguageLabel] = React.useState("English");
  const [results, setResults] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [currentGen, setCurrentGen] = React.useState<CurrentGen>(null);

  const lastRef = React.useRef<{ topic: string; lang: Lang } | null>(null);
  const abortRef = React.useRef<AbortController | null>(null);

  React.useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const HeaderIcon = (TOOL_ICON[tool] ?? LayoutGrid) as React.ElementType;

  const callService = React.useCallback(
    async (input: string, lang: Lang): Promise<AiResult> => {
      if (tool === "caption") {
        return generateCaption(
          { input, lang },
          { signal: abortRef.current?.signal }
        );
      }
      if (tool === "hook") {
        return generateHook(
          { input, lang },
          { signal: abortRef.current?.signal }
        );
      }
      if (tool === "idea") {
        return generateIdeas(
          { input, lang },
          { signal: abortRef.current?.signal }
        );
      }
      if (tool === "hashtag") {
        return generateHashtags(
          { input, lang },
          { signal: abortRef.current?.signal }
        );
      }
      return generateGeneric(
        tool,
        { input, lang },
        { signal: abortRef.current?.signal }
      );
    },
    [tool]
  );

  const onGenerate = React.useCallback(async () => {
    const lang = labelToLang(languageLabel);
    const input = topic.trim();
    if (!input) {
      toast.error("Input must not be empty");
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(undefined);
    try {
      const result = await callService(input, lang);
      if (!result.generationId) {
        toast.error("generationId is missing in the response");
        return;
      }
      setCurrentGen({ id: result.generationId, isSaved: !!result.isSaved });
      setResults(explodeOutput(result.output));
      lastRef.current = { topic: input, lang };
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (e: any) {
      if (e?.name === "CanceledError" || e?.name === "AbortError") return;
      const msg = e?.message || "Failed to generate output";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, [languageLabel, topic, callService]);

  const onRegenerate = React.useCallback(async () => {
    const last = lastRef.current;
    if (!last) return onGenerate();

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(undefined);
    try {
      const result = await callService(last.topic, last.lang);
      if (!result.generationId) {
        toast.error("generationId is missing in the response");
        return;
      }
      setCurrentGen({ id: result.generationId, isSaved: !!result.isSaved });
      setResults(explodeOutput(result.output));
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (e: any) {
      if (e?.name === "CanceledError" || e?.name === "AbortError") return;
      const msg = e?.message || "Failed to generate output";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, [callService, onGenerate]);

  const onToggleSave = React.useCallback(async () => {
    if (!currentGen?.id) return;

    setCurrentGen((prev) =>
      prev ? { ...prev, isSaved: !prev.isSaved } : prev
    );

    try {
      const updated = await toggleSaveGeneration(currentGen.id);
      if (!updated) throw new Error("Empty response from toggleSaveGeneration");

      setCurrentGen((prev) =>
        prev ? { ...prev, isSaved: updated.isSaved } : prev
      );
      toast.success(updated.isSaved ? "Saved" : "Unsaved");
    } catch (e: any) {
      setCurrentGen((prev) =>
        prev ? { ...prev, isSaved: !prev.isSaved } : prev
      );
      toast.error(e?.message || "Failed to toggle save status");
    }
  }, [currentGen]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border bg-card/40 px-8 py-7">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <HeaderIcon className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="mt-1 text-muted-foreground">{description}</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-6">
        <h2 className="text-lg font-semibold">Input</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your topic or keywords to generate content.
        </p>

        <div className="mt-4 space-y-2">
          <label className="text-sm font-medium">Topic or Keywords</label>
          <AutoResizeTextarea
            placeholder={placeholder}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="mt-4 space-y-2">
          <label className="text-sm font-medium">Language</label>
          <Select value={languageLabel} onValueChange={setLanguageLabel}>
            <SelectTrigger className="w-64 rounded-xl cursor-pointer">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value="English">
                English
              </SelectItem>
              <SelectItem className="cursor-pointer" value="Bahasa Indonesia">
                Bahasa Indonesia
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={onGenerate}
          disabled={loading || !topic.trim()}
          className="mt-6 h-12 w-full cursor-pointer rounded-full"
        >
          {loading ? "Generating..." : "Generate"}
        </Button>

        {error && (
          <div className="mt-4 rounded-2xl border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Results</h2>
          <Button
            variant={currentGen?.isSaved ? "secondary" : "default"}
            disabled={!currentGen?.id || loading}
            onClick={onToggleSave}
            className="rounded-full cursor-pointer"
          >
            {currentGen?.isSaved ? "Unsave" : "Save"}
          </Button>
        </div>

        {results.length === 0 ? (
          <div className="rounded-3xl border bg-card/40 p-6 text-sm text-muted-foreground">
            Your outputs will appear here after you generate.
          </div>
        ) : (
          results.map((t, i) => (
            <ResultItem key={i} text={t} onRegenerate={onRegenerate} />
          ))
        )}
      </section>
    </div>
  );
}
