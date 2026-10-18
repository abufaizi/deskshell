import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  dialog,
  nativeTheme,
  type OpenDialogOptions
} from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { buildSplashHtml } from './splash-html'
import { loadSettings, saveSettings } from './settings-store'
import type { AppSettings, ThemePreference } from '@shared/settings'
import { themeBackgroundColor } from '@shared/settings'

let mainWindow: BrowserWindow | null = null
let splashWindow: BrowserWindow | null = null
let splashShownAt = 0

function resolveEffectiveTheme(theme: ThemePreference): 'light' | 'dark' {
  if (theme === 'light' || theme === 'dark') return theme
  return nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
}

function createSplashWindow(): void {
  splashShownAt = Date.now()
  splashWindow = new BrowserWindow({
    width: 420,
    height: 260,
    frame: false,
    resizable: false,
    movable: true,
    show: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    backgroundColor: '#0a0a0a',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  })
  const html = buildSplashHtml()
  void splashWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)
  splashWindow.on('ready-to-show', () => {
    splashWindow?.show()
  })
}

async function closeSplashAndShowMain(window: BrowserWindow): Promise<void> {
  const minVisibleMs = 650
  const elapsed = Date.now() - splashShownAt
  const remaining = Math.max(0, minVisibleMs - elapsed)
  if (remaining > 0) {
    await new Promise((resolve) => setTimeout(resolve, remaining))
  }
  if (splashWindow && !splashWindow.isDestroyed()) {
    splashWindow.close()
    splashWindow = null
  }
  window.show()
}

function focusMainWindow(): void {
  if (!mainWindow || mainWindow.isDestroyed()) return
  if (mainWindow.isMinimized()) mainWindow.restore()
  mainWindow.show()
  mainWindow.focus()
}

function registerIpc(): void {
  ipcMain.handle('settings:get', async () => {
    return loadSettings()
  })

  ipcMain.handle('settings:save', async (_event, settings: AppSettings) => {
    return saveSettings(settings)
  })

  ipcMain.handle('dialog:pickOutputFolder', async () => {
    const current = await loadSettings()
    const defaultPath =
      current.ok && current.value.outputFolder ? current.value.outputFolder : undefined
    const dialogOptions: OpenDialogOptions = {
      title: 'Choose output folder',
      properties: ['openDirectory', 'createDirectory'],
      defaultPath
    }
    const result =
      mainWindow && !mainWindow.isDestroyed()
        ? await dialog.showOpenDialog(mainWindow, dialogOptions)
        : await dialog.showOpenDialog(dialogOptions)
    if (result.canceled || result.filePaths.length === 0) {
      return { ok: false as const, error: { code: 'DIALOG_CANCELLED' as const, message: 'Cancelled' } }
    }
    return { ok: true as const, value: result.filePaths[0] }
  })
}

async function createMainWindow(initialSettings: AppSettings): Promise<void> {
  const resolved = resolveEffectiveTheme(initialSettings.theme)
  const backgroundColor = themeBackgroundColor(resolved)

  mainWindow = new BrowserWindow({
    width: 960,
    height: 640,
    minWidth: 720,
    minHeight: 480,
    show: false,
    autoHideMenuBar: true,
    backgroundColor,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      additionalArguments: [`--initial-theme=${initialSettings.theme}`]
    }
  })

  mainWindow.on('ready-to-show', () => {
    void closeSplashAndShowMain(mainWindow!)
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    void shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (url !== mainWindow?.webContents.getURL()) {
      event.preventDefault()
      void shell.openExternal(url)
    }
  })

  const search = new URLSearchParams({ theme: initialSettings.theme })
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    const url = new URL(process.env['ELECTRON_RENDERER_URL'])
    url.search = search.toString()
    await mainWindow.loadURL(url.toString())
  } else {
    await mainWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      search: search.toString()
    })
  }
}

const gotSingleInstanceLock = app.requestSingleInstanceLock()

if (!gotSingleInstanceLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    focusMainWindow()
  })

  app.whenReady().then(async () => {
    electronApp.setAppUserModelId('com.abufaizi.deskshell')

    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    registerIpc()

    const settingsResult = await loadSettings()
    const settings = settingsResult.ok ? settingsResult.value : { theme: 'system' as const, outputFolder: '' }

    createSplashWindow()
    await createMainWindow(settings)

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        void createMainWindow(settings)
      }
    })
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
}
