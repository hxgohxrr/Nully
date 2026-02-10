import { resolve, relative, isAbsolute } from "path";

const PROJECT_ROOT = process.cwd();

/**
 * Valida que un path esté dentro del directorio del proyecto
 * Previene ataques de path traversal
 * 
 * @param userPath - Path proporcionado por el usuario
 * @returns true si el path es seguro, false si está fuera del proyecto
 * 
 * @example
 * isPathSafe("./package.json") // true
 * isPathSafe("../../etc/passwd") // false
 * isPathSafe("/etc/passwd") // false
 */
export function isPathSafe(userPath: string): boolean {
  // Resolver path absoluto
  const absolutePath = resolve(PROJECT_ROOT, userPath);
  
  // Verificar que esté dentro del proyecto
  const relativePath = relative(PROJECT_ROOT, absolutePath);
  
  // Si empieza con ".." o es absoluto, está fuera del proyecto
  if (relativePath.startsWith("..") || isAbsolute(relativePath)) {
    return false;
  }
  
  return true;
}

/**
 * Obtiene el path seguro absoluto dentro del proyecto
 * Lanza error si el path no es seguro
 * 
 * @param userPath - Path proporcionado por el usuario
 * @returns Path absoluto seguro
 * @throws Error si el path está fuera del proyecto
 */
export function getSafePath(userPath: string): string {
  if (!isPathSafe(userPath)) {
    throw new Error(`Path no permitido (fuera del proyecto): ${userPath}`);
  }
  
  return resolve(PROJECT_ROOT, userPath);
}

/**
 * Obtiene el directorio raíz del proyecto
 */
export function getProjectRoot(): string {
  return PROJECT_ROOT;
}
