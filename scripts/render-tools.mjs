// Renders TOOLS.md from tools.json, which is generated from the server's
// source (packages/mcp in the private monorepo: `npm run tools`).
//
//   node scripts/render-tools.mjs

import { readFileSync, writeFileSync } from "node:fs";

const manifest = JSON.parse(readFileSync(new URL("../tools.json", import.meta.url), "utf8"));

function params(schema) {
  const props = Object.entries(schema.properties ?? {});
  if (props.length === 0) return "_No arguments._\n";
  const required = new Set(schema.required ?? []);
  const rows = props.map(([name, p]) => {
    const type = p.type ?? (p.anyOf ? p.anyOf.map((a) => a.type).filter(Boolean).join(" | ") : "");
    const range = [p.minimum !== undefined ? `min ${p.minimum}` : "", p.maximum !== undefined ? `max ${p.maximum}` : "", p.default !== undefined ? `default ${JSON.stringify(p.default)}` : ""]
      .filter(Boolean)
      .join(", ");
    const desc = (p.description ?? "").replace(/\|/g, "\\|");
    return `| \`${name}\` | ${type}${required.has(name) && p.default === undefined ? "" : " (optional)"} | ${[desc, range].filter(Boolean).join(" ")} |`;
  });
  return ["| Argument | Type | |", "| --- | --- | --- |", ...rows].join("\n") + "\n";
}

const out = [
  "# Tools",
  "",
  "Generated from [`tools.json`](tools.json) by `node scripts/render-tools.mjs`. Every tool is read-only and returns structured content matching its `outputSchema` in `tools.json`, plus the same JSON as text.",
  "",
  "Quantities are SI with the unit in the field name (`durationS`, `distanceM`, `weightKg`, `avgPowerW`); dates like `2026-09-13` are days on the athlete's calendar; instants are ISO-8601 UTC.",
  "",
];
for (const t of manifest.tools) {
  out.push(`## \`${t.name}\` — ${t.title}`, "", t.description, "", `Scope: \`${t.scope}\``, "", params(t.inputSchema));
}
out.push("# Prompts", "");
for (const p of manifest.prompts) out.push(`- **\`${p.name}\`** — ${p.title}: ${p.description}`);
out.push("", "# Server instructions", "", "```", manifest.server.instructions, "```", "");
writeFileSync(new URL("../TOOLS.md", import.meta.url), out.join("\n"));
console.log("wrote TOOLS.md");
