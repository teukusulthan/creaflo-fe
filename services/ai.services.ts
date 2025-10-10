import { api } from "@/lib/api";

export type Lang = "id" | "en";
export type AiTool = "caption" | "hook" | "idea" | "hashtag";

export type ApiEnvelope<T> = {
  code: number;
  status: "success" | "fail" | "error";
  message: string;
  data: T;
};

export type AiResult = {
  tool: AiTool;
  lang: Lang;
  output: string;
  model: string;
  generationId: string;
  isSaved: boolean;
};

export type AiData = { result: AiResult };
export type AiInput = { input: string; lang?: Lang };

const defaultLang: Lang = "en";

function normalizeResult(raw: any): AiResult {
  if (raw && typeof raw === "object" && "result" in raw) {
    const result = (raw as any).result;
    return {
      tool: result.tool ?? "idea",
      lang: result.lang ?? defaultLang,
      output: result.output ?? "",
      model: result.model ?? "unknown",
      generationId: result.generationId ?? "",
      isSaved: !!result.isSaved,
    };
  }

  if (raw && typeof raw === "object" && "tool" in raw && "output" in raw) {
    return {
      tool: raw.tool ?? "idea",
      lang: raw.lang ?? defaultLang,
      output: raw.output ?? "",
      model: raw.model ?? "unknown",
      generationId: raw.generationId ?? "",
      isSaved: !!raw.isSaved,
    };
  }

  if (raw && typeof raw === "object" && typeof raw.result === "string") {
    try {
      const parsed = JSON.parse(raw.result);
      return {
        tool: parsed.tool ?? "idea",
        lang: parsed.lang ?? defaultLang,
        output: parsed.output ?? String(raw.result),
        model: parsed.model ?? "unknown",
        generationId: parsed.generationId ?? "",
        isSaved: !!parsed.isSaved,
      };
    } catch {
      return {
        tool: "idea",
        lang: defaultLang,
        output: String(raw.result),
        model: "unknown",
        generationId: "",
        isSaved: false,
      };
    }
  }

  return {
    tool: "idea",
    lang: defaultLang,
    output: "",
    model: "unknown",
    generationId: "",
    isSaved: false,
  };
}

async function postAndParse(
  url: string,
  payload: AiInput,
  opts?: { signal?: AbortSignal }
): Promise<AiResult> {
  const body = { input: payload.input, lang: payload.lang ?? defaultLang };
  const { data } = await api.post<ApiEnvelope<AiData | { result: string }>>(
    url,
    body,
    { signal: opts?.signal }
  );
  return normalizeResult(data.data);
}

export async function generateCaption(
  payload: AiInput,
  opts?: { signal?: AbortSignal }
) {
  return postAndParse("/ai/caption", payload, opts);
}

export async function generateHook(
  payload: AiInput,
  opts?: { signal?: AbortSignal }
) {
  return postAndParse("/ai/hook", payload, opts);
}

export async function generateIdeas(
  payload: AiInput,
  opts?: { signal?: AbortSignal }
) {
  return postAndParse("/ai/ideas", payload, opts);
}

export async function generateHashtags(
  payload: AiInput,
  opts?: { signal?: AbortSignal }
) {
  return postAndParse("/ai/hashtags", payload, opts);
}

export async function generateGeneric(
  tool: AiTool,
  payload: AiInput,
  opts?: { signal?: AbortSignal }
) {
  const body = {
    tool,
    input: payload.input,
    lang: payload.lang ?? defaultLang,
  };
  const { data } = await api.post<ApiEnvelope<AiData | { result: string }>>(
    "/ai/completions",
    body,
    { signal: opts?.signal }
  );
  return normalizeResult(data.data);
}
