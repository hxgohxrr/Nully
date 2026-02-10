/**
 * Estado cognitivo del agente Nully
 * Representa el estado interno de pensamientos, reflexiones y patrones detectados
 */

export type Thought = {
  id: string;
  timestamp: string;
  content: string;
  type: "reflection" | "insight" | "pattern" | "dream";
  context?: string;
  importance: number; // 0-10
};

export type CognitiveState = {
  thoughts: Thought[];
  insights: string[];
  patterns: Map<string, number>; // patrón -> frecuencia
  lastThoughtCycle: string;
  lastDreamCycle: string;
  cycleCount: {
    thoughts: number;
    dreams: number;
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: string;
  };
};

/**
 * Crea un estado cognitivo inicial
 */
export function createInitialState(): CognitiveState {
  return {
    thoughts: [],
    insights: [],
    patterns: new Map(),
    lastThoughtCycle: new Date().toISOString(),
    lastDreamCycle: new Date().toISOString(),
    cycleCount: {
      thoughts: 0,
      dreams: 0,
    },
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: "1.0.0",
    },
  };
}

/**
 * Añade un pensamiento al estado cognitivo
 */
export function addThought(
  state: CognitiveState,
  content: string,
  type: Thought["type"],
  importance: number = 5
): CognitiveState {
  const thought: Thought = {
    id: `thought_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    content,
    type,
    importance,
  };

  return {
    ...state,
    thoughts: [...state.thoughts, thought].slice(-100), // Mantener últimos 100
    metadata: {
      ...state.metadata,
      updatedAt: new Date().toISOString(),
    },
  };
}

/**
 * Añade un insight al estado cognitivo
 */
export function addInsight(state: CognitiveState, insight: string): CognitiveState {
  return {
    ...state,
    insights: [...state.insights, insight].slice(-50), // Mantener últimos 50
    metadata: {
      ...state.metadata,
      updatedAt: new Date().toISOString(),
    },
  };
}

/**
 * Registra un patrón detectado
 */
export function registerPattern(state: CognitiveState, pattern: string): CognitiveState {
  const newPatterns = new Map(state.patterns);
  newPatterns.set(pattern, (newPatterns.get(pattern) || 0) + 1);

  return {
    ...state,
    patterns: newPatterns,
    metadata: {
      ...state.metadata,
      updatedAt: new Date().toISOString(),
    },
  };
}
