"use client"

import { useCallback, useEffect, useRef, useState } from "react"

type Tone = "yellow" | "cream" | "orange"

type Note = {
  id: number
  title: string
  body: string
  /** Position as a percentage of the board, so it survives a resize. */
  x: number
  y: number
  tone: Tone
}

const INITIAL_NOTES: Note[] = [
  {
    id: 1,
    title: "Interface note",
    body: "A control should appear when it has something to do — not sit there being permanently available.",
    x: 6,
    y: 8,
    tone: "yellow",
  },
  {
    id: 2,
    title: "Tiny rule",
    body: "If a screen looks impressive before it feels useful, keep editing.",
    x: 43,
    y: 15,
    tone: "cream",
  },
  {
    id: 3,
    title: "State, plainly",
    body: "Show what the system is doing: waiting → working → checking → done. Never just a spinner.",
    x: 66,
    y: 46,
    tone: "orange",
  },
  {
    id: 4,
    title: "Build log",
    body: "Handmade does not mean decorative. It means every decision had a reason behind it.",
    x: 18,
    y: 54,
    tone: "cream",
  },
]

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

/** How far one arrow-key press moves a note, in percent of the board. */
const NUDGE = 2

/**
 * The draggable note board on /sketchbook.
 *
 * Positions are percentages so the layout survives a resize, but the *limits*
 * are measured from the real elements rather than hard-coded — a percentage
 * ceiling like "78%" lets a 285px note hang off a 1200px board and get clipped.
 * Arrow keys move a focused note, because a mouse-only feature is no feature for
 * anyone navigating by keyboard.
 */
export function SketchBoard() {
  const boardRef = useRef<HTMLDivElement>(null)
  const noteRefs = useRef(new Map<number, HTMLElement>())
  const dragging = useRef<{ id: number; offsetX: number; offsetY: number } | null>(null)
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES)

  /** The largest left/top percentage that still keeps the note fully on the board. */
  const limitsFor = useCallback((id: number) => {
    const board = boardRef.current
    const note = noteRefs.current.get(id)
    if (!board || !note) return { maxX: 100, maxY: 100 }
    const { width, height } = board.getBoundingClientRect()
    return {
      maxX: width > 0 ? Math.max(0, ((width - note.offsetWidth) / width) * 100) : 0,
      maxY: height > 0 ? Math.max(0, ((height - note.offsetHeight) / height) * 100) : 0,
    }
  }, [])

  const settle = useCallback(() => {
    setNotes((items) =>
      items.map((item) => {
        const { maxX, maxY } = limitsFor(item.id)
        return { ...item, x: clamp(item.x, 0, maxX), y: clamp(item.y, 0, maxY) }
      }),
    )
  }, [limitsFor])

  /* The initial positions are tuned for a wide board; pull them in on narrow ones. */
  useEffect(() => {
    settle()
    window.addEventListener("resize", settle)
    return () => window.removeEventListener("resize", settle)
  }, [settle])

  function move(id: number, x: number, y: number) {
    const { maxX, maxY } = limitsFor(id)
    setNotes((items) =>
      items.map((item) =>
        item.id === id ? { ...item, x: clamp(x, 0, maxX), y: clamp(y, 0, maxY) } : item,
      ),
    )
  }

  function onPointerDown(event: React.PointerEvent<HTMLElement>, note: Note) {
    const board = boardRef.current
    if (!board || event.button !== 0) return
    const rect = board.getBoundingClientRect()
    dragging.current = {
      id: note.id,
      offsetX: event.clientX - (rect.left + (note.x / 100) * rect.width),
      offsetY: event.clientY - (rect.top + (note.y / 100) * rect.height),
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragging.current
    const board = boardRef.current
    if (!drag || !board) return
    const rect = board.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
    move(
      drag.id,
      ((event.clientX - rect.left - drag.offsetX) / rect.width) * 100,
      ((event.clientY - rect.top - drag.offsetY) / rect.height) * 100,
    )
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLElement>, note: Note) {
    const step: Record<string, [number, number]> = {
      ArrowLeft: [-NUDGE, 0],
      ArrowRight: [NUDGE, 0],
      ArrowUp: [0, -NUDGE],
      ArrowDown: [0, NUDGE],
    }
    const delta = step[event.key]
    if (!delta) return
    event.preventDefault()
    move(note.id, note.x + delta[0], note.y + delta[1])
  }

  return (
    <div
      ref={boardRef}
      className="sketchBoard"
      onPointerMove={onPointerMove}
      onPointerUp={() => {
        dragging.current = null
      }}
      onPointerCancel={() => {
        dragging.current = null
      }}
    >
      <span className="boardDoodle boardDoodleOne" aria-hidden="true">
        ✦
      </span>
      <span className="boardDoodle boardDoodleTwo" aria-hidden="true">
        ↗
      </span>
      <span className="boardDoodle boardDoodleThree" aria-hidden="true">
        ( keep making )
      </span>

      {notes.map((note) => (
        <article
          key={note.id}
          ref={(node) => {
            if (node) noteRefs.current.set(note.id, node)
            else noteRefs.current.delete(note.id)
          }}
          className={`draggableNote ${note.tone}`}
          style={{ left: `${note.x}%`, top: `${note.y}%` }}
          onPointerDown={(event) => onPointerDown(event, note)}
          onKeyDown={(event) => onKeyDown(event, note)}
          tabIndex={0}
          role="group"
          aria-roledescription="Movable note"
          aria-label={`${note.title}. Use the arrow keys to move it.`}
        >
          <span className="noteTape" aria-hidden="true" />
          <small aria-hidden="true">drag me</small>
          <h3>{note.title}</h3>
          <p>{note.body}</p>
        </article>
      ))}
    </div>
  )
}
