import type { Metadata } from "next"

import { PageIntro } from "../components/page-intro"
import { SketchBoard } from "../components/sketch-board"

export const metadata: Metadata = { title: "Sketchbook" }

export default function SketchbookPage() {
  return (
    <>
      <PageIntro eyebrow="05 / sketchbook" title="Unfinished thoughts are" accent="allowed here.">
        Notes about products, interaction and whatever we are currently trying to understand. Drag
        the cards around, or focus one and use the arrow keys.
      </PageIntro>
      <SketchBoard />
    </>
  )
}
