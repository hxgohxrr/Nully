<<<<<<< Updated upstream
# 🤖 Nully

**Nully** es un agente CLI inteligente construido con **TypeScript + Bun + Ollama** diseñado para actuar como un asistente autónomo con herramientas, memoria, MCP y capacidad de autocorrección, manteniendo siempre control humano y límites de seguridad configurables.

> ✅ Todo el proyecto está pensado para usarse en **español**.
> 
> ⚠ Nully se encuentra en estado de desarollo y puede tener errores.
---

# 🧠 ¿Qué es Nully?

Nully es un agente que:

* Usa modelos locales mediante **Ollama**
* Puede ejecutar herramientas (tools)
* Tiene memoria persistente
* Puede aprender nuevas herramientas dinámicamente
* Puede autocorregir errores
* Permite integración con MCP (Model Context Protocol)
* Permite control total mediante configuración
* Muestra razonamiento interno y respuesta visible separadas
* Permite aprobación manual o automática de acciones

---

# ✨ Características principales

## 🧠 Razonamiento en tiempo real

Nully puede mostrar:

* Pensamiento interno
* Respuesta visible
* Acciones propuestas

---

## 🧩 Sistema de herramientas dinámico

Puede:

* Crear archivos
* Ejecutar comandos
* Buscar en la web
* Leer memoria
* Autocrear herramientas
* Reparar errores
* Usar herramientas generadas dinámicamente

---

## 💾 Memoria persistente

Nully guarda conversaciones en:

```
memory.json
```

Esto permite:

* Recordar mensajes anteriores
* Mantener contexto entre sesiones
* Aprender del historial

---

## 🌐 MCP (Model Context Protocol)

Permite conectar documentación o APIs externas para que el modelo tenga contexto adicional.

---

## 🛡 Sistema de seguridad configurable

Puedes decidir:

* Qué herramientas puede usar
* Si necesita aprobación manual
* Si puede autocorregirse
* Si puede auto crear herramientas

---

# 📦 Requisitos

### Instalar Bun

```
https://bun.sh
```

### Instalar Ollama

```
https://ollama.ai
```

---

# 🚀 Instalación

```bash
git clone https://github.com/hxgohxrr/Nully.git
cd nully
bun install
```

---

# ▶ Ejecutar Nully

```bash
bun run src/app.ts
```

---

# ⚙ Configuración

Nully usa el archivo:

```
nully.config.json
```

---

## 📄 Ejemplo completo
=======
# Nully - Agente AI Local con Ollama

Agente AI conversacional inteligente que se ejecuta completamente en local usando Ollama, con sistema de herramientas extensibles y memoria persistente.

## 🚀 Características

- ✅ **100% Local**: Sin dependencias de APIs externas, total privacidad
- 🔒 **Seguro**: Validación robusta de paths, sanitización de comandos, sistema de aprobación
- 🧠 **Inteligente**: Clasificación automática de complejidad de razonamiento
- 💭 **Sistema Cognitivo Autónomo**: Pensamientos internos, reflexiones y consolidación de memoria
- 🔧 **Extensible**: Sistema de herramientas dinámicas
- 💾 **Memoria Persistente**: Mantiene contexto entre sesiones (límite de 1000 mensajes)
- 🛡️ **Robusto**: Manejo de errores mejorado, logging estructurado

## 📋 Requisitos

- [Bun](https://bun.sh/) >= 1.0
- [Ollama](https://ollama.com/) instalado y corriendo
- Modelo `gpt-oss` (o el que configures) descargado en Ollama

## 🔧 Instalación

```bash
# Clonar repositorio
git clone <repo-url>
cd Nully

# Instalar dependencias
bun install

# Configurar (opcional)
cp nully.config.json nully.config.json.backup
# Editar nully.config.json según necesites
```

## 🎮 Uso

```bash
# Modo desarrollo (con watch)
bun run dev

# Ejecutar directamente
bun run src/app.ts
```

### Comandos Interactivos

```
> hola                    # Conversar con el agente
> lee el archivo ./README.md   # Usar herramientas
> exit                    # Salir
```

## ⚙️ Configuración

Edita `nully.config.json`:
>>>>>>> Stashed changes

```json
{
  "localName": "Nully",
<<<<<<< Updated upstream
  "version": "1.0.0",
  "ollamaModel": "gpt-oss",
  "thinking": "auto",
  "additionalPrompt": "Eres un asistente técnico amigable.",
  "goals": [
    "Ayudar al usuario",
    "Automatizar tareas",
    "Aprender nuevas herramientas"
  ],
  "mcpFile": "./mcp.json",
  "tools": [],
  "DANGER": {
    "agentWithoutLimits": false,
=======
  "ollamaModel": "gpt-oss",
  "thinking": "medium",  // "low" | "medium" | "high" | "auto"
  "DANGER": {
    "agentWithoutLimits": false,  // ⚠️ PELIGROSO
>>>>>>> Stashed changes
    "autoApproveTools": false,
    "autoFixErrors": true
  }
}
```

<<<<<<< Updated upstream
---

# 🧠 Explicación de Config

## localName

Nombre del agente.

---

## version

Versión del agente.

---

## ollamaModel

Modelo usado por Ollama.

Ejemplo:

```
gpt-oss
llama3
mistral
```

---

## thinking

Nivel de razonamiento:

```
auto
low
medium
high
```

---

## additionalPrompt

Prompt extra que define personalidad o comportamiento.

---

## goals

Objetivos del agente.

Se usan como motivación interna.

---

## tools

Lista de herramientas permitidas.

Ejemplo:

```json
{
  "name": "readFile",
  "description": "Lee archivos",
  "capabilities": ["read"]
}
```

---

## DANGER

Configuraciones avanzadas:

### agentWithoutLimits

Permite ejecutar herramientas sin pedir permiso.

---

### autoApproveTools

Aprueba automáticamente nuevas herramientas.

---

### autoFixErrors

Permite que Nully intente reparar errores.

---

# 🔧 Herramientas Base

Nully incluye herramientas internas como:

* readFile
* writeFile
* execMany
* webSearch
* listTools
* addTool
* fixError

---

# 🧩 Herramientas generadas

Las herramientas creadas dinámicamente se guardan en:

```
metatools/
```

Esto permite:

* Persistencia
* Uso en builds
* Uso en ejecutables

---

# 🌐 MCP

Nully puede usar contexto externo mediante:

```
mcp.json
```

---

## Ejemplo MCP

```json
{
  "mcpServers": {
    "Astro docs": {
      "type": "http",
      "url": "https://mcp.docs.astro.build/mcp"
    }
=======
## 🛠️ Herramientas Disponibles

| Herramienta | Descripción | Seguridad |
|-------------|-------------|-----------|
| `readFile` | Lee archivos del proyecto | ✅ Path validation |
| `writeFile` | Escribe archivos | ✅ Path validation |
| `fixError` | Corrige errores en archivos | ✅ Backup automático |
| `execMany` | Ejecuta comandos permitidos | ✅ Whitelist + timeout |
| `webSearch` | Búsqueda web | ⚠️ Requiere configuración |
| `addTool` | Crea herramientas dinámicas | ⚠️ Código generado por LLM |
| `listTools` | Lista herramientas disponibles | ✅ Solo lectura |

## 🔒 Seguridad

### Mejoras Implementadas

- ✅ **Path Traversal Protection**: Validación robusta con `path.resolve()` + `path.relative()`
- ✅ **Command Injection Protection**: Blacklist de argumentos peligrosos + timeout
- ✅ **Backup Automático**: `fixError` crea `.backup` antes de modificar
- ✅ **Process Cleanup**: Ollama se detiene al cerrar Nully
- ✅ **Memory Limit**: Máximo 1000 mensajes en memoria

### Configuración de Seguridad

```json
{
  "DANGER": {
    "agentWithoutLimits": false,  // Nunca activar en producción
    "autoApproveTools": false,    // Requiere aprobación manual
    "autoFixErrors": true         // Permite auto-corrección
>>>>>>> Stashed changes
  }
}
```

<<<<<<< Updated upstream
---

## Qué permite MCP

* Documentación externa
* APIs externas
* Contexto técnico ampliado

---

# 💬 Uso Básico

Al iniciar Nully:

```
> escribe tu mensaje
```

El agente mostrará:

```
🧠 Pensamiento
💬 Respuesta
⚙ Acciones propuestas
```

---

# ✔ Control humano

Nully SIEMPRE puede:

* Preguntar antes de ejecutar acciones
* Sugerir herramientas
* Explicar riesgos

---

# 🔁 Autocorrección

Si ocurre un error:

Nully puede:

* Intentar arreglar código
* Reparar herramientas
* Reintentar acciones

Hasta 3 intentos.

---

# 🧪 Cómo crear herramientas manualmente

Ejemplo:

```ts
export default async function ejemplo() {
  return { success: true, output: "Hola mundo" }
}
```

---

# 📚 Estructura del Proyecto

```
src/
metatools/
memory.json
nully.config.json
mcp.json
```

---

# 🛡 Seguridad

Nully:

* Bloquea paths peligrosos
* Restringe comandos
* Valida herramientas
* Requiere confirmaciones

---

# ⚠ Advertencias

Nully puede cometer errores.

Siempre revisa:

* Código generado
* Comandos ejecutados
* Herramientas añadidas

---

# 🧬 Filosofía de Nully

Nully está diseñado para ser:

* Flexible
* Seguro
* Aprendiz
* Colaborativo
* Extensible
* Controlado por humanos

---

# ❤️ Contribuir

Puedes:

* Crear herramientas
* Mejorar prompts
* Añadir MCPs
* Optimizar seguridad
* Mejorar UI CLI

---

# 🧾 Licencia

MIT

---

# 👤 Autor

Proyecto creado por:

**hxgohxrr**

Puedes aparecer aqui si contribuyes😄
=======
## 📁 Estructura del Proyecto

```
Nully/
├── src/
│   ├── app.ts              # Entry point
│   ├── data/
│   │   ├── classifier.ts   # Clasificador de thinking
│   │   └── config.ts       # Gestión de configuración
│   ├── tools/              # Herramientas del agente
│   │   ├── readFile.ts
│   │   ├── writeFile.ts
│   │   ├── fixError.ts
│   │   ├── execMany.ts
│   │   ├── webSearch.ts
│   │   ├── addTool.ts
│   │   └── listTools.ts
│   ├── utils/              # Utilidades
│   │   ├── agent.ts        # Lógica del agente
│   │   ├── memory.ts       # Memoria persistente
│   │   ├── logger.ts       # Logger estructurado
│   │   ├── pathValidation.ts  # Validación de paths
│   │   ├── constants.ts    # Constantes del sistema
│   │   ├── result.ts       # Tipos Result
│   │   └── ...
│   └── types/              # Tipos TypeScript
│       ├── config.ts
│       ├── types.ts
│       └── toolSchemas.ts
├── metatools/              # Herramientas generadas dinámicamente
├── memory.json             # Historial de conversación
├── nully.config.json       # Configuración
└── package.json
```

## 🧪 Testing

```bash
# Ejecutar tests (cuando estén implementados)
bun test
```

## 📝 Mejoras Recientes

### v0.0.2 (2026-02-09)

**🔴 Seguridad Crítica (4)**
- Path traversal fix en readFile/writeFile/fixError
- Sanitización de comandos con timeout en execMany
- Cleanup de procesos Ollama
- Validación compartida de paths

**🟠 Bugs Altos (3)**
- Modelo configurable (ya no hardcodeado)
- Límite de 1000 mensajes en memoria
- Manejo de errores mejorado con logging

**🔵 Rendimiento (2)**
- listTools usa operaciones async
- Constantes centralizadas

**🟡 Arquitectura (7)**
- Utilidad compartida `pathValidation.ts`
- Logger estructurado con niveles
- Tipos `Result<T>` para manejo de errores
- Schemas de validación para tool payloads
- Constantes centralizadas
- Mejor organización del código
- JSDoc en funciones críticas

## 🐛 Problemas Conocidos

- Race condition en modificación de config (pendiente)
- Sin validación con Zod/Yup (pendiente)
- Sin tests unitarios (pendiente)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/mejora`)
3. Commit cambios (`git commit -am 'Añade mejora'`)
4. Push a la rama (`git push origin feature/mejora`)
5. Abre un Pull Request

## 📄 Licencia

MIT

## 🙏 Agradecimientos

- [Ollama](https://ollama.com/) por el runtime de LLMs local
- [Bun](https://bun.sh/) por el runtime JavaScript ultrarrápido

---

**⚠️ Advertencia**: Este proyecto ejecuta código generado por LLMs. Revisa siempre las acciones propuestas antes de aprobarlas, especialmente con `addTool`.
>>>>>>> Stashed changes
