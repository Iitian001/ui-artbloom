"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

export type TypewriterProps = {
  /** Phrases cycled in order, then looped. */
  words: string[]
  className?: string
  cursorClassName?: string
  /** ms per character while typing. */
  typeSpeed?: number
  /** ms per character while deleting. */
  deleteSpeed?: number
  /** ms to hold a completed word. */
  holdTime?: number
}

export function Typewriter({
  words,
  className,
  cursorClassName,
  typeSpeed = 70,
  deleteSpeed = 40,
  holdTime = 1600,
}: TypewriterProps) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState("")
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (words.length === 0) return
    const word = words[index % words.length]

    if (!deleting && text === word) {
      const hold = setTimeout(() => setDeleting(true), holdTime)
      return () => clearTimeout(hold)
    }

    if (deleting && text === "") {
      setDeleting(false)
      setIndex((i) => (i + 1) % words.length)
      return
    }

    const tick = setTimeout(
      () => {
        setText((current) =>
          deleting ? word.slice(0, current.length - 1) : word.slice(0, current.length + 1),
        )
      },
      deleting ? deleteSpeed : typeSpeed,
    )
    return () => clearTimeout(tick)
  }, [text, deleting, index, words, typeSpeed, deleteSpeed, holdTime])

  return (
    <span className={cn("inline-flex items-baseline", className)} aria-live="polite">
      <span>{text}</span>
      <span
        aria-hidden
        className={cn(
          "ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.1em] animate-pulse bg-current",
          cursorClassName,
        )}
      />
    </span>
  )
}
