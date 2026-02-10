import type { ToolResult } from "../types/types";

const ALLOWED_COMMANDS = ["bun", "node", "npm", "pnpm", "yarn", "git", "ls", "dir"];

// Argumentos peligrosos bloqueados
const DANGEROUS_ARGS = [
  "--upload-pack",
  "--exec",
  "--receive-pack",
  "-c",
  "--config",
  "eval",
  "exec",
];

const COMMAND_TIMEOUT = 30000; // 30 segundos

/**
 * Verifica si un comando contiene argumentos peligrosos
 */
function isDangerousCommand(args: string[]): boolean {
  return args.some(arg => 
    DANGEROUS_ARGS.some(dangerous => 
      arg.toLowerCase().includes(dangerous.toLowerCase())
    )
  );
}

export const execMany = async (commands: string[]): Promise<ToolResult> => {
  let output = "";
  
  for (const cmd of commands) {
    const args = cmd.split(" ").filter(arg => arg.trim() !== "");
    const base = args[0];
    
    // Validar que el comando no esté vacío
    if (!base) {
      output += `❌ Comando vacío\n`;
      continue;
    }
    
    // Validar comando base
    if (!ALLOWED_COMMANDS.includes(base)) {
      output += `❌ Bloqueado: ${cmd} (comando no permitido)\n`;
      continue;
    }
    
    // Validar argumentos peligrosos
    if (isDangerousCommand(args)) {
      output += `❌ Bloqueado: ${cmd} (argumentos peligrosos detectados)\n`;
      continue;
    }
    
    try {
      // Usar array en lugar de string splitting
      const proc = Bun.spawn(args, {
        stdout: "pipe",
        stderr: "pipe",
      });
      
      // Timeout para evitar comandos colgados
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => {
          proc.kill();
          reject(new Error("Timeout"));
        }, COMMAND_TIMEOUT)
      );
      
      const resultPromise = Promise.all([
        new Response(proc.stdout).text(),
        new Response(proc.stderr).text(),
      ]);
      
      const [out, err] = await Promise.race([resultPromise, timeoutPromise]) as [string, string];
      
      output += `$ ${cmd}\n${out || err}\n`;
    } catch (err: any) {
      output += `❌ Error ejecutando ${cmd}: ${err.message}\n`;
    }
  }
  
  return { success: true, output };
};