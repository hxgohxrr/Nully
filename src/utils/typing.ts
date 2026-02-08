import { c } from "./colors"

export async function typeWrite(text: string, delay = 15) {
  for (const char of text) {
    process.stdout.write(c.reset + char)
    await Bun.sleep(delay)
  }
  process.stdout.write("\n")
}

export async function typeWriteThoughts(text: string, speed = 25) {
  for (const char of text) {
    process.stdout.write(char)
    await new Promise(res => setTimeout(res, speed))
  }
  process.stdout.write("\n")
}