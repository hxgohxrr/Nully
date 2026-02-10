import { existsSync } from "fs";
import type { ToolResult } from "../types/types";
import { isPathSafe, getSafePath } from "../utils/pathValidation";

export const readFile = async (path: string): Promise<ToolResult> => {
  if (!isPathSafe(path)) {
    return { success: false, output: "❌ Path no permitido (fuera del proyecto)" };
  }
  
  const safePath = getSafePath(path);
  
  if (!existsSync(safePath)) {
    return { success: false, output: "❌ Archivo no encontrado" };
  }
  
  try {
    const content = await Bun.file(safePath).text();
    return { success: true, output: content };
  } catch (err: any) {
    return { success: false, output: `❌ Error leyendo archivo: ${err.message}` };
  }
};