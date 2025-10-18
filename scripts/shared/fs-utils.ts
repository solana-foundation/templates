/**
 * File system utilities
 *
 * All functions return Results instead of throwing exceptions
 * for predictable error handling.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, unlinkSync } from 'fs'
import { join, relative } from 'path'
import { Result, ok, err, tryCatch } from './result.js'
import type { PackageJson } from './types.js'

/**
 * Read a file as a string
 */
export const readFile = (path: string): Result<string> => {
  return tryCatch(() => readFileSync(path, 'utf-8'))
}

/**
 * Read and parse JSON file
 */
export const readJsonFile = <T = unknown>(path: string): Result<T> => {
  return tryCatch(() => {
    const content = readFileSync(path, 'utf-8')
    return JSON.parse(content) as T
  })
}

/**
 * Read package.json from a directory
 */
export const readPackageJson = (dir: string): Result<PackageJson> => {
  const path = join(dir, 'package.json')
  return readJsonFile<PackageJson>(path)
}

/**
 * Write string to file
 */
export const writeFile = (path: string, content: string): Result<void> => {
  return tryCatch(() => {
    writeFileSync(path, content, 'utf-8')
  })
}

/**
 * Write object as JSON to file with pretty printing
 */
export const writeJsonFile = <T>(path: string, data: T): Result<void> => {
  return tryCatch(() => {
    const json = JSON.stringify(data, null, 2) + '\n'
    writeFileSync(path, json, 'utf-8')
  })
}

/**
 * List all entries in a directory
 */
export const readDir = (dir: string): Result<readonly string[]> => {
  return tryCatch(() => readdirSync(dir))
}

/**
 * List only directories in a directory
 */
export const readDirs = (dir: string): Result<readonly string[]> => {
  return tryCatch(() => {
    const entries = readdirSync(dir)
    return entries.filter((entry) => {
      const fullPath = join(dir, entry)
      return statSync(fullPath).isDirectory()
    })
  })
}

/**
 * Check if path is a directory
 */
export const isDirectory = (path: string): boolean => {
  try {
    return statSync(path).isDirectory()
  } catch {
    return false
  }
}

/**
 * Check if file exists
 */
export const fileExists = (path: string): boolean => {
  return existsSync(path)
}

/**
 * Check if directory contains a package.json file
 */
export const hasPackageJson = (dir: string): boolean => {
  return fileExists(join(dir, 'package.json'))
}

/**
 * Delete a file if it exists
 * Returns ok(true) if deleted, ok(false) if didn't exist
 */
export const deleteFile = (path: string): Result<boolean> => {
  if (!fileExists(path)) {
    return ok(false)
  }

  return tryCatch(() => {
    unlinkSync(path)
    return true
  })
}

/**
 * Get relative path from one directory to another
 */
export const getRelativePath = (from: string, to: string): string => {
  return relative(from, to)
}

/**
 * Join path segments
 */
export const joinPath = (...segments: string[]): string => {
  return join(...segments)
}
