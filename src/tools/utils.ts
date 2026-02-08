import type { nullyConfig } from "../types/config";

export function isToolAllowed(tool: string, config: nullyConfig): boolean {
  if (config.DANGER?.agentWithoutLimits) return true;
  return config.tools?.some(t => t.name === tool) ?? false;
}