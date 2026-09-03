import type { Metadata } from "next"
import Link from "next/link"

import { StudioPortrait } from "../components/doodles"
import { PageIntro } from "../components/page-intro"
import { href, profile } from "../data/projects"

export const metadata: Metadata = { title: "About" }

const TIMELINE: Array<[string, string]> = [
  ["Assembly / QBASIC", "Learning how computers think at the lowest level."],
  ["C / C++", "Pointers, memory, compilers and the habit of understanding systems."],
  ["Web Development", "Turning logic into things people can see and use."],
  ["Automation / n8n", "Connecting systems and removing repetitive work."],
  ["AI / ML", "Models, agents, multimodal products and new interaction patterns."],
  [profile.studio, "Bringing experiments together under one place for building."],
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
      <PageIntro eyebrow="02 / about" title="A builder before a" accent="bio.">
        I care about understanding how things work, then shaping that knowledge into software people
        can actually use.
      </PageIntro>

      <section className="aboutPageGrid">
        <article className="aboutPortrait paperPanel">
          <span className="topTape" aria-hidden="true" />
          <StudioPortrait />
          <p className="handCaption">still learning → still building</p>
        </article>
        <article className="aboutStory">
          <h2>I like the messy middle.</h2>
          <p>
            The interesting part is usually between the idea and the polished demo: choosing an
            architecture, deleting the wrong approach, fixing the details and making the product
            feel intentional.
          </p>
          <p>
            My work moves between AI systems, developer tools, interfaces, automation and
            experimental products. I&apos;m especially interested in products where the interaction
            model itself can be rethought.
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
          <h2>MY BUILDING JOURNEY</h2>
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
        <p>The longer version is in my resume.</p>
        <Link className="inkButton" href={href("/resume")}>
          Open resume →
        </Link>
      </section>
    </>
  )
}
