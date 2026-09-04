import type { Metadata } from "next"
import Link from "next/link"

import { Reveal } from "../components/reveal"
import { SpecTable } from "../components/spec-table"
import { offer, specs, specsIntro } from "../data/product"

export const metadata: Metadata = {
  title: "Specifications",
  description: specsIntro.lede,
}

/** Every group, full width, one hairline band each. */
export default function SpecsPage() {
  return (
    <>
      <section className="monoWrap monoPageHead">
        <p className="monoLabel">{specsIntro.eyebrow}</p>
        <h1 className="monoPageTitle">{specsIntro.heading}</h1>
        <p className="monoLede">{specsIntro.lede}</p>
      </section>

      <section className="monoSection monoSectionTight">
        <SpecTable groups={specs} />
      </section>

      <section className="monoSection monoSectionTight">
        <Reveal className="monoWrap monoStack">
          <p className="monoLabel">{offer.eyebrow}</p>
          <h2 className="monoHeading">{offer.heading}</h2>
          <p className="monoLede">{offer.body}</p>
          <div className="monoHeroActions">
            <Link className="monoBtn monoBtnSolid" href={offer.cta.href}>
              {offer.cta.label}
              <span className="monoArrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
