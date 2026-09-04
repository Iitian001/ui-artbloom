/**
 * Live mount for the `monolith-launch` template.
 *
 * `/preview/[name]` renders the home page inside the layout so the catalog card
 * has something to show, but the card is one frame of a four-page site — the nav,
 * the specifications table and the reserve form are only real if you can click
 * them. These files re-export the template's own modules so every route resolves
 * at the URLs a consumer gets (`data/product.ts` sets `BASE =
 * "/monolith-launch"`), with nothing duplicated.
 */
export { default, metadata } from "@/registry/templates/monolith-launch/layout"
