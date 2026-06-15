import { TriangleAlert } from 'lucide-react'

export function ErrorNote({ title, message, hint }: { title: string; message: string; hint?: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm">
      <TriangleAlert className="mt-0.5 size-4 shrink-0 text-destructive" />
      <div>
        <p className="font-medium text-destructive">{title}</p>
        <p className="text-muted">{message}</p>
        {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      </div>
    </div>
  )
}
