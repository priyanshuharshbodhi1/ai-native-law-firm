import http from "node:http";
import { ndaBuilderAgent } from "./agents/ndaAgent.js";
import draftSample from "../samples/draft-input.json" with { type: "json" };
import reviewSample from "../samples/review-input.json" with { type: "json" };

const port = Number(process.env.PORT || 3007);

async function readJson(req: http.IncomingMessage) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf-8"));
}

function send(res: http.ServerResponse, status: number, payload: unknown) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(payload, null, 2));
}

function sendHtml(res: http.ServerResponse, html: string) {
  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(html);
}

function homePage() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>NDA Builder Agent</title>
    <style>
      :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      body { margin: 0; background: #f7f8fa; color: #15171a; }
      main { max-width: 980px; margin: 0 auto; padding: 40px 24px; }
      h1 { margin: 0 0 8px; font-size: 34px; letter-spacing: 0; }
      p { color: #505862; line-height: 1.55; }
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; margin-top: 24px; }
      section { background: white; border: 1px solid #dfe3e8; border-radius: 8px; padding: 18px; }
      h2 { margin: 0 0 8px; font-size: 18px; }
      button { appearance: none; border: 0; border-radius: 6px; background: #181c20; color: white; font-weight: 650; padding: 10px 12px; cursor: pointer; }
      button + button { margin-left: 8px; }
      pre { white-space: pre-wrap; overflow-wrap: anywhere; background: #101418; color: #edf2f7; border-radius: 8px; padding: 16px; min-height: 180px; max-height: 420px; overflow: auto; }
      code { background: #edf0f3; padding: 2px 5px; border-radius: 4px; }
      .muted { color: #66707b; font-size: 14px; }
    </style>
  </head>
  <body>
    <main>
      <h1>NDA Builder Agent</h1>
      <p>Local lawyer-in-the-loop API for drafting NDAs and reviewing incoming agreements. This is a development test page; final legal output still needs lawyer review.</p>
      <p class="muted">API routes: <code>GET /health</code>, <code>POST /draft</code>, <code>POST /review</code></p>
      <div class="grid">
        <section>
          <h2>1. Health</h2>
          <p>Checks whether the server is alive.</p>
          <button onclick="callHealth()">Run health check</button>
        </section>
        <section>
          <h2>2. Draft NDA</h2>
          <p>Uses the sample mutual SaaS NDA input and returns generated markdown.</p>
          <button onclick="callDraft()">Generate sample NDA</button>
        </section>
        <section>
          <h2>3. Review Agreement</h2>
          <p>Uses the sample agreement and returns risk issues plus suggested redlines.</p>
          <button onclick="callReview()">Review sample agreement</button>
        </section>
      </div>
      <h2 style="margin-top: 28px;">Output</h2>
      <pre id="output">Click a button to test the local agent.</pre>
    </main>
    <script>
      const output = document.getElementById("output");
      const draftSample = ${JSON.stringify(draftSample)};
      const reviewSample = ${JSON.stringify(reviewSample)};
      function show(value) {
        output.textContent = typeof value === "string" ? value : JSON.stringify(value, null, 2);
      }
      async function callHealth() {
        const res = await fetch("/health");
        show(await res.json());
      }
      async function callDraft() {
        const res = await fetch("/draft", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(draftSample) });
        const data = await res.json();
        show({ workflow: data.workflow, title: data.draftMarkdown.split("\\n")[0], missingContextQuestions: data.missingContextQuestions, draftMarkdown: data.draftMarkdown });
      }
      async function callReview() {
        const res = await fetch("/review", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(reviewSample) });
        const data = await res.json();
        show({ workflow: data.workflow, summary: data.summary, issues: data.issues, negotiationPoints: data.negotiationPoints });
      }
    </script>
  </body>
</html>`;
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "GET" && (req.url === "/" || req.url === "/index.html")) {
      sendHtml(res, homePage());
      return;
    }

    if (req.method === "GET" && req.url === "/health") {
      send(res, 200, { ok: true, service: "nda-builder-agent" });
      return;
    }

    if (req.method === "POST" && req.url === "/draft") {
      send(res, 200, ndaBuilderAgent.draft(await readJson(req)));
      return;
    }

    if (req.method === "POST" && req.url === "/review") {
      send(res, 200, ndaBuilderAgent.review(await readJson(req)));
      return;
    }

    send(res, 404, { error: "Not found" });
  } catch (error) {
    send(res, 400, { error: error instanceof Error ? error.message : "Unknown error" });
  }
});

server.listen(port, () => {
  console.log(`NDA Builder Agent API running on http://localhost:${port}`);
});
