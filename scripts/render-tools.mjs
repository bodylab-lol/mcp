// Renders TOOLS.md from tools.json, which is generated from the server's
// source (packages/mcp in the private monorepo: `npm run tools`).
//
//   node scripts/render-tools.mjs

import { readFileSync, writeFileSync } from "node:fs";

const manifest = JSON.parse(readFileSync(new URL("../tools.json", import.meta.url), "utf8"));

// One row per argument. An array of objects (record_lab_results' `results`)
// also gets a row for each of its items' fields, as `results[].marker`, so
// what each item takes is in the reference and not only in tools.json.
function rows(schema, prefix = "") {
  const required = new Set(schema.required ?? []);
  return Object.entries(schema.properties ?? {}).flatMap(([name, p]) => {
    // "or", not "|", which would end the table cell.
    const type = p.type ?? (p.anyOf ? p.anyOf.map((a) => a.type).filter(Boolean).join(" or ") : "");
    const range = [
      p.minimum !== undefined ? `min ${p.minimum}` : "",
      p.maximum !== undefined ? `max ${p.maximum}` : "",
      p.minItems !== undefined ? `at least ${p.minItems}` : "",
      p.maxItems !== undefined ? `at most ${p.maxItems}` : "",
      p.default !== undefined ? `default ${JSON.stringify(p.default)}` : "",
    ]
      .filter(Boolean)
      .join(", ");
    const desc = (p.description ?? "").replace(/\|/g, "\\|");
    const row = `| \`${prefix}${name}\` | ${type}${required.has(name) && p.default === undefined ? "" : " (optional)"} | ${[desc, range].filter(Boolean).join(" ")} |`;
    const items = p.type === "array" && p.items?.type === "object" ? rows(p.items, `${prefix}${name}[].`) : [];
    return [row, ...items];
  });
}

function params(schema) {
  const all = rows(schema);
  if (all.length === 0) return "_No arguments._\n";
  return ["| Argument | Type | |", "| --- | --- | --- |", ...all].join("\n") + "\n";
}

const out = [
  "# Tools",
  "",
  "Generated from [`tools.json`](tools.json) by `node scripts/render-tools.mjs`. Every tool returns structured content matching its `outputSchema` in `tools.json`, plus the same JSON as text. Every tool is read-only except where it says it writes, and a tool is only available when the athlete allowed its scope.",
  "",
  "Quantities are SI with the unit in the field name (`durationS`, `distanceM`, `weightKg`, `avgPowerW`); dates like `2026-09-13` are days on the athlete's calendar; instants are ISO-8601 UTC.",
  "",
];
for (const t of manifest.tools) {
  // Every write tool was additive until one arrived that can land on a value
  // already there, and a reader told "can't change or delete it" about that
  // one has been told the opposite of the truth. `replaces` comes from the
  // server's own manifest, so this sentence can't drift from what the tool
  // actually does.
  const access =
    t.readOnly === false
      ? t.replaces
        ? "Writes: can change what's already set for today. It can't delete anything, and never touches your history."
        : "Writes: adds data, and can't change or delete it."
      : "Read-only.";
  out.push(`## \`${t.name}\` — ${t.title}`, "", t.description, "", `Scope: \`${t.scope}\`. ${access}`, "", params(t.inputSchema));
}
out.push("# Prompts", "");
for (const p of manifest.prompts) out.push(`- **\`${p.name}\`** — ${p.title}: ${p.description}`);
out.push("", "# Server instructions", "", "```", manifest.server.instructions, "```", "");
writeFileSync(new URL("../TOOLS.md", import.meta.url), out.join("\n"));
console.log("wrote TOOLS.md");
