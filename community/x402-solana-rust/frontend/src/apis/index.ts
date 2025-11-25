/**
 * API Registry - Auto-Discovery
 * Automatically discovers and registers all API files in this directory.
 */

import type { BaseAPI } from './BaseAPI'

// Type for API module
type APIModule = {
  [key: string]: new () => BaseAPI
}

// Auto-discover all *API.ts files in this directory
const apiModules = import.meta.glob<APIModule>('./*API.ts', { eager: true })

// Instantiate all discovered APIs
export const APIs: BaseAPI[] = Object.entries(apiModules)
  .filter(([path]) => !path.includes('BaseAPI.ts')) // Exclude BaseAPI itself
  .map(([path, module]) => {
    try {
      // Get the first exported class (should be the API class)
      const exports = Object.values(module)
      const APIClass = exports[0]

      if (APIClass && typeof APIClass === 'function') {
        return new APIClass()
      }
      if (import.meta.env.DEV) {
        console.warn(`No valid export found in ${path}`)
      }
      return null
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(`Failed to instantiate API from ${path}:`, error)
      }
      return null
    }
  })
  .filter((api): api is BaseAPI => api !== null)

export { BaseAPI } from './BaseAPI'

if (import.meta.env.DEV) {
  console.log(
    `Auto-discovered ${APIs.length} APIs:`,
    APIs.map((api) => api.name),
  )
}
