import { useEffect, useState } from 'react'
import { FolderOpen } from 'lucide-react'
import type { AppSettings, ThemePreference } from '@shared/settings'
import { applyTheme } from '@/lib/theme'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  settings: AppSettings
  onSaved: (settings: AppSettings) => void
}

export function SettingsDialog({
  open,
  onOpenChange,
  settings,
  onSaved
}: SettingsDialogProps): React.JSX.Element {
  const [draft, setDraft] = useState<AppSettings>(settings)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setDraft(settings)
      setError(null)
    }
  }, [open, settings])

  async function handlePickFolder(): Promise<void> {
    const result = await window.api.pickOutputFolder()
    if (result.ok) {
      setDraft((prev) => ({ ...prev, outputFolder: result.value }))
      return
    }
    if (result.error.code !== 'DIALOG_CANCELLED') {
      setError(result.error.message)
    }
  }

  async function handleSave(): Promise<void> {
    setSaving(true)
    setError(null)
    const result = await window.api.saveSettings(draft)
    setSaving(false)
    if (!result.ok) {
      setError(result.error.message)
      return
    }
    applyTheme(result.value.theme)
    onSaved(result.value)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Theme and default output folder for Desk Shell.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="theme">Theme</Label>
            <Select
              value={draft.theme}
              onValueChange={(value: ThemePreference) =>
                setDraft((prev) => ({ ...prev, theme: value }))
              }
            >
              <SelectTrigger id="theme">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex min-w-0 flex-col gap-2">
            <Label htmlFor="output-folder">Output folder</Label>
            <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
              <Input
                id="output-folder"
                className="min-w-0 flex-1"
                readOnly
                value={draft.outputFolder || 'Not set'}
                placeholder="Choose a folder"
              />
              <Button type="button" variant="secondary" onClick={() => void handlePickFolder()}>
                <FolderOpen className="h-4 w-4" />
                Browse
              </Button>
            </div>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={() => void handleSave()} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
