import { c } from "./colors";
import { getTimestamp } from "./constants";

/**
 * Niveles de logging disponibles
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * Logger estructurado para Nully
 * Proporciona logging consistente con timestamps y colores
 */
export class Logger {
  private minLevel: LogLevel;

  constructor(minLevel: LogLevel = LogLevel.INFO) {
    this.minLevel = minLevel;
  }

  /**
   * Log de debug (solo en desarrollo)
   */
  debug(message: string, data?: any) {
    if (this.minLevel <= LogLevel.DEBUG) {
      console.log(c.gray + `[${getTimestamp()}] 🐛 ${message}` + c.reset, data || "");
    }
  }

  /**
   * Log informativo
   */
  info(message: string, data?: any) {
    if (this.minLevel <= LogLevel.INFO) {
      console.log(c.cyan + `[${getTimestamp()}] ℹ️  ${message}` + c.reset, data || "");
    }
  }

  /**
   * Log de advertencia
   */
  warn(message: string, data?: any) {
    if (this.minLevel <= LogLevel.WARN) {
      console.log(c.yellow + `[${getTimestamp()}] ⚠️  ${message}` + c.reset, data || "");
    }
  }

  /**
   * Log de error
   */
  error(message: string, error?: any) {
    if (this.minLevel <= LogLevel.ERROR) {
      console.log(c.red + `[${getTimestamp()}] ❌ ${message}` + c.reset);
      if (error) {
        console.error(error);
      }
    }
  }

  /**
   * Log de éxito
   */
  success(message: string) {
    console.log(c.green + `[${getTimestamp()}] ✅ ${message}` + c.reset);
  }

  /**
   * Log de acción del agente
   */
  agent(message: string) {
    console.log(c.cyan + `[${getTimestamp()}] 🤖 ${message}` + c.reset);
  }

  /**
   * Log de pensamiento del agente
   */
  thought(message: string) {
    console.log(c.gray + `[${getTimestamp()}] 🧠 ${message}` + c.reset);
  }

  /**
   * Log de herramienta ejecutada
   */
  tool(toolName: string, message: string) {
    console.log(c.yellow + `[${getTimestamp()}] ⚙️  [${toolName}] ${message}` + c.reset);
  }
}

/**
 * Instancia global del logger
 */
export const logger = new Logger(LogLevel.INFO);
