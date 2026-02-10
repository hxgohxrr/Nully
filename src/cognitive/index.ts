/**
 * Sistema Cognitivo Autónomo de Nully
 * 
 * Este módulo exporta todos los componentes del sistema cognitivo
 * para facilitar su uso e integración.
 */

export  {type CognitiveState, type Thought, createInitialState, addThought, addInsight, registerPattern } from "./state";
export { loadCognitiveState, saveCognitiveState } from "./persistence";
export { ThoughtLoop } from "./thoughtLoop";
export { DreamLoop } from "./dreamLoop";
export { CognitiveManager, type CognitiveConfig } from "./manager";
