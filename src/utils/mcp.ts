import { existsSync } from "fs"
import type { nullyConfig } from "../types/config"

export async function buildMCPContext(config: nullyConfig): Promise<string> {
  if (!existsSync(config.mcpFile)) return ""

  const raw: any = await Bun.file(config.mcpFile).text()
  const mcp = JSON.parse(raw)

  let ctx = `[MCP]\n`

  if (mcp.mcpServers) {
    for (const [name, srv] of Object.entries(mcp.mcpServers)) {
      //@ts-ignore
      ctx += `- ${name}: ${srv.type} ${srv.url}\n`
    }
  }

  ctx += `[/MCP]\n`
  return ctx
}