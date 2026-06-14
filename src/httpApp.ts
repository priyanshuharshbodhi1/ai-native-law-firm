import { ndaBuilderAgent } from "./agents/ndaAgent.js";
import { homePage } from "./ui.js";

export interface AppResponse {
  status: number;
  headers: Record<string, string>;
  body: string;
}

export async function handleAppRequest(method = "GET", rawUrl = "/", body?: unknown): Promise<AppResponse> {
  const url = new URL(rawUrl, "http://localhost");
  const readMethod = method === "HEAD" ? "GET" : method;

  try {
    if (readMethod === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
      return html(homePage());
    }

    if (readMethod === "GET" && url.pathname === "/health") {
      return json(200, { ok: true, service: "nda-builder-agent" });
    }

    if (readMethod === "POST" && url.pathname === "/draft") {
      return json(200, await ndaBuilderAgent.draftWithAi(body as any));
    }

    if (readMethod === "POST" && url.pathname === "/review") {
      return json(200, await ndaBuilderAgent.reviewWithAi(body as any));
    }

    return json(404, { error: "Not found" });
  } catch (error) {
    return json(400, { error: error instanceof Error ? error.message : "Unknown error" });
  }
}

function json(status: number, payload: unknown): AppResponse {
  return {
    status,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload, null, 2),
  };
}

function html(body: string): AppResponse {
  return {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
    body,
  };
}
