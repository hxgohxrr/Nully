import { existsSync } from "fs";
import type { CognitiveState } from "./state";
import { createInitialState } from "./state";

const COGNITIVE_STATE_PATH = "./cognitive.json";

/**
 * Carga el estado cognitivo desde el archivo
 */
export async function loadCognitiveState(): Promise<CognitiveState> {
  if (!existsSync(COGNITIVE_STATE_PATH)) {
    return createInitialState();
  }

  try {
    const raw = await Bun.file(COGNITIVE_STATE_PATH).text();
    const parsed = JSON.parse(raw);
    
    // Convertir patterns de objeto a Map
    if (parsed.patterns && typeof parsed.patterns === "object") {
      parsed.patterns = new Map(Object.entries(parsed.patterns));
    }
    
    return parsed as CognitiveState;
  } catch (err) {
    console.error("Error cargando estado cognitivo:", err);
    return createInitialState();
  }
}

/**
 * Guarda el estado cognitivo en el archivo
 */
export async function saveCognitiveState(state: CognitiveState): Promise<void> {
  try {
    // Convertir Map a objeto para JSON
    const serializable = {
      ...state,
      patterns: Object.fromEntries(state.patterns),
    };
    
    await Bun.write(COGNITIVE_STATE_PATH, JSON.stringify(serializable, null, 2));
  } catch (err) {
    console.error("Error guardando estado cognitivo:", err);
  }
}
