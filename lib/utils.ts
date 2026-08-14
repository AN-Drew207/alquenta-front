import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Builds a 1-2 letter initials string from a display name, e.g.
 * "Ana Pérez" -> "AP", "Ana" -> "AN". Used for avatar-fallback badges
 * across the app (profile sidebar ring, avatar upload fallback, live
 * preview card).
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ""
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return (parts[0]![0] + parts[parts.length - 1]![0]).toUpperCase()
}
