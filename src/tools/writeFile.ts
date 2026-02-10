import type { ToolResult } from "../types/types";
import { isPathSafe, getSafePath } from "../utils/pathValidation";

export const writeFile = async (path: string, content: string): Promise<ToolResult> => {
  if (!isPathSafe(path)) {
    return { success: false, output: "❌ Path no permitido (fuera del proyecto)" };
  }
  
  const safePath = getSafePath(path);
  
  try {
    await Bun.write(safePath, content);
    return { success: true, output: `📄 Archivo creado: ${path}` };
  } catch (err: any) {
    return { success: false, output: `❌ Error escribiendo archivo: ${err.message}` };
  }
};