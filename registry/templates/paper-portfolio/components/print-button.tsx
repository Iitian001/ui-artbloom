"use client"

export function PrintButton() {
  return (
    <button type="button" className="inkButton printButton" onClick={() => window.print()}>
      Print / Save as PDF <span aria-hidden="true">→</span>
    </button>
  )
}
