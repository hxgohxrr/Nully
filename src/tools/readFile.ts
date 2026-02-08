import { existsSync } from "fs";
import type { ToolResult } from "../types/types";

export const readFile = async (path: string): Promise<ToolResult> => {
  if (!path.startsWith("./") || path.includes("..")) return { success: false, output: "❌ Path no permitido" };
  if (!existsSync(path)) return { success: false, output: "❌ Archivo no encontrado" };
  const content = await Bun.file(path).text();
  return { success: true, output: content };
};