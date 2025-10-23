declare global {
  interface Window {
    Jupiter: {
      init: () => Promise<void>
      loadTokens: () => Promise<any[]>
      quote: (params: any) => Promise<any>
      swap: (params: any) => Promise<any>
    }
  }
}

export {}
