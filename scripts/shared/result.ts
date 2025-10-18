/**
 * Result type for error handling
 *
 * Prefer Result over throwing exceptions for predictable error flows.
 * Use exceptions only for truly exceptional/unrecoverable errors.
 */

export type Result<T, E = string> = { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: E }

/**
 * Create a successful result
 */
export const ok = <T>(value: T): Result<T, never> => ({
  ok: true,
  value,
})

/**
 * Create an error result
 */
export const err = <E = string>(error: E): Result<never, E> => ({
  ok: false,
  error,
})

/**
 * Map over a successful result
 */
export const map = <T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> => {
  return result.ok ? ok(fn(result.value)) : result
}

/**
 * Chain results (flatMap/bind)
 */
export const chain = <T, U, E>(result: Result<T, E>, fn: (value: T) => Result<U, E>): Result<U, E> => {
  return result.ok ? fn(result.value) : result
}

/**
 * Map over an error result
 */
export const mapError = <T, E, F>(result: Result<T, E>, fn: (error: E) => F): Result<T, F> => {
  return result.ok ? result : err(fn(result.error))
}

/**
 * Unwrap result or use default value
 */
export const unwrapOr = <T, E>(result: Result<T, E>, defaultValue: T): T => {
  return result.ok ? result.value : defaultValue
}

/**
 * Unwrap result or throw error
 * Use sparingly - prefer pattern matching on result
 */
export const unwrap = <T, E>(result: Result<T, E>): T => {
  if (result.ok) {
    return result.value
  }
  throw new Error(String(result.error))
}

/**
 * Wrap a function that might throw in a Result
 */
export const tryCatch = <T>(fn: () => T): Result<T, string> => {
  try {
    return ok(fn())
  } catch (error) {
    return err(error instanceof Error ? error.message : String(error))
  }
}

/**
 * Wrap an async function in a Result
 */
export const tryCatchAsync = async <T>(fn: () => Promise<T>): Promise<Result<T, string>> => {
  try {
    const value = await fn()
    return ok(value)
  } catch (error) {
    return err(error instanceof Error ? error.message : String(error))
  }
}

/**
 * Collect an array of Results into a Result of array
 * Returns first error encountered, or ok with all values
 */
export const collect = <T, E>(results: readonly Result<T, E>[]): Result<readonly T[], E> => {
  const values: T[] = []

  for (const result of results) {
    if (!result.ok) {
      return result
    }
    values.push(result.value)
  }

  return ok(values)
}
