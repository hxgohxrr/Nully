import { existsSync } from "fs"

const PATH = "./memory.json"
const MAX_MESSAGES = 1000;  // Límite para prevenir memory leak

type MemoryMessage = {
  role: "user" | "assistant"
  content: string,
  date: string
}

let memory: MemoryMessage[] = []

if (existsSync(PATH)) {
  memory = JSON.parse(await Bun.file(PATH).text())
}

export function getMemory(limit = 10) {
  return memory.slice(-limit)
}

export async function saveMessage(role: "user" | "assistant", content: string) {
  memory.push({ role, content, date: new Date().toISOString() })
  
  // Limitar tamaño de memoria para prevenir crecimiento ilimitado
  if (memory.length > MAX_MESSAGES) {
    memory = memory.slice(-MAX_MESSAGES);
  }
  
  await Bun.write(PATH, JSON.stringify(memory, null, 2))
}