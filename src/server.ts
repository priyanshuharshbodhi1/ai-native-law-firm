import http from "node:http";
import { ndaBuilderAgent } from "./agents/ndaAgent.js";
import { homePage } from "./ui.js";

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
