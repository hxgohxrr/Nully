import { existsSync } from "fs";
import type { ToolResult } from "../types/types";
import { isPathSafe, getSafePath } from "../utils/pathValidation";

export const fixError = async (
  file: string,
  before: string,
  after: string
): Promise<ToolResult> => {
  // Validar path
  if (!isPathSafe(file)) {
    return { success: false, output: "❌ Path no permitido (fuera del proyecto)" };
  }
  
  const safePath = getSafePath(file);
  
  if (!existsSync(safePath)) {
    return { success: false, output: "❌ Archivo no encontrado" };
  }
  
  try {
    // Leer contenido original
    const content = await Bun.file(safePath).text();
    
    // Verificar que el texto a reemplazar existe
    if (!content.includes(before)) {
      return { 
        success: false, 
        output: "❌ El texto a reemplazar no existe en el archivo" 
      };
    }
    
    // Crear backup
    const backupPath = `${safePath}.backup`;
    await Bun.write(backupPath, content);
    
    // Aplicar fix (replaceAll para todas las ocurrencias)
    const fixed = content.replaceAll(before, after);
    
    // Escribir archivo modificado
    await Bun.write(safePath, fixed);
    
    return { 
      success: true, 
      output: `🔧 Archivo corregido: ${file}\n📦 Backup creado: ${file}.backup` 
    };
  } catch (err: any) {
    return { 
      success: false, 
      output: `❌ Error corrigiendo archivo: ${err.message}` 
    };
  }
};