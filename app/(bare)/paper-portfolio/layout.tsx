/**
 * Live mount for the `paper-portfolio` template.
 *
 * The `/preview/[name]` route renders the home page inside the layout so the
 * catalog card has something to show, but a card is one frame of a seven-page
 * site — the nav, the case-study routes and the print page are only real if you
 * can click them. These files re-export the template's own modules so every
 * route resolves at the same URLs the consumer gets (`data/projects.ts` sets
 * `BASE = "/paper-portfolio"`), with nothing duplicated.
 */
export { default, metadata } from "@/registry/templates/paper-portfolio/layout"
