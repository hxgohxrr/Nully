export type nullyConfig = {
    /** Nombre del agente, se usará para personalizar respuestas y mensajes. */
    localName: string,
    /** Descripción del agente, se usará para personalizar respuestas y mensajes. */
    additionalPrompt: string,
    /** Archivo de configuración MCP (Multi-Context Prompt) que el agente usará para acceder a herramientas y datos. */
    mcpFile: string,
    /** Nivel de "thinking" interno del agente. Esto afecta la cantidad de razonamiento que el agente realiza antes de responder. Puede ser "low", "medium", "high" o "auto". En "auto", el agente decidirá dinámicamente el nivel de razonamiento según la complejidad de la tarea. */
    thinking: "low" | "medium" | "high" | "auto",
    /** Versión del agente, se usará para personalizar respuestas y mensajes. */
    version: string,
    /** Lista de herramientas disponibles para el agente. Cada herramienta debe tener un nombre único y una descripción clara de su función. El agente podrá usar estas herramientas para realizar acciones específicas según las necesidades del usuario. */
    tools: {
        name: string,
        description: string,
        capabilities: string[]
    }[],
    goals: string[],
    ollamaModel: string,
    /** Configuración de opciones peligrosas. Estas opciones permiten al agente realizar acciones que pueden ser riesgosas si se usan incorrectamente. Solo deben habilitarse si confías completamente en el agente y comprendes los riesgos involucrados. */
    DANGER: {
        /** PELIGRO. Esta opción permite al agente ejecutar cualquier comando del sistema sin restricciones. Esto puede ser extremadamente peligroso, ya que el agente podría eliminar archivos importantes, instalar software malicioso o realizar cualquier acción que un usuario malintencionado podría hacer. Solo debe habilitarse si confía completamente en el agente y comprende los riesgos involucrados. */
        agentWithoutLimits: boolean,
        autoApproveTools: boolean,
        autoFixErrors: boolean
    },
    /** Configuración del sistema cognitivo autónomo */
    cognitive?: {
        enabled: boolean,
        thoughtLoopEnabled: boolean,
        dreamLoopEnabled: boolean,
        thoughtIntervalMs: number,
        inactivityThresholdMs: number
    }
}