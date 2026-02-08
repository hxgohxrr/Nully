import type { ToolResult } from "../types/types";

export const fixError = async (file: string, before: string, after: string): Promise<ToolResult> => {
  const content = await Bun.file(file).text();
  const fixed = content.replace(before, after);
  await Bun.write(file, fixed);
  return { success: true, output: `🔧 Archivo corregido: ${file}` };
};