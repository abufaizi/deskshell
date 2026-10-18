import { Inbox } from 'lucide-react'

export function EmptyState(): React.JSX.Element {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Inbox className="h-6 w-6" />
      </div>
      <div className="max-w-sm space-y-1">
        <h2 className="text-lg font-semibold">Nothing here yet</h2>
        <p className="text-sm text-muted-foreground">
          Desk Shell is ready. Configure theme and output folder in Settings, then add product
          features in a later phase.
        </p>
      </div>
    </div>
  )
}
