/**
 * Live mount for the `graphite` template.
 *
 * `/preview/[name]` renders the page inside this layout so the catalog card has
 * something to show, but the real thing is the scroll itself. These files
 * re-export the template's own modules so the route resolves at the URL a
 * consumer gets (`data/content.ts` sets `BASE = "/graphite"`), with nothing
 * duplicated.
 */
export { default, metadata } from "@/registry/templates/graphite/layout"
