/// <reference types="vite/client" />

import type { DeskShellApi } from '../../preload/index'

declare global {
  interface Window {
    api: DeskShellApi
  }
}

export {}
