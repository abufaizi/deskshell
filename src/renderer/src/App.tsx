import { useEffect, useState } from 'react'
import { createDefaultSettings, type AppSettings } from '@shared/settings'
import { applyTheme } from '@/lib/theme'
import { Header } from '@/components/header'
import { EmptyState } from '@/components/empty-state'
import { SettingsDialog } from '@/components/settings-dialog'

export default function App(): React.JSX.Element {
  const [settings, setSettings] = useState<AppSettings>(createDefaultSettings())
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    void (async () => {
      const result = await window.api.getSettings()
      const next = result.ok ? result.value : createDefaultSettings()
      setSettings(next)
      applyTheme(next.theme)
      setLoaded(true)
    })()
  }, [])

  if (!loaded) {
    return <div className="min-h-screen bg-background" aria-hidden="true" />
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onOpenSettings={() => setSettingsOpen(true)} />
      <main className="flex flex-1 flex-col">
        <EmptyState />
      </main>
      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={settings}
        onSaved={setSettings}
      />
    </div>
  )
}
