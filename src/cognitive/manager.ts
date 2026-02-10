import type { CognitiveState } from "./state";
import { createInitialState, addThought } from "./state";
import { loadCognitiveState, saveCognitiveState } from "./persistence";
import { ThoughtLoop } from "./thoughtLoop";
import { DreamLoop } from "./dreamLoop";

/**
 * Configuración del sistema cognitivo
 */
export type CognitiveConfig = {
  enabled: boolean;
  thoughtLoopEnabled: boolean;
  dreamLoopEnabled: boolean;
  thoughtIntervalMs: number;
  inactivityThresholdMs: number;
  model: string;
};

/**
 * Manager del sistema cognitivo
 * Orquesta los ciclos de pensamientos y sueños
 */
export class CognitiveManager {
  private state: CognitiveState;
  private thoughtLoop: ThoughtLoop;
  private dreamLoop: DreamLoop;
  private config: CognitiveConfig;

  constructor(config: CognitiveConfig) {
    this.config = config;
    this.state = createInitialState();
    this.thoughtLoop = new ThoughtLoop(config.thoughtIntervalMs, config.model);
    this.dreamLoop = new DreamLoop(config.inactivityThresholdMs, config.model);
  }

  /**
   * Inicializa el sistema cognitivo
   */
  async initialize() {
    // Cargar estado persistente
    this.state = await loadCognitiveState();

    if (!this.config.enabled) return;

    // Iniciar ciclos si están habilitados
    if (this.config.thoughtLoopEnabled) {
      this.thoughtLoop.start(async (partialState) => {
        await this.updateState(partialState);
      });
    }

    if (this.config.dreamLoopEnabled) {
      this.dreamLoop.start(async (partialState) => {
        await this.updateState(partialState);
      });
    }
  }

  /**
   * Detiene el sistema cognitivo
   */
  shutdown() {
    this.thoughtLoop.stop();
    this.dreamLoop.stop();
    this.saveState();
  }

  /**
   * Registra actividad del usuario (para DreamLoop)
   */
  recordActivity() {
    this.dreamLoop.recordActivity();
  }

  /**
   * Actualiza el estado cognitivo
   */
  private async updateState(partialState: Partial<CognitiveState>) {
    // Merge del estado parcial con el estado actual
    this.state = {
      ...this.state,
      ...partialState,
      thoughts: [...this.state.thoughts, ...(partialState.thoughts || [])].slice(-100),
      insights: [...this.state.insights, ...(partialState.insights || [])].slice(-50),
      metadata: {
        ...this.state.metadata,
        updatedAt: new Date().toISOString(),
      },
    };

    // Actualizar contadores
    if (partialState.thoughts?.some(t => t.type === "reflection")) {
      this.state.cycleCount.thoughts++;
      this.state.lastThoughtCycle = new Date().toISOString();
    }

    if (partialState.thoughts?.some(t => t.type === "dream")) {
      this.state.cycleCount.dreams++;
      this.state.lastDreamCycle = new Date().toISOString();
    }

    // Persistir
    await this.saveState();
  }

  /**
   * Guarda el estado actual
   */
  private async saveState() {
    await saveCognitiveState(this.state);
  }

  /**
   * Obtiene el estado actual (para debugging)
   */
  getState(): CognitiveState {
    return this.state;
  }

  /**
   * Añade un pensamiento manual (trigger externo)
   */
  async addManualThought(content: string, type: "reflection" | "insight" | "pattern" | "dream" = "reflection") {
    this.state = addThought(this.state, content, type, 6);
    await this.saveState();
  }
}
