import Link from "next/link"

import { brand, footer } from "../data/product"

/**
 * The footer, closing on an oversized wordmark that is meant to be clipped by
 * the page edge. Server component — there is nothing here to hydrate.
 */
export function SiteFooter() {
  return (
    <footer className="monoFooter">
      <div className="monoWrap">
        <div className="monoFooterTop">
          <p className="monoFooterBlurb">{footer.blurb}</p>

          <div className="monoFooterCols">
            {footer.columns.map((column) => (
              <div key={column.heading}>
                <h2 className="monoLabel">{column.heading}</h2>
                <div className="monoFooterLinks">
                  {column.links.map((link) => (
                    <Link key={link.href} href={link.href} className="monoFooterLink">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="monoFooterBottom">
          <span>
            © {brand.year} {brand.name} — {brand.city}
          </span>
          <a href={`mailto:${brand.email}`}>{brand.email}</a>
        </div>

        <p className="monoFooterWord" aria-hidden="true">
          {brand.name}
        </p>
      </div>
    </footer>
  )
}
