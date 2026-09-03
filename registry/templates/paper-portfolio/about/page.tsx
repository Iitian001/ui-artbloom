import type { Metadata } from "next"
import Link from "next/link"

import { StudioPortrait } from "../components/doodles"
import { PageIntro } from "../components/page-intro"
import { href } from "../data/projects"

export const metadata: Metadata = { title: "About" }

const TIMELINE: Array<[string, string]> = [
  ["Static pages", "Hand-written HTML, one file, no build step. Still the fastest thing on the web."],
  ["Components", "Learning that the hard part is not building a button — it is having one button."],
  ["Design systems", "Tokens, contracts and the discipline of saying no to a fourteenth shade of grey."],
  ["Accessibility", "Keyboards, screen readers, and the realisation that most of it is just semantics."],
  ["Performance", "Measuring instead of guessing. Deleting instead of optimising."],
  ["Field Notes Studio", "Bringing the practice together under one roof and taking on client work."],
]

const PRINCIPLES = [
  "01 — understand before decorating",
  "02 — make state visible",
  "03 — prototype the hard part first",
  "04 — details are product decisions",
]

export default function AboutPage() {
  return (
    <>
      <PageIntro eyebrow="02 / about" title="A practice before a" accent="pitch.">
        We care about understanding how a thing works, then shaping that understanding into software
        people can actually use.
      </PageIntro>

      <section className="aboutPageGrid">
        <article className="aboutPortrait paperPanel">
          <span className="topTape" aria-hidden="true" />
          <StudioPortrait />
          <p className="handCaption">still learning → still building</p>
        </article>
        <article className="aboutStory">
          <h2>We like the messy middle.</h2>
          <p>
            The interesting part is usually between the idea and the polished demo: choosing an
            architecture, deleting the wrong approach, fixing the details, and making the product
            feel deliberate rather than assembled.
          </p>
          <p>
            Our work moves between interfaces, developer tools, design systems and the occasional
            experiment. We are most useful on projects where the interaction model itself is still
            up for debate.
          </p>
          <div className="principleNotes">
            {PRINCIPLES.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
        </article>
      </section>

      <section className="timelineSection">
        <div className="sectionTitleLine">
          <h2>HOW WE GOT HERE</h2>
          <span aria-hidden="true">↘</span>
        </div>
        <div className="timelineList">
          {TIMELINE.map(([title, copy], index) => (
            <article key={title}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pageCTA">
        <p>The longer version is on the capabilities page.</p>
        <Link className="inkButton" href={href("/resume")}>
          Open capabilities →
        </Link>
      </section>
    </>
  )
}
