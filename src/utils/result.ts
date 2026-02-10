/**
 * Tipos de resultado para operaciones
 * Proporciona un patrón consistente para manejo de errores
 */

/**
 * Resultado exitoso de una operación
 */
export type Success<T> = {
  success: true;
  data: T;
};

/**
 * Resultado fallido de una operación
 */
export type Failure = {
  success: false;
  error: string;
  details?: any;
};

/**
 * Tipo Result que puede ser Success o Failure
 */
export type Result<T> = Success<T> | Failure;

/**
 * Crea un resultado exitoso
 */
export function success<T>(data: T): Success<T> {
  return { success: true, data };
}

/**
 * Crea un resultado fallido
 */
export function failure(error: string, details?: any): Failure {
  return { success: false, error, details };
}

/**
 * Verifica si un resultado es exitoso
 */
export function isSuccess<T>(result: Result<T>): result is Success<T> {
  return result.success === true;
}

/**
 * Verifica si un resultado es fallido
 */
export function isFailure<T>(result: Result<T>): result is Failure {
  return result.success === false;
}

/**
 * Extrae el valor de un resultado exitoso o lanza error
 */
export function unwrap<T>(result: Result<T>): T {
  if (isSuccess(result)) {
    return result.data;
  }
  throw new Error(result.error);
}

/**
 * Extrae el valor de un resultado exitoso o devuelve un valor por defecto
 */
export function unwrapOr<T>(result: Result<T>, defaultValue: T): T {
  if (isSuccess(result)) {
    return result.data;
  }
  return defaultValue;
}
