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

import type { AiTool, Lang } from "@/services/ai.services";
import {
  generateCaption,
  generateHook,
  generateIdeas,
  generateHashtags,
  generateGeneric,
} from "@/services/ai.services";

type Props = {
  title: string;
  description: string;
  placeholder: string;
  tool: AiTool;
};

const labelToLang = (v: string): Lang =>
  v === "Bahasa Indonesia" ? "id" : "en";
const langToLabel = (v: Lang) => (v === "id" ? "Bahasa Indonesia" : "English");

/* Ubah satu string panjang menjadi list untuk ResultItem */
function explodeOutput(text?: string): string[] {
  if (!text) return [];
  const parts = text
    .split(/\r?\n+/)
    .flatMap((line) => line.split(/•\s*|- |\d+[\.)]\s+/))
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length ? parts : [text.trim()];
}

export function ToolScaffold({ title, description, placeholder, tool }: Props) {
  const [topic, setTopic] = React.useState("");
  const [languageLabel, setLanguageLabel] = React.useState("English"); // UI label
  const [results, setResults] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(undefined);

  // simpan payload terakhir untuk Regenerate
  const lastRef = React.useRef<{ topic: string; lang: Lang } | null>(null);
  const abortRef = React.useRef<AbortController | null>(null);

  const callService = React.useCallback(
    async (input: string, lang: Lang) => {
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
      toast.error("Input tidak boleh kosong");
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(undefined);
    try {
      const result = await callService(input, lang);
      const list = explodeOutput(result?.output);
      setResults(list);
      lastRef.current = { topic: input, lang };
      // auto-scroll ke bawah setelah hasil muncul
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (e: any) {
      if (e?.name === "CanceledError" || e?.name === "AbortError") return;
      const msg = e?.message || "Gagal menghasilkan output";
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

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(undefined);
    try {
      const result = await callService(last.topic, last.lang);
      const list = explodeOutput(result?.output);
      setResults(list);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (e: any) {
      if (e?.name === "CanceledError" || e?.name === "AbortError") return;
      const msg = e?.message || "Gagal menghasilkan output";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, [callService, onGenerate]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border bg-card/40 px-8 py-7">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-muted-foreground">{description}</p>
      </section>

      {/* Input card */}
      <section className="rounded-3xl border bg-card p-6">
        <h2 className="text-lg font-semibold">Input</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your topic or keywords to generate content
        </p>

        <div className="mt-4 space-y-2">
          <label className="text-sm font-medium">Topic or Keywords</label>
          <Textarea
            placeholder={placeholder}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="min-h-40"
          />
        </div>

        <div className="mt-4 space-y-2">
          <label className="text-sm font-medium">Language</label>
          <Select value={languageLabel} onValueChange={setLanguageLabel}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Bahasa Indonesia">Bahasa Indonesia</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={onGenerate}
          disabled={loading || !topic.trim()}
          className="mt-6 h-12 w-full rounded-full"
        >
          {loading ? "Generating..." : "Generate"}
        </Button>

        {error && (
          <div className="mt-4 rounded-2xl border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
      </section>

      {/* Results */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Results</h2>

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
