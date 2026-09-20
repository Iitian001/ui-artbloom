import { AfterglowView } from "./afterglow-view"

import "./afterglow.css"

/* -------------------------------------------------------------------------
   AFTERGLOW — a prom-night invitation on a scroll-scrubbed film.

   One continuous 30s take, dusk → confetti finale, and the page rides its
   light arc: a midnight-and-moonlight night that builds to a single silver
   bloom on the closing RSVP. When the scroll bottoms out the film releases
   and plays on a loop — the night keeps living; scrolling back up hands
   control to the scrub again.

   A whole page, not a component: `.pnRoot` is the single wrapper every rule
   in afterglow.css hangs off, so the sheet touches nothing else in the app.
   The film and the six stills ship as real bytes under /afterglow/.
------------------------------------------------------------------------- */

export const metadata = {
  title: "Afterglow — the prom",
  description:
    "A prom-night invitation on a scroll-scrubbed film: dusk to a confetti finale, one night the whole year has been leaning toward.",
}

export default function AfterglowPage() {
  return <AfterglowView />
}
