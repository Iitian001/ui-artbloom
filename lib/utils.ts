import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** 1240 -> "1.2k", 12400 -> "12.4k", 940 -> "940" */
export function formatCount(n: number) {
  if (n < 1000) return String(n)
  if (n < 1_000_000) {
    const k = n / 1000
    return `${k < 10 ? k.toFixed(1) : Math.round(k)}k`
  }
  return `${(n / 1_000_000).toFixed(1)}m`
}

/** "1,234,567" with locale-stable grouping so SSR and client agree. */
export function formatFull(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

/** "Ravi Katiyar" -> "RK", "shadcn" -> "SH" */
export function monogram(name: string) {
  const parts = name.trim().split(/[\s_-]+/).filter(Boolean)
  if (parts.length === 0) return ""
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
