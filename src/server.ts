import http from "node:http";
import { handleAppRequest } from "./httpApp.js";

const port = Number(process.env.PORT || 3007);

async function readJson(req: http.IncomingMessage) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf-8"));
}

const server = http.createServer(async (req, res) => {
  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const appResponse = await handleAppRequest(req.method, req.url, hasBody ? await readJson(req) : undefined);
  res.writeHead(appResponse.status, appResponse.headers);
  res.end(appResponse.body);
});

server.listen(port, () => {
  console.log(`NDA Builder Agent API running on http://localhost:${port}`);
});
