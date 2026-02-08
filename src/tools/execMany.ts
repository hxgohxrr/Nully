import type { ToolResult } from "../types/types";

const ALLOWED_COMMANDS = ["bun","node","npm","pnpm","yarn","git","ls","dir"];

export const execMany = async (commands: string[]): Promise<ToolResult> => {
  let output = "";
  for (const cmd of commands) {
    const base: any = cmd.split(" ")[0];
    if (!ALLOWED_COMMANDS.includes(base)) { output += `❌ Bloqueado: ${cmd}\n`; continue; }
    const proc = Bun.spawn(cmd.split(" "), { stdout: "pipe", stderr: "pipe" });
    const out = await new Response(proc.stdout).text();
    const err = await new Response(proc.stderr).text();
    output += `$ ${cmd}\n${out || err}\n`;
  }
  return { success: true, output };
};