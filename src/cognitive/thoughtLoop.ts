import ollama from "ollama";
import type { CognitiveState } from "./state";
import { addThought, addInsight, createInitialState } from "./state";
import { getMemory } from "../utils/memory";

/**
 * Ciclo de pensamientos internos
 * Reflexiona sobre conversaciones recientes y genera insights
 */
export class ThoughtLoop {
  private isRunning = false;
  private intervalId: Timer | null = null;

  constructor(
    private intervalMs: number = 300000, // 5 minutos por defecto
    private model: string = "gpt-oss"
  ) {}

  /**
   * Inicia el ciclo de pensamientos
   */
  start(onThought: (state: CognitiveState) => Promise<void>) {
    if (this.isRunning) return;

    this.isRunning = true;
    this.intervalId = setInterval(async () => {
      await this.runCycle(onThought);
    }, this.intervalMs);
  }

  /**
   * Detiene el ciclo de pensamientos
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  /**
   * Ejecuta un ciclo de pensamiento
   */
  private async runCycle(onThought: (state: CognitiveState) => Promise<void>) {
    try {
      // Obtener memoria reciente
      const recentMemory = getMemory(10);
      
      if (recentMemory.length === 0) return;

      // Generar reflexión usando Ollama
      const prompt = this.buildReflectionPrompt(recentMemory);
      
      const response = await ollama.generate({
        model: this.model,
        prompt,
        options: { temperature: 0.7 },
      });

      // Procesar respuesta
      const reflection = response.response.trim();
      
      // Crear estado cognitivo actualizado
      let newState = createInitialState();
      newState = addThought(newState, reflection, "reflection", 7);

      // Detectar insights
      if (reflection.includes("insight:") || reflection.includes("patrón:")) {
        const insight = this.extractInsight(reflection);
        if (insight) {
          newState = addInsight(newState, insight);
        }
      }

      // Callback para guardar estado
      await onThought(newState);
    } catch (err) {
      // Silencioso - no interrumpir el agente principal
      console.error("[ThoughtLoop] Error:", err);
    }
  }

  /**
   * Construye el prompt para reflexión
   */
  private buildReflectionPrompt(memory: any[]): string {
    const conversationSummary = memory
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");

    return `Eres un sistema de reflexión interna. Analiza la siguiente conversación y genera una reflexión breve (máximo 2 líneas) sobre patrones, insights o aprendizajes.

Conversación reciente:
${conversationSummary}

Reflexión interna (máximo 2 líneas, sin formato, texto plano):`;
  }

  /**
   * Extrae insight de la reflexión
   */
  private extractInsight(reflection: string): string | null {
    const insightMatch = reflection.match(/insight:\s*(.+)/i);
    if (insightMatch && insightMatch[1]) return insightMatch[1].trim();

    const patternMatch = reflection.match(/patrón:\s*(.+)/i);
    if (patternMatch && patternMatch[1]) return patternMatch[1].trim();

    return null;
  }
}
