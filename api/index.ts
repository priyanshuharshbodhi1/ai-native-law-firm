import { handleAppRequest } from "../src/httpApp.js";

export default async function handler(req: any, res: any) {
  const appResponse = await handleAppRequest(req.method, vercelPath(req), await requestBody(req));
  res.writeHead(appResponse.status, appResponse.headers);
  res.end(req.method === "HEAD" ? "" : appResponse.body);
}

function vercelPath(req: any) {
  const path = req.query?.path;
  if (Array.isArray(path)) return `/${path.join("/")}`;
  if (typeof path === "string" && path.length > 0) return path.startsWith("/") ? path : `/${path}`;
  return req.url || "/";
}

async function requestBody(req: any) {
  if (req.method === "GET" || req.method === "HEAD") return undefined;
  if (req.body !== undefined) return parseBody(req.body);

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const text = Buffer.concat(chunks).toString("utf-8");
  return text ? parseBody(text) : undefined;
}

function parseBody(body: unknown) {
  if (typeof body !== "string") return body;
  try {
    return JSON.parse(body);
  } catch {
    return body;
  }
}
