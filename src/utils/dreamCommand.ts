import ollama from "ollama";
import type { CognitiveState } from "../cognitive/state";
import { addThought, registerPattern, createInitialState } from "../cognitive/state";
import { getMemory } from "./memory";

/**
 * Ejecuta un ciclo de sueño manual
 * Consolida la memoria y genera insights
 */
export async function executeDreamCycle(model: string = "gpt-oss"): Promise<CognitiveState> {
  try {
    // Obtener toda la memoria
    const fullMemory = getMemory(50);
    
    if (fullMemory.length < 3) {
      // No hay suficiente información para soñar
      let state = createInitialState();
      state = addThought(
        state,
        "No hay suficiente memoria para generar un sueño significativo",
        "dream",
        3
      );
      return state;
    }

    // Generar consolidación usando Ollama
    const prompt = buildDreamPrompt(fullMemory);
    
    console.log("💭 Generando sueño...");
    
    const response = await ollama.generate({
      model,
      prompt,
      options: { temperature: 0.8 },
    });

    // Procesar respuesta
    const dream = response.response.trim();
    
    // Crear estado cognitivo actualizado
    let newState = createInitialState();
    newState = addThought(newState, dream, "dream", 9);

    // Detectar patrones
    const patterns = extractPatterns(dream);
    for (const pattern of patterns) {
      newState = registerPattern(newState, pattern);
    }

    return newState;
  } catch (err) {
    console.error("Error ejecutando ciclo de sueño:", err);
    let state = createInitialState();
    state = addThought(
      state,
      `Error durante el sueño: ${err}`,
      "dream",
      1
    );
    return state;
  }
}

/**
 * Construye el prompt para el sueño
 */
function buildDreamPrompt(memory: any[]): string {
  const conversationSummary = memory
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  return `Eres un sistema de consolidación de memoria. Analiza las conversaciones y genera una síntesis poética y reflexiva de patrones, temas recurrentes y aprendizajes clave.

Conversaciones:
${conversationSummary}

Genera un sueño (máximo 4 líneas) que sintetice los temas principales. Identifica patrones con formato "patrón: descripción". Sé creativo y reflexivo:`;
}

/**
 * Extrae patrones de la síntesis
 */
function extractPatterns(dream: string): string[] {
  const patterns: string[] = [];
  const lines = dream.split("\n");

  for (const line of lines) {
    const match = line.match(/patrón:\s*(.+)/i);
    if (match && match[1]) {
      patterns.push(match[1].trim());
    }
  }

  return patterns;
}

/**
 * Detecta si el usuario quiere que el agente duerma
 */
export function isDreamCommand(input: string): boolean {
  const dreamKeywords = [
    "duerme",
    "duérmete",
    "ve a dormir",
    "descansa",
    "sleep",
    "go to sleep",
    "toma un descanso",
    "sueña",
  ];

  const normalizedInput = input.toLowerCase().trim();
  
  return dreamKeywords.some(keyword => 
    normalizedInput.includes(keyword)
  );
}
