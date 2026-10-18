import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  onOpenSettings: () => void
}

export function Header({ onOpenSettings }: HeaderProps): React.JSX.Element {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b px-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
          DS
        </div>
        <div>
          <p className="text-sm font-semibold leading-none">Desk Shell</p>
          <p className="text-xs text-muted-foreground">Phase 1 desktop shell</p>
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={onOpenSettings} aria-label="Open settings">
        <Settings className="h-4 w-4" />
        Settings
      </Button>
    </header>
  )
}
