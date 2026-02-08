import type { ToolResult } from "../types/types";
export const writeFile = async (path: string, content: string): Promise<ToolResult> => {
  if (!path.startsWith("./") || path.includes("..")) return { success: false, output: "❌ Path no permitido" };
  await Bun.write(path, content);
  return { success: true, output: `📄 Archivo creado: ${path}` };
};