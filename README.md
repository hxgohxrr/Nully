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

```json
{
  "localName": "Nully",
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
    "autoApproveTools": false,
    "autoFixErrors": true
  }
}
```

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
  }
}
```

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
