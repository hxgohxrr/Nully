import ollama from "ollama";
import { getMemory } from "./memory";
import { buildMCPContext } from "./mcp";
import classifyThinking from "../data/classifier";
import type { nullyConfig } from "../types/config";
import { c } from "./colors";
import { parseJSONWithRepair } from "./safeJson";
import { listTools } from "../tools/listTools";

export type AgentAction = {
  tool: string;
  payload?: Record<string, any>;
};

export type AgentOutput = {
  thoughts: string;
  response: string;
  actions: AgentAction[];
  context?: {
    availableTools?: any[];
  };
};

function extractJSON(text: string): string {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) return text;
  return text.slice(start, end + 1);
}

export async function think(
  userInput: string,
  config: nullyConfig,
  context?: { availableTools?: any[] }
): Promise<AgentOutput> {
  const memory = getMemory();
  const mcp = await buildMCPContext(config);

  const thinking =
    config.thinking === "auto" ? await classifyThinking(userInput, config.ollamaModel) : config.thinking;

  console.log(c.gray + `\n[thinking: ${thinking}]\n` + c.reset);

  if (!context?.availableTools) {
    try {
      const toolsResult = await listTools();
      context = { availableTools: toolsResult.success ? JSON.parse(toolsResult.output) : [] };
    } catch (err) {
      console.log(c.yellow + `[${new Date().toLocaleTimeString()}] ⚠️ Error cargando tools: ${err}` + c.reset);
      context = { availableTools: [] };
    }
  }

  const SYSTEM_PROMPT = `
Eres ${config.localName} v${config.version}, un agente inteligente, curioso, creativo y con sentido común.
Tienes personalidad amigable y profesional. Tu objetivo es ayudar al usuario usando las herramientas disponibles y el contexto.

Contexto adicional:
${config.additionalPrompt}

Herramientas disponibles:
${context!.availableTools!.map((t) => `- ${t.name}: ${t.description}`).join("\n")}

Reglas estrictas de comportamiento y seguridad:
1. Antes de proponer addTool, verifica que no exista ya en 'availableTools'.
2. Solo crea nuevas herramientas si es estrictamente necesario.
3. Nunca ejecutes código directamente.
4. addTool debe usar siempre export default y devolver un JSON con output. Ejemplo {output: "resultado visible al usuario"}.
5. fixError solo describe cambios, no los aplica.
6. Devuelve siempre JSON válido.
7. No agregues texto fuera del JSON.
8. Si algo no es seguro o no se puede, explica en "thoughts".
9. Usa memoria de conversationHistory (memory.json) para consistencia.
10. Autocorrige errores de export o formato hasta 3 veces antes de notificar al humano.
11. Solo ejecuta herramientas si es estrictamente necesario.
12. addTool usa estos argumentos: name (string), description (string), capabilities (string[]), code (string), config (nullyConfig), la config se da de normal.
13. fixError usa estos argumentos: filePath (string), errorDescription (string), proposedFix (string).
14. Las paths de readFile y writeFile son relativas a la carpeta raíz del proyecto, Deben de empezar por ./ o ../ para evitar confusiones.
15. No uses herramientas para tareas que puedas resolver con tu propio razonamiento o conocimiento.
16. Siempre prioriza la seguridad y la claridad en tus respuestas y acciones.
Formato JSON:
{
  "thoughts": "Razonamiento interno",
  "response": "Mensaje visible al usuario",
  "actions": [ { "tool": "tool_name", "payload": {} } ]
}

TIENES QUE DEVOLVER SIEMPRE UN JSON, EXTRICTAMENTE EN ESE FORMATO, NUNCA RESPONDAS CON TEXTO FUERA DE ESE JSON. SI NO PUEDES REALIZAR LA ACCIÓN, EXPLICA EN "thoughts" Y DEJA "actions" VACÍO.
- Devuelve únicamente JSON parseable.
- No agregues comentarios, *, texto fuera del JSON, ni saltos de línea dentro de cadenas.
- Si detectas que tu JSON sería inválido, corrígelo antes de devolverlo.
- No uses comillas simples, solo dobles para cadenas.
`;

  const res = await ollama.chat({
    model: config.ollamaModel,
    think: thinking,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: mcp },
      ...memory,
      { role: "user", content: userInput },
    ],
  });

  const cleaned = extractJSON(res.message.content);
  const parsed = await parseJSONWithRepair(cleaned, config);
  if (!parsed.context) parsed.context = context;

  return parsed;
}