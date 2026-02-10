/**
 * Schemas de validación para herramientas
 * Define los tipos esperados para los payloads de cada tool
 */

/**
 * Payload para readFile
 */
export type ReadFilePayload = {
  path: string;
};

/**
 * Payload para writeFile
 */
export type WriteFilePayload = {
  path: string;
  content: string;
};

/**
 * Payload para execMany
 */
export type ExecManyPayload = {
  commands: string[];
};

/**
 * Payload para webSearch
 */
export type WebSearchPayload = {
  query: string;
};

/**
 * Payload para addTool
 */
export type AddToolPayload = {
  name: string;
  description: string;
  capabilities: string[];
  code: string;
  config: any;
};

/**
 * Payload para fixError
 */
export type FixErrorPayload = {
  file: string;
  before: string;
  after: string;
};

/**
 * Union type de todos los payloads
 */
export type ToolPayload =
  | ReadFilePayload
  | WriteFilePayload
  | ExecManyPayload
  | WebSearchPayload
  | AddToolPayload
  | FixErrorPayload;

/**
 * Valida que un payload tenga la estructura correcta
 */
export function validatePayload(toolName: string, payload: any): boolean {
  switch (toolName) {
    case "readFile":
      return typeof payload?.path === "string";
    
    case "writeFile":
      return (
        typeof payload?.path === "string" &&
        typeof payload?.content === "string"
      );
    
    case "execMany":
      return Array.isArray(payload?.commands);
    
    case "webSearch":
      return typeof payload?.query === "string";
    
    case "addTool":
      return (
        typeof payload?.name === "string" &&
        typeof payload?.description === "string" &&
        Array.isArray(payload?.capabilities) &&
        typeof payload?.code === "string"
      );
    
    case "fixError":
      return (
        typeof payload?.file === "string" &&
        typeof payload?.before === "string" &&
        typeof payload?.after === "string"
      );
    
    default:
      return true; // Herramientas dinámicas no validadas
  }
}
