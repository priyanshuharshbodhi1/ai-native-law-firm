import { readFile } from "node:fs/promises";
import { ndaBuilderAgent } from "./agents/ndaAgent.js";

async function main() {
  const [, , command, inputPath] = process.argv;

  if (!command || !inputPath || !["draft", "review"].includes(command)) {
    console.error("Usage: bun tsx src/cli.ts <draft|review> <input.json>");
    process.exit(1);
  }

  const payload = JSON.parse(await readFile(inputPath, "utf-8"));
  const result = command === "draft" ? ndaBuilderAgent.draft(payload) : ndaBuilderAgent.review(payload);
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
