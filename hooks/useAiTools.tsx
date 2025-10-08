"use client";

import * as React from "react";
import type { AiTool, Lang, AiResult } from "@/services/ai.services";
import {
  generateCaption,
  generateHook,
  generateIdeas,
  generateHashtags,
  generateGeneric,
} from "@/services/ai.services";
import { toast } from "sonner";

type State = {
  loading: boolean;
  error?: string;
  result?: AiResult;
};

export function useAiTool(tool: AiTool) {
  const [state, setState] = React.useState<State>({ loading: false });
  const abortRef = React.useRef<AbortController | null>(null);

  const run = React.useCallback(
    async (input: string, lang: Lang = "en") => {
      if (!input?.trim()) {
        toast.error("Input tidak boleh kosong");
        return;
      }

      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      setState({ loading: true, error: undefined, result: undefined });

      try {
        let result: AiResult;

        // Pilihan 1: call per-tool spesifik
        if (tool === "caption") {
          result = await generateCaption(
            { input, lang },
            { signal: controller.signal }
          );
        } else if (tool === "hook") {
          result = await generateHook(
            { input, lang },
            { signal: controller.signal }
          );
        } else if (tool === "idea") {
          result = await generateIdeas(
            { input, lang },
            { signal: controller.signal }
          );
        } else if (tool === "hashtag") {
          result = await generateHashtags(
            { input, lang },
            { signal: controller.signal }
          );
        } else {
          result = await generateGeneric(
            tool,
            { input, lang },
            { signal: controller.signal }
          );
        }

        setState({ loading: false, result });
        return result;
      } catch (err: any) {
        if (err?.name === "CanceledError" || err?.name === "AbortError") {
          return;
        }
        const msg = err?.message || "Gagal menghasilkan output";
        setState({ loading: false, error: msg });
        toast.error(msg);
      } finally {
        abortRef.current = null;
      }
    },
    [tool]
  );

  return { ...state, run };
}
