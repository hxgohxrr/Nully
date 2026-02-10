import readline from "node:readline";
import { think } from "./utils/agent";
import { tools, isToolAllowed } from "./utils/tools";
import { saveMessage } from "./utils/memory";
import { typeWrite, typeWriteThoughts } from "./utils/typing";
import { c } from "./utils/colors";
import { ensureConfig } from "./data/config";
import { ensureModel, ensureOllama } from "./utils/ensureOllama";
import { join } from "path";
import { CognitiveManager } from "./cognitive/manager";
import { isDreamCommand, executeDreamCycle } from "./utils/dreamCommand";

const config = await ensureConfig("./nully.config.json");
await ensureOllama();
await ensureModel(config.ollamaModel);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const ask = (q: string) => new Promise<string>((res) => rl.question(q, res));

console.log(
  c.cyan +
    `[${new Date().toLocaleTimeString()}] 🤖 Agente iniciado (${config.localName} v${config.version})` +
    c.reset,
);
console.log(c.gray + "Tu app nullificada\n" + c.reset);

// Inicializar sistema cognitivo si está habilitado
let cognitiveManager: CognitiveManager | null = null;
if (config.cognitive?.enabled) {
  cognitiveManager = new CognitiveManager({
    enabled: config.cognitive.enabled,
    thoughtLoopEnabled: config.cognitive.thoughtLoopEnabled,
    dreamLoopEnabled: config.cognitive.dreamLoopEnabled,
    thoughtIntervalMs: config.cognitive.thoughtIntervalMs,
    inactivityThresholdMs: config.cognitive.inactivityThresholdMs,
    model: config.ollamaModel,
  });
  await cognitiveManager.initialize();
  console.log(c.gray + `[${new Date().toLocaleTimeString()}] 🧠 Sistema cognitivo activado` + c.reset);
}

while (true) {
  const input = await ask(c.blue + "> " + c.reset);
  if (input === "exit") break;
  
  // Registrar actividad para el sistema cognitivo
  cognitiveManager?.recordActivity();
  
  // Detectar comando de sueño
  if (isDreamCommand(input)) {
    await saveMessage("user", input);
    
    console.log(c.yellow + `[${new Date().toLocaleTimeString()}] 💤 ¿Quieres que entre en modo sueño?` + c.reset);
    console.log(c.gray + "Consolidaré la memoria y generaré insights. Escribe algo para despertarme." + c.reset);
    
    const confirmation = await ask(c.yellow + "Confirmar (y/n): " + c.reset);
    
    if (confirmation.toLowerCase() === "s" || confirmation.toLowerCase() === "si" || confirmation.toLowerCase() === "yes" || confirmation.toLowerCase() === "y") {
      console.log(c.cyan + `[${new Date().toLocaleTimeString()}] 😴 Entrando en modo sueño...` + c.reset);
      
      // Ejecutar ciclo de sueño manual
      const dreamState = await executeDreamCycle(config.ollamaModel);
      
      // Guardar estado si hay cognitive manager
      if (cognitiveManager) {
        await cognitiveManager.addManualThought(
          dreamState.thoughts[0]?.content || "Sueño completado",
          "dream"
        );
      }
      
      // Mostrar el sueño
      console.log(c.magenta + `\n[${new Date().toLocaleTimeString()}] 💭 Sueño:` + c.reset);
      await typeWrite(c.gray + (dreamState.thoughts[0]?.content || "...") + c.reset);
      console.log("\n");
      
      // Mostrar patrones detectados
      if (dreamState.patterns.size > 0) {
        console.log(c.cyan + `[${new Date().toLocaleTimeString()}] 🔍 Patrones detectados:` + c.reset);
        for (const [pattern, count] of dreamState.patterns) {
          console.log(c.gray + `  • ${pattern} (${count})` + c.reset);
        }
        console.log("");
      }
      
      console.log(c.green + `[${new Date().toLocaleTimeString()}] ✨ Desperté. ¿En qué puedo ayudarte?` + c.reset);
      
      // Esperar input del usuario para "despertar"
      await saveMessage("assistant", dreamState.thoughts[0]?.content || "He soñado y consolidado la memoria.");
      continue;
    } else {
      console.log(c.gray + "Entendido, continúo despierto." + c.reset);
      await saveMessage("assistant", "Entendido, continúo despierto.");
      continue;
    }
  }
  
  await saveMessage("user", input);

  const availableToolsResult = await tools.listTools();
  let availableTools: any[] = [];
  try {
    availableTools = JSON.parse(availableToolsResult.output);
  } catch (err) {
    console.log(c.red + `[${new Date().toLocaleTimeString()}] ⚠️ Error parseando tools: ${err}` + c.reset);
  }
  const result = await think(input, config, { availableTools });

  console.log(
    c.gray + `[${new Date().toLocaleTimeString()}] 🧠 Pensamiento:` + c.reset,
  );
  await typeWriteThoughts(c.gray + result.thoughts + c.reset, 20);

  console.log(
    c.green + `[${new Date().toLocaleTimeString()}] 💬 Respuesta:` + c.reset,
  );
  await typeWrite(result.response);
  await saveMessage("assistant", result.response);

  if (!result.actions?.length) continue;
  console.log(
    c.yellow +
      `\n[${new Date().toLocaleTimeString()}] ⚙ Acciones propuestas (${result.actions.length}):` +
      c.reset,
  );

  for (let i = 0; i < result.actions.length; i++) {
    const action: any = result.actions[i];
    console.log(
      c.yellow +
        `[${new Date().toLocaleTimeString()}] [${i + 1}] ${action.tool}` +
        c.reset,
      action.payload,
    );

    if (!isToolAllowed(action.tool, config)) {
      const addOk = await ask(
        c.blue +
          `¿Añadir '${action.tool}' a la config para poder usarla? (y/n): ` +
          c.reset,
      );
      if (addOk === "y") {
        if (!config.tools) config.tools = [];
        config.tools.push({
          name: action.tool,
          description:
            action.payload?.description || "Tool añadida dinámicamente",
          capabilities: action.payload?.capabilities || [],
        });
        await Bun.write("./nully.config.json", JSON.stringify(config, null, 2));
        console.log(
          c.green +
            `[${new Date().toLocaleTimeString()}] ✅ Tool '${action.tool}' añadida a la config` +
            c.reset,
        );
      } else continue;
    }

    const autoApprove =
      config.DANGER.agentWithoutLimits ||
      (action.tool === "addTool" && config.DANGER.autoApproveTools) ||
      (action.tool === "fixError" && config.DANGER.autoFixErrors);

    if (!autoApprove) {
      const ok = await ask(
        c.red +
          `[${new Date().toLocaleTimeString()}] ¿Ejecutar esta acción? (y/n): ` +
          c.reset,
      );
      if (ok !== "y") {
        console.log(c.red + "❌ Acción omitida" + c.reset);
        continue;
      }
    }

    let toolFunc = (tools as Record<string, Function>)[action.tool];

    if (!toolFunc) {
      try {
        const generatedPath = join(
          process.cwd(),
          "metatools",
          `${action.tool}.ts`,
        );
        const imported = await import(generatedPath);
        if (imported.default) toolFunc = imported.default;
        else toolFunc = imported[action.tool];
        if (!toolFunc)
          throw new Error("No se encontró la función en el archivo generado");
        console.log(
          c.gray +
            `[${new Date().toLocaleTimeString()}] ⚡ Tool '${action.tool}' cargada desde metatools` +
            c.reset,
        );
      } catch (err) {
        console.log(
          c.red +
            `[${new Date().toLocaleTimeString()}] ❌ Tool no disponible ni en memoria ni en generated` +
            c.reset,
          err,
        );
        continue;
      }
    }

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        let out: any;
        if (action.tool === "addTool") {
          const payload = { ...action.payload, config };
          if (payload.code && !payload.code.includes("export default"))
            payload.code = `export default ${payload.code.trim()}`;
          out = await tools.addTool!(
            payload.name,
            payload.description,
            payload.capabilities,
            payload.code,
            payload.config,
          );
        } else if (action.tool === "fixError") {
          const payload = { ...action.payload };
          out = await tools.fixError!(
            payload.file,
            payload.before,
            payload.after,
          );
        } else if (action.tool === "listTools") {
          out = await tools.listTools();
          try {
            result.context = result.context || {};
            result.context.availableTools = JSON.parse(out.output);
          } catch {
            result.context!.availableTools = [];
          }
        } else {
          out = await toolFunc(...Object.values(action.payload ?? {}));
        }
        console.log(
          c.green +
            `[${new Date().toLocaleTimeString()}] ✅ Resultado:` +
            c.reset,
          out.output,
        );
        break;
      } catch (err: any) {
        console.log(
          c.red +
            `[${new Date().toLocaleTimeString()}] ❌ Error ejecutando acción (intento ${attempts}):` +
            c.reset,
          err,
        );
        if (attempts < maxAttempts) {
          console.log(
            c.gray +
              `[${new Date().toLocaleTimeString()}] 🔧 Intentando arreglar automáticamente...` +
              c.reset,
          );
          try {
            if (
              action.tool === "addTool" &&
              action.payload?.code &&
              !action.payload.code.includes("export default")
            )
              action.payload.code = `export default ${action.payload.code.trim()}`;
          } catch {}
        }
        if (attempts >= maxAttempts)
          console.log(
            c.red +
              `[${new Date().toLocaleTimeString()}] ⚠️ Acción falló después de ${maxAttempts} intentos.` +
              c.reset,
          );
      }
    }
  }
}

rl.close();
