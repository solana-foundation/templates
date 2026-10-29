import { CheckIcon, MoonIcon, SunIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useTheme, type Theme } from '@/features/shell/data-access/use-theme'

const OPTIONS: { label: string; value: Theme }[] = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'system' },
]

/**
 * Icon-only theme control.
 *
 * `System` is kept as its own choice rather than collapsing to a two-way toggle, because it is the
 * default and there would otherwise be no way back to it once the user picks a side.
 */
export function ShellUiThemeSwitcher() {
  const [theme, setTheme] = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="Switch theme" className="relative" size="icon" variant="outline">
          <SunIcon className="scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90" />
          <MoonIcon className="absolute scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {OPTIONS.map((option) => (
          <DropdownMenuItem key={option.value} onSelect={() => setTheme(option.value)}>
            {theme === option.value ? <CheckIcon /> : <span className="size-4" />}
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
