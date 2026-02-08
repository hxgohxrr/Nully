import { readFileSync } from "fs"
import type { ToolResult } from "../types/types"

const CONFIG_PATH = "./nully.config.json"

export async function listTools(): Promise<ToolResult> {
  try {
    const raw = readFileSync(CONFIG_PATH, "utf-8")
    const config = JSON.parse(raw)
    if (!config.tools || !Array.isArray(config.tools)) {
      return { success: false, output: "❌ No se encontraron herramientas en la config" }
    }

    const toolsList = config.tools.map((t: any) => ({
      name: t.name,
      description: t.description,
      capabilities: t.capabilities || [],
    }))

    return { success: true, output: JSON.stringify(toolsList) }
  } catch (err: any) {
    return { success: false, output: `❌ Error leyendo config: ${err.message}` }
  }
}