import Link from "next/link"

import { Reveal } from "./components/reveal"
import { SpecTable } from "./components/spec-table"
import { Ticker } from "./components/ticker"
import { hero, manifesto, offer, pillars, sections, specs } from "./data/product"

/**
 * The launch page: one long scroll, no images.
 *
 * The order is the argument — a claim, the reason for it, four defences with
 * numbers, the specifications behind those numbers, then the price. Every string
 * comes from `data/product.ts`.
 */
export default function MonolithHome() {
  return (
    <>
      <section className="monoWrap monoHero">
        <div className="monoHeroEyebrow">
          <p className="monoLabel">{hero.eyebrow}</p>
        </div>

        <h1 className="monoDisplay">
          {hero.words.map((word, index) => (
            <span key={`${word}-${index}`} className="monoDisplayWord">
              {word}
            </span>
          ))}
        </h1>

        <div className="monoHeroFoot">
          <p className="monoLede">{hero.lede}</p>
          <div className="monoHeroActions">
            <Link className="monoBtn monoBtnSolid" href={hero.primary.href}>
              {hero.primary.label}
              <span className="monoArrow" aria-hidden="true">
                →
              </span>
            </Link>
            <Link className="monoBtn" href={hero.secondary.href}>
              {hero.secondary.label}
            </Link>
          </div>
        </div>
      </section>

      <Ticker />

      <section className="monoSection">
        <Reveal className="monoWrap monoManifesto">
          <div className="monoStack">
            <p className="monoLabel">{sections.manifesto}</p>
            <h2 className="monoHeading">{manifesto.heading}</h2>
          </div>
          <div className="monoManifestoBody">
            {manifesto.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="monoSection monoSectionTight">
        <div className="monoWrap">
          <Reveal className="monoSectionHead">
            <p className="monoLabel">{sections.pillars.label}</p>
            <h2 className="monoHeading">{sections.pillars.heading}</h2>
          </Reveal>

          <div className="monoPillars">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.index} className="monoPillar" delay={index * 70}>
                <p className="monoPillarIndex">{pillar.index}</p>
                <h3 className="monoPillarTitle">{pillar.title}</h3>
                <p className="monoPillarBody">{pillar.body}</p>
                <div className="monoPillarMetric">
                  <span className="monoPillarMetricValue">{pillar.metric}</span>
                  <span className="monoLabel">{pillar.metricLabel}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="monoSection monoSectionTight">
        <div className="monoWrap">
          <div className="monoSectionHeadRow">
            <Reveal className="monoSectionHead">
              <p className="monoLabel">{sections.specs.label}</p>
              <h2 className="monoHeading">{sections.specs.heading}</h2>
            </Reveal>
            <Link className="monoBtn" href={sections.specs.cta.href}>
              {sections.specs.cta.label}
              <span className="monoArrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Two groups here; the rest live on the specifications page. */}
        <SpecTable groups={specs.slice(0, 2)} />
      </section>

      <section className="monoSection monoSectionTight">
        <div className="monoWrap">
          <Reveal className="monoOffer">
            <div>
              <p className="monoLabel">{offer.eyebrow}</p>
              <p className="monoOfferPrice">{offer.price}</p>
              <p className="monoOfferNote">{offer.priceNote}</p>
            </div>
            <div className="monoOfferBody">
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
              <p className="monoOfferNote">{offer.note}</p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
