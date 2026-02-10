/**
 * Utilidades centralizadas para evitar código duplicado
 */

/**
 * Obtiene timestamp formateado para logs
 * Centraliza la lógica que estaba duplicada 20+ veces
 */
export function getTimestamp(): string {
  return new Date().toLocaleTimeString();
}

/**
 * Constantes del sistema
 */
export const CONSTANTS = {
  MAX_RETRY_ATTEMPTS: 3,
  DEFAULT_MEMORY_LIMIT: 10,
  MAX_MEMORY_MESSAGES: 1000,
  COMMAND_TIMEOUT_MS: 30000,
  OLLAMA_STARTUP_TIMEOUT_MS: 5000,
  OLLAMA_POLL_INTERVAL_MS: 500,
} as const;
