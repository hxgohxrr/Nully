import ollama from "ollama";

type ThinkLevel = "low" | "medium" | "high"

const classifyThinking = async (
  prompt: string,
  model = "gpt-oss"  // Parámetro configurable
): Promise<ThinkLevel> => {
  const res = await ollama.generate({
    model,  // Usar parámetro en lugar de hardcodear
    prompt: `
Decide reasoning level.
Answer ONLY: low, medium or high.

Prompt:
${prompt}
`,
    options: { temperature: 0 }
  })

  const level = res.response.trim().toLowerCase()

  if (level === "low" || level === "medium" || level === "high") {
    return level
  }

  return "medium"
}


export default classifyThinking;