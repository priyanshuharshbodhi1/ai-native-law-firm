import type { AiSettings, DraftNdaOutput, ReviewAgreementOutput } from "../domain.js";

export interface AiDraftResult {
  text: string;
  provider: string;
  model: string;
}

export interface AiReviewResult {
  memo: string;
  provider: string;
  model: string;
}

interface ChatMessage {
  role: "system" | "user";
  content: string;
}

const defaultModels: Record<AiSettings["provider"], string> = {
  none: "",
  openai: "gpt-5.5",
  anthropic: "claude-sonnet-4-7",
  gemini: "gemini-3.1-pro-preview",
};

export function hasUsableAiSettings(settings?: AiSettings) {
  return Boolean(settings?.enabled && settings.provider !== "none" && settings.apiKey?.trim());
}

export async function polishDraftWithAi(
  draft: DraftNdaOutput,
  settings?: AiSettings,
): Promise<AiDraftResult | undefined> {
  if (!hasUsableAiSettings(settings)) return undefined;
  const activeSettings = settings as AiSettings & { apiKey: string };

  const provider = activeSettings.provider;
  const model = activeSettings.model?.trim() || defaultModels[provider];
  const prompt = [
    "Rewrite the following NDA draft into a polished, lawyer-reviewable NDA.",
    "Keep the same parties, purpose, governing law, term, survival period, and core commercial positions.",
    "Do not invent missing facts. Use placeholders only where information is missing.",
    "Use clean legal document formatting with numbered clauses and signature blocks.",
    "Return only the NDA text. Do not include explanations or markdown fences.",
    "",
    draft.draftMarkdown,
  ].join("\n");

  const text = await callProvider(provider, model, activeSettings.apiKey, [
    {
      role: "system",
      content:
        "You assist licensed lawyers with NDA drafting. You do not provide final legal advice. You preserve user facts and make language clearer, more complete, and easier for a lawyer to review.",
    },
    { role: "user", content: prompt },
  ]);

  return { text, provider, model };
}

export async function createReviewMemoWithAi(
  review: ReviewAgreementOutput,
  agreementText: string,
  settings?: AiSettings,
): Promise<AiReviewResult | undefined> {
  if (!hasUsableAiSettings(settings)) return undefined;
  const activeSettings = settings as AiSettings & { apiKey: string };

  const provider = activeSettings.provider;
  const model = activeSettings.model?.trim() || defaultModels[provider];
  const prompt = [
    "Prepare a concise lawyer review memo for this NDA.",
    "Use the rule-based issues as the starting point. Add practical drafting/negotiation observations if important.",
    "Do not say the agreement is approved. Keep human lawyer review required.",
    "Use simple headings: Overall View, Main Risks, Suggested Edits, Questions for Client.",
    "",
    "Rule-based findings:",
    JSON.stringify(
      {
        summary: review.summary,
        issues: review.issues,
        negotiationPoints: review.negotiationPoints,
      },
      null,
      2,
    ),
    "",
    "Agreement text:",
    agreementText.slice(0, 30000),
  ].join("\n");

  const memo = await callProvider(provider, model, activeSettings.apiKey, [
    {
      role: "system",
      content:
        "You assist licensed lawyers with contract review. You are careful, practical, and always preserve human lawyer approval.",
    },
    { role: "user", content: prompt },
  ]);

  return { memo, provider, model };
}

async function callProvider(
  provider: AiSettings["provider"],
  model: string,
  apiKey: string,
  messages: ChatMessage[],
) {
  if (provider === "openai") return callOpenAi(model, apiKey, messages);
  if (provider === "anthropic") return callAnthropic(model, apiKey, messages);
  if (provider === "gemini") return callGemini(model, apiKey, messages);
  throw new Error("Choose an AI provider before using AI drafting.");
}

async function callOpenAi(model: string, apiKey: string, messages: ChatMessage[]) {
  const input = messages.map((message) => ({
    role: message.role === "system" ? "developer" : "user",
    content: message.content,
  }));

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      input,
    }),
  });
  const data = await parseProviderResponse(response);
  const text =
    data.output_text ||
    data.output
      ?.flatMap?.((item: { content?: Array<{ text?: string }> }) => item.content ?? [])
      ?.map?.((content: { text?: string }) => content.text ?? "")
      ?.join("");
  if (!text) throw new Error("OpenAI did not return text.");
  return String(text).trim();
}

async function callAnthropic(model: string, apiKey: string, messages: ChatMessage[]) {
  const system = messages.find((message) => message.role === "system")?.content;
  const userMessages = messages
    .filter((message) => message.role === "user")
    .map((message) => ({ role: "user", content: message.content }));

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 6000,
      system,
      messages: userMessages,
    }),
  });
  const data = await parseProviderResponse(response);
  const text = data.content?.find?.((item: { type?: string }) => item.type === "text")?.text;
  if (!text) throw new Error("Claude did not return text.");
  return String(text).trim();
}

async function callGemini(model: string, apiKey: string, messages: ChatMessage[]) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        generationConfig: { temperature: 0.2 },
        systemInstruction: {
          parts: messages
            .filter((message) => message.role === "system")
            .map((message) => ({ text: message.content })),
        },
        contents: messages
          .filter((message) => message.role === "user")
          .map((message) => ({ role: "user", parts: [{ text: message.content }] })),
      }),
    },
  );
  const data = await parseProviderResponse(response);
  const text = data.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? "").join("");
  if (!text) throw new Error("Gemini did not return text.");
  return String(text).trim();
}

async function parseProviderResponse(response: Response) {
  const text = await response.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const message = data.error?.message || data.error || data.raw || response.statusText;
    throw new Error(`AI provider error: ${message}`);
  }

  return data;
}
