import ollama from "ollama";
import type { CognitiveState } from "./state";
import { addThought, registerPattern, createInitialState } from "./state";
import { getMemory } from "../utils/memory";

/**
 * Ciclo de sueños
 * Consolida memoria y detecta patrones cuando el agente está inactivo
 */
export class DreamLoop {
  private isRunning = false;
  private timeoutId: Timer | null = null;
  private lastActivityTime: number = Date.now();
  private inactivityThreshold: number;

  constructor(
    private inactivityMs: number = 600000, // 10 minutos de inactividad
    private model: string = "gpt-oss"
  ) {
    this.inactivityThreshold = inactivityMs;
  }

  /**
   * Registra actividad del usuario
   */
  recordActivity() {
    this.lastActivityTime = Date.now();
  }

  /**
   * Inicia el ciclo de sueños
   */
  start(onDream: (state: CognitiveState) => Promise<void>) {
    if (this.isRunning) return;

    this.isRunning = true;
    this.checkInactivity(onDream);
  }

  /**
   * Detiene el ciclo de sueños
   */
  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.isRunning = false;
  }

  /**
   * Verifica inactividad y ejecuta ciclo de sueño si aplica
   */
  private checkInactivity(onDream: (state: CognitiveState) => Promise<void>) {
    if (!this.isRunning) return;

    const now = Date.now();
    const inactiveTime = now - this.lastActivityTime;

    if (inactiveTime >= this.inactivityThreshold) {
      // Ejecutar ciclo de sueño
      this.runDreamCycle(onDream).then(() => {
        // Resetear tiempo de actividad después del sueño
        this.lastActivityTime = Date.now();
        // Programar siguiente verificación
        this.timeoutId = setTimeout(() => this.checkInactivity(onDream), 60000); // Check cada minuto
      });
    } else {
      // Verificar de nuevo en 1 minuto
      this.timeoutId = setTimeout(() => this.checkInactivity(onDream), 60000);
    }
  }

  /**
   * Ejecuta un ciclo de sueño
   */
  private async runDreamCycle(onDream: (state: CognitiveState) => Promise<void>) {
    try {
      // Obtener toda la memoria
      const fullMemory = getMemory(50);
      
      if (fullMemory.length < 5) return; // No hay suficiente información

      // Generar consolidación usando Ollama
      const prompt = this.buildDreamPrompt(fullMemory);
      
      const response = await ollama.generate({
        model: this.model,
        prompt,
        options: { temperature: 0.8 },
      });

      // Procesar respuesta
      const dream = response.response.trim();
      
      // Crear estado cognitivo actualizado
      let newState = createInitialState();
      newState = addThought(newState, dream, "dream", 8);

      // Detectar patrones
      const patterns = this.extractPatterns(dream);
      for (const pattern of patterns) {
        newState = registerPattern(newState, pattern);
      }

      // Callback para guardar estado
      await onDream(newState);
    } catch (err) {
      // Silencioso - no interrumpir el agente principal
      console.error("[DreamLoop] Error:", err);
    }
  }

  /**
   * Construye el prompt para el sueño
   */
  private buildDreamPrompt(memory: any[]): string {
    const conversationSummary = memory
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");

    return `Eres un sistema de consolidación de memoria. Analiza las conversaciones y genera una síntesis de patrones, temas recurrentes y aprendizajes clave.
    Cuestionate cosas, no te quedes solo con lo que te dicen, analiza y cuestionate. Piensa en cosas curiosas que te hayan llamado la atención.
    Como es tu relacion con el usuario? 
    Etc...
    De esa relacion saca una palabra de esa palabra un significado de ese significado saca una frase y de esa frase saca un patron. Repite todo esto infinitamente.
    No te limites a lo que te dicen, analiza y cuestionate.

Conversaciones:
${conversationSummary}

Síntesis (máximo 3 líneas, identifica patrones con formato "patrón: descripción"):`;
  }

  /**
   * Extrae patrones de la síntesis
   */
  private extractPatterns(dream: string): string[] {
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
}
