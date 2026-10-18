import type { DeskShellApi } from './index'

declare global {
  interface Window {
    api: DeskShellApi
  }
}

export {}
