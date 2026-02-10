import { spawn } from "bun"
import { c } from "./colors"

let ollamaPid: number | null = null;

async function commandExists(cmd: string): Promise<boolean> {
  try {
    const p = spawn([cmd, "--version"], {
      stdout: "ignore",
      stderr: "ignore",
    })
    await p.exited
    return true
  } catch {
    return false
  }
}

async function isOllamaRunning(): Promise<boolean> {
  try {
    const res = await fetch("http://127.0.0.1:11434/api/tags", {
      method: "GET",
    })
    return res.ok
  } catch {
    return false
  }
}

async function startOllama() {
  console.log(c.yellow + `[${new Date().toLocaleTimeString()}] 🚀 Iniciando Ollama...` + c.reset)

  const proc = spawn(["ollama", "serve"], {
    stdout: "ignore",
    stderr: "ignore",
    detached: true,
  })
  
  // Guardar PID para cleanup posterior
  ollamaPid = proc.pid;

  for (let i = 0; i < 10; i++) {
    await new Promise(r => setTimeout(r, 500))
    if (await isOllamaRunning()) return true
  }

  return false
}

// Cleanup handler para matar Ollama al cerrar Nully
process.on("exit", () => {
  if (ollamaPid) {
    try {
      process.kill(ollamaPid);
      console.log(c.gray + `[${new Date().toLocaleTimeString()}] 🛑 Ollama detenido` + c.reset);
    } catch {
      // Proceso ya no existe, ignorar
    }
  }
});

export async function ensureOllama() {
  if (!(await commandExists("ollama"))) {
    console.log(
      c.red +
        `[${new Date().toLocaleTimeString()}] ❌ Ollama no está instalado.\n👉 https://ollama.com/download` +
        c.reset
    )
    process.exit(1)
  }

  if (await isOllamaRunning()) {
    console.log(c.green + `[${new Date().toLocaleTimeString()}] ✅ Ollama está activo` + c.reset)
    return
  }

  const ok = await startOllama()
  if (!ok) {
    console.log(
      c.red +
        `[${new Date().toLocaleTimeString()}] ❌ No se pudo iniciar Ollama automáticamente` +
        c.reset
    )
    process.exit(1)
  }

  console.log(c.green + `[${new Date().toLocaleTimeString()}] ✅ Ollama iniciado correctamente` + c.reset)
}

export async function ensureModel(model = "gpt-oss") {
  const res = await fetch("http://127.0.0.1:11434/api/tags")
  const data: any = await res.json()
  const exists = data.models?.some((m: any) => m.name.includes(model))

  if (!exists) {
    console.log(c.yellow + `[${new Date().toLocaleTimeString()}] ⬇️ Descargando modelo ${model}...` + c.reset)
    const proc = spawn(["ollama", "pull", model], { stdout: "inherit", stderr: "inherit" })
    await proc.exited;
  } else {
    console.log(c.green + `[${new Date().toLocaleTimeString()}] ✅ Modelo ${model} ya está descargado` + c.reset)
  }
}