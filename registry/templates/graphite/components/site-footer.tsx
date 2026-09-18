import { footer, profile } from "../data/content"

/**
 * The footer, closing on an oversized outline wordmark meant to be clipped by
 * the page edge — a name signed lightly across the bottom of the sheet. A
 * server component; there is nothing here to hydrate.
 */
export function SiteFooter() {
  return (
    <footer className="grFooter">
      <div className="grWrap">
        <div className="grFooterTop">
          <p className="grFooterBlurb">{footer.blurb}</p>
          <nav className="grFooterLinks" aria-label="Footer">
            {footer.links.map((link) => (
              <a key={link.label} href={link.href} className="grFooterLink">
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="grFooterBottom">
          <span className="grFooterCopy">
            © {profile.year} {profile.name} — {profile.location}
          </span>
          <span className="grFooterNote">{footer.note}</span>
        </div>

        <p className="grFooterWord" aria-hidden="true">
          {profile.name}
        </p>
      </div>
    </footer>
  )
}
