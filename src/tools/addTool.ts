import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import type { ToolResult } from "../types/types";
import type { nullyConfig } from "../types/config";

const FORBIDDEN_CODE = [
  "child_process",
  "process.",
  "Bun.spawn",
  "Bun.$",
  "fs.",
  "require(",
  "eval(",
  "import(\"fs\"",
  "import('fs'",
];

export const addTool = async (
  name: string,
  description: string,
  capabilities: string[],
  code: string,
  config: nullyConfig
): Promise<ToolResult> => {

  if (!name || !name.match(/^[a-zA-Z0-9_-]+$/)) 
    return { success: false, output: "❌ Nombre de tool inválido" }

  if (!code.includes("export default"))
    return { success: false, output: "❌ La tool debe usar export default" }

  if (FORBIDDEN_CODE.some(k => code.includes(k)))
    return { success: false, output: "❌ Código contiene APIs prohibidas" }

  if (!config.tools) config.tools = [];

  const dir = "./metatools";
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const file = join(dir, `${name}.ts`);
  writeFileSync(file, code);

  const exists = config.tools.some(t => t.name === name);
  if (!exists) {
    config.tools.push({
      name,
      description,
      capabilities,
    });

    await Bun.write(
      "./nully.config.json",
      JSON.stringify(config, null, 2)
    );
  }

  return {
    success: true,
    output: `🧩 Tool '${name}' añadida con capabilities: ${capabilities.join(", ")}`
  };
};