import type { Metadata } from "next"

import { PageIntro } from "../components/page-intro"
import { SketchBoard } from "../components/sketch-board"

export const metadata: Metadata = { title: "Sketchbook" }

export default function SketchbookPage() {
  return (
    <>
      <PageIntro eyebrow="05 / sketchbook" title="Unfinished thoughts are" accent="allowed here.">
        Notes about products, interaction, agents and whatever I am currently trying to understand.
        The cards below are draggable — focus one and use the arrow keys.
      </PageIntro>
      <SketchBoard />
    </>
  )
}
