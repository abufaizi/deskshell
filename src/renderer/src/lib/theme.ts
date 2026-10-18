import type { ThemePreference } from '@shared/settings'
import { resolveThemeClass, themeBackgroundColor } from '@shared/settings'

export function applyTheme(theme: ThemePreference): void {
  const resolved = resolveThemeClass(theme)
  document.documentElement.classList.toggle('dark', resolved === 'dark')
  document.documentElement.style.colorScheme = resolved
  document.body.style.backgroundColor = themeBackgroundColor(resolved)
}
