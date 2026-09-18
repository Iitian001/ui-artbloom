/**
 * Live mount for the `street-code` template.
 *
 * `/preview/[name]` renders the page inside this layout for the catalog card;
 * these files re-export the template's own modules so the route resolves at the
 * URL a consumer gets, with nothing duplicated. It is a one-page site, so there
 * is only this layout and the page below it.
 */
export { default, metadata } from "@/registry/templates/street-code/layout"
