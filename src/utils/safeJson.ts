import { c } from "./colors"
import ollama from "ollama"
import type { nullyConfig } from "../types/config"

const FIX_PROMPT = (badOutput: string) => `
El siguiente texto NO es JSON válido y rompe el sistema:

"""
${badOutput}
"""

Corrígelo y devuelve SOLO JSON válido, sin explicaciones,
sin markdown, sin texto extra.
Formato obligatorio:
{
  "thoughts": "...",
  "response": "...",
  "actions": []
}
  Si esta vacio o no tiene sentido, devuelve como respuesta:
{
  "thoughts": "No hay información útil para responder, o la respuesta no es clara.",
  "response": "",
  "actions": []
}
y vuelve a intentarlo con la información que tengas. Recuerda, SOLO JSON.
si despues de 3 intentos no puedes generar JSON válido, devuelve un error con el formato:
{
  "thoughts": "No puedo generar una respuesta válida después de varios intentos. El texto original es irreparables.",
  "response": "",
  "actions": []
}
`

export async function parseJSONWithRepair(
  raw: string,
  config: nullyConfig,
  retries = 2
): Promise<any> {
  try {
    return JSON.parse(raw)
  } catch (err) {
    if (retries <= 0) {
      console.error(c.red + `[${new Date().toLocaleTimeString()}] ❌ JSON irrecuperable:` + c.reset)
      console.error(raw)
      throw err
    }

    console.log(
      c.yellow +
        `[${new Date().toLocaleTimeString()}] ⚠ JSON inválido, intentando auto-reparación...` +
        c.reset
    )

    const fix = await ollama.chat({
      model: config.ollamaModel,
      think: "low",
      messages: [
        {
          role: "system",
          content: "Eres un reparador de JSON. Devuelve SOLO JSON.",
        },
        {
          role: "user",
          content: FIX_PROMPT(raw),
        },
      ],
    })

    return parseJSONWithRepair(
      fix.message.content,
      config,
      retries - 1
    )
  }
}