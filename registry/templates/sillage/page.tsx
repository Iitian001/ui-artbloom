import { SillageView } from "./sillage-view"

import "./sillage.css"

/* -------------------------------------------------------------------------
   SILLAGE — a night-blooming fragrance house on a scroll-scrubbed film.

   The 30s take runs dusk → deep night; its native warm grade is held cool
   and dark by fixed overlays so the whole thing reads as a night garden.
   The one orchestrated moment is a silver-jade bloom that swells behind the
   type as the night-jasmine beat reaches centre, then recedes. Below the
   film the page becomes a real fragrance house: the composition, the bottle,
   where the jasmine is grown, the rest of the house.

   A whole page, not a component: `.lmRoot` is the single wrapper every rule
   in sillage.css hangs off, so the sheet touches nothing else in the app.
   The film and the six stills ship as real bytes under /sillage/.
------------------------------------------------------------------------- */

export const metadata = {
  title: "Sillage — night-blooming eau de parfum",
  description:
    "A night-blooming botanical fragrance house on a scroll-scrubbed film: bergamot to night jasmine to oud, dusk into deep night.",
}

export default function SillagePage() {
  return <SillageView />
}
