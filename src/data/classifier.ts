import ollama from "ollama";

type ThinkLevel = "low" | "medium" | "high"

const classifyThinking = async (prompt: string): Promise<ThinkLevel> => {
  const res = await ollama.generate({
    model: "gpt-oss",
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