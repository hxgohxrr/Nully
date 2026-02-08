import { existsSync } from "fs"

const PATH = "./memory.json"

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
  await Bun.write(PATH, JSON.stringify(memory, null, 2))
}