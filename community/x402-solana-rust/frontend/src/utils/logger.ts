// Activity logging utilities

export type LogType = 'info' | 'success' | 'error'

export function log(type: LogType, message: string): void {
  const logContainer = document.getElementById('log-container')
  if (!logContainer) {
    if (import.meta.env.DEV) {
      console.log(`[${type.toUpperCase()}] ${message}`)
    }
    return
  }

  const logEntry = document.createElement('div')
  logEntry.className = `log-entry ${type}`

  const timestamp = new Date().toLocaleTimeString()
  logEntry.innerHTML = `
        <span class="timestamp">[${timestamp}]</span>
        <span class="level">${type.toUpperCase()}</span>
        <span class="message">${message}</span>
    `

  logContainer.appendChild(logEntry)
  logContainer.scrollTop = logContainer.scrollHeight
}

export function clearLog(): void {
  const logContainer = document.getElementById('log-container')
  if (logContainer) {
    logContainer.innerHTML = ''
  }
}

/**
 * Setup logger UI
 */
export function setupLogger(): void {
  const clearLogsBtn = document.getElementById('clear-logs-btn')
  if (clearLogsBtn) {
    clearLogsBtn.addEventListener('click', clearLog)
  }
}
