import type { Metadata } from "next"
import Link from "next/link"

import { Reveal } from "../components/reveal"
import { offer, story } from "../data/product"

export const metadata: Metadata = {
  title: "Story",
  description: story.lede,
}

/** Four beats, each a year and a paragraph. No timeline component required. */
export default function StoryPage() {
  return (
    <>
      <section className="monoWrap monoPageHead">
        <p className="monoLabel">{story.eyebrow}</p>
        <h1 className="monoPageTitle">{story.heading}</h1>
        <p className="monoLede">{story.lede}</p>
      </section>

      <section className="monoSection monoSectionTight">
        <div className="monoWrap">
          {story.beats.map((beat, index) => (
            <Reveal key={beat.year} className="monoBeat" delay={index * 70}>
              <p className="monoBeatYear">{beat.year}</p>
              <div className="monoStack">
                <h2 className="monoBeatTitle">{beat.title}</h2>
                <p className="monoBeatBody">{beat.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="monoSection monoSectionTight">
        <Reveal className="monoWrap monoStack">
          <p className="monoLabel">{offer.eyebrow}</p>
          <h2 className="monoHeading">{offer.heading}</h2>
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
