import { contextBridge, ipcRenderer } from 'electron'
import type { AppSettings } from '@shared/settings'
import type { Result } from '@shared/result'

export interface DeskShellApi {
  getSettings: () => Promise<Result<AppSettings>>
  saveSettings: (settings: AppSettings) => Promise<Result<AppSettings>>
  pickOutputFolder: () => Promise<Result<string>>
}

const api: DeskShellApi = {
  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: (settings) => ipcRenderer.invoke('settings:save', settings),
  pickOutputFolder: () => ipcRenderer.invoke('dialog:pickOutputFolder')
}

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('api', api)
} else {
  throw new Error('Desk Shell requires contextIsolation')
}
