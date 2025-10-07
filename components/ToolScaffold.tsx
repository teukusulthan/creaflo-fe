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

type Props = {
  title: string;
  description: string;
  placeholder: string;
};

export function ToolScaffold({ title, description, placeholder }: Props) {
  const [topic, setTopic] = React.useState("");
  const [language, setLanguage] = React.useState("English");
  const [results, setResults] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);

  const onGenerate = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800)); // simulasi delay
    setResults([
      `✨ ${topic} — idea 1 generated successfully.`,
      `🔥 ${topic} — idea 2 with creative twist.`,
      `💡 ${topic} — idea 3 that stands out.`,
    ]);
    setLoading(false);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const onRegenerate = () => onGenerate();

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
          <Select value={language} onValueChange={setLanguage}>
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
