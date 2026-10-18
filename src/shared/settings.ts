export type ThemePreference = 'light' | 'dark' | 'system'

export interface AppSettings {
  theme: ThemePreference
  outputFolder: string
}

export const SETTINGS_FILE_NAME = 'settings.json'

export function createDefaultSettings(): AppSettings {
  return {
    theme: 'system',
    outputFolder: ''
  }
}

export function normalizeSettings(raw: unknown): AppSettings {
  const defaults = createDefaultSettings()
  if (!raw || typeof raw !== 'object') {
    return defaults
  }
  const record = raw as Record<string, unknown>
  const theme =
    record.theme === 'light' || record.theme === 'dark' || record.theme === 'system'
      ? record.theme
      : defaults.theme
  const outputFolder =
    typeof record.outputFolder === 'string' ? record.outputFolder : defaults.outputFolder
  return { theme, outputFolder }
}

export function resolveThemeClass(theme: ThemePreference): 'light' | 'dark' {
  if (theme === 'light') return 'light'
  if (theme === 'dark') return 'dark'
  if (typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

export function themeBackgroundColor(resolved: 'light' | 'dark'): string {
  return resolved === 'dark' ? 'hsl(0 0% 3.9%)' : 'hsl(0 0% 100%)'
}
