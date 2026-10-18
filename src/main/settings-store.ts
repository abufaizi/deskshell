import { app } from 'electron'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import {
  AppSettings,
  SETTINGS_FILE_NAME,
  createDefaultSettings,
  normalizeSettings
} from '@shared/settings'
import { Result, err, ok } from '@shared/result'

function settingsPath(): string {
  return join(app.getPath('userData'), SETTINGS_FILE_NAME)
}

export async function loadSettings(): Promise<Result<AppSettings>> {
  try {
    const raw = await readFile(settingsPath(), 'utf-8')
    const parsed = JSON.parse(raw) as unknown
    return ok(normalizeSettings(parsed))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return ok(createDefaultSettings())
    }
    return err({
      code: 'SETTINGS_READ_FAILED',
      message: 'Failed to read settings file',
      cause: error
    })
  }
}

export async function saveSettings(settings: AppSettings): Promise<Result<AppSettings>> {
  try {
    const dir = app.getPath('userData')
    await mkdir(dir, { recursive: true })
    const normalized = normalizeSettings(settings)
    await writeFile(settingsPath(), JSON.stringify(normalized, null, 2), 'utf-8')
    return ok(normalized)
  } catch (error) {
    return err({
      code: 'SETTINGS_WRITE_FAILED',
      message: 'Failed to write settings file',
      cause: error
    })
  }
}
