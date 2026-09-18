import { footer, profile } from "../data/content"

/**
 * The footer. Server component — there is nothing here to hydrate. It closes
 * the page quietly with a blurb, the contact routes, and a small colophon.
 */
export function SiteFooter() {
  return (
    <footer className="dlFooter">
      <div className="dlWrap dlFooterRow">
        <p className="dlFooterBlurb">{footer.blurb}</p>

        <div className="dlFooterMeta">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <span>
            <a href={profile.github.href} target="_blank" rel="noreferrer">
              GitHub
            </a>{" "}
            ·{" "}
            <a href={profile.linkedin.href} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </span>
          <span>
            © {profile.year} {profile.name} {profile.surname} — {footer.builtWith}
          </span>
        </div>
      </div>
    </footer>
  )
}
