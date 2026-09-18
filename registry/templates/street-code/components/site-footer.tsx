import { brand, footer, nav } from "../data/content"

/**
 * The footer, closing on the oversized tag that is meant to be clipped by the
 * page edge — the way a name runs off the end of a wall. Server component; there
 * is nothing here to hydrate.
 */
export function SiteFooter() {
  return (
    <footer className="scFooter">
      <div className="scWrap">
        <div className="scFooterTop">
          <p className="scFooterBlurb">{footer.blurb}</p>

          <nav className="scFooterNav" aria-label="Footer">
            {nav.map((link) => (
              <a key={link.href} href={link.href} className="scFooterLink">
                {link.label}
              </a>
            ))}
            <a href={`mailto:${brand.email}`} className="scFooterLink">
              Email
            </a>
          </nav>
        </div>

        <div className="scFooterBottom">
          <span>
            © {brand.year} {brand.name} — {brand.city}
          </span>
          <a href={`mailto:${brand.email}`}>{brand.email}</a>
        </div>
      </div>

      {/* Runs full-bleed and off both edges. The clip is the effect. */}
      <p className="scFooterTag" aria-hidden="true">
        {brand.tag}
      </p>
    </footer>
  )
}
