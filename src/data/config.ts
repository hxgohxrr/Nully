import type { nullyConfig } from "../types/config";
import { c } from "../utils/colors";
import { existsSync } from "fs";

const DEFAULT_PATH = "./nully.config.json";

export function buildDefaultConfig(): nullyConfig {
  return {
    localName: "Nully",
    additionalPrompt: "",
    mcpFile: "./mcp.json",
    thinking: "medium",
    version: "0.0.1",
    ollamaModel: "gpt-oss",
    goals: [],
    tools: [
      {
        name: "readFile",
        description: "Lee archivos locales de manera segura",
        capabilities: ["leer archivos locales", "obtener contenido de texto"],
      },
      {
        name: "writeFile",
        description: "Escribe contenido en un archivo local de manera segura",
        capabilities: ["crear archivos", "modificar archivos", "guardar texto"],
      },
      {
        name: "execMany",
        description: "Ejecuta comandos permitidos en el sistema",
        capabilities: [
          "ejecutar comandos de shell",
          "obtener salida de comandos",
          "automatizar tareas",
        ],
      },
      {
        name: "webSearch",
        description: "Realiza búsquedas en la web",
        capabilities: [
          "buscar información online",
          "obtener resultados de páginas",
          "resumir información",
        ],
      },
      {
        name: "addTool",
        description: "Añade una nueva herramienta dinámica al sistema",
        capabilities: [
          "crear herramientas nuevas",
          "actualizar la config",
          "import dinámico de tools",
        ],
      },
      {
        name: "fixError",
        description: "Propone y aplica arreglos a errores de archivos",
        capabilities: [
          "modificar archivos",
          "reemplazar texto",
          "corregir errores simples",
        ],
      },
      {
        name: "listTools",
        description: "Lista todas las herramientas disponibles",
        capabilities: [
          "ver herramientas existentes",
          "obtener nombres y descripciones",
          "consultar capacidades",
        ],
      }
    ],
    DANGER: {
      agentWithoutLimits: false,
      autoApproveTools: false,
      autoFixErrors: true,
    },
  };
}

export async function ensureConfig(
  configPath = DEFAULT_PATH,
): Promise<nullyConfig> {
  if (!existsSync(configPath)) {
    const cfg = buildDefaultConfig();
    await Bun.write(configPath, JSON.stringify(cfg, null, 2));
    console.log(
      c.green +
        `[${new Date().toLocaleTimeString()}] 📄 Config creado: ${configPath}` +
        c.reset,
    );
    return cfg;
  }

  const raw = await Bun.file(configPath).text();
  const parsed = JSON.parse(raw) as nullyConfig;

  console.log(
    c.cyan +
      `[${new Date().toLocaleTimeString()}] ⚙ Config cargado: ${configPath}` +
      c.reset,
  );

  return parsed;
}
