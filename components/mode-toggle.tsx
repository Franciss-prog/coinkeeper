"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react"

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Avoid rendering Switch until after mount
    return (
      <div className="flex items-center gap-2">
        <Sun className="h-4 w-4" />
        <div className="h-6 w-11 rounded-full bg-gray-300" /> {/* placeholder */}
        <Moon className="h-4 w-4" />
      </div>
    )
  }

  const isDark = (resolvedTheme ?? theme) === "dark"

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4" />
      <Switch
        checked={isDark}
        onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
        aria-label="Toggle dark mode"
      />
      <Moon className="h-4 w-4" />
    </div>
  )
}
