import { spawn } from "bun"
import { c } from "./colors"

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

  spawn(["ollama", "serve"], {
    stdout: "ignore",
    stderr: "ignore",
    detached: true,
  })

  for (let i = 0; i < 10; i++) {
    await new Promise(r => setTimeout(r, 500))
    if (await isOllamaRunning()) return true
  }

  return false
}

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
    spawn(["ollama", "pull", model], { stdout: "inherit", stderr: "inherit" })
  } else {
    console.log(c.green + `[${new Date().toLocaleTimeString()}] ✅ Modelo ${model} ya está descargado` + c.reset)
  }
}