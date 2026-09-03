import type { Metadata } from "next"
import Link from "next/link"

import { PrintButton } from "../components/print-button"
import { href, profile } from "../data/projects"

export const metadata: Metadata = { title: "Resume" }

const SELECTED = [
  ["Bloom Chat", "multimodal AI workspace"],
  ["ArtBloom", "AI creative studio"],
  ["Pandu Pet", "animated desktop companion"],
  ["Bloom Browser", "AI-native browser concept"],
  ["Bloom Code", "terminal coding agent"],
]

const CAPABILITIES = [
  "AI / ML systems",
  "LLM & agent orchestration",
  "Next.js / React",
  "Python / FastAPI",
  "Automation",
  "Product & interaction design",
]

export default function ResumePage() {
  return (
    <article className="resumePage">
      <header>
        <div>
          <span className="eyebrow">RESUME / 2026</span>
          <h1>
            {profile.name}
            <br />
            <mark>{profile.surname}</mark>
          </h1>
          <p>{profile.role}</p>
        </div>
        <div className="resumeContact">
          <a href={profile.siteUrl}>{profile.site}</a>
          <a href={profile.repoUrl}>github.com/{profile.handle}</a>
          <span>{profile.location}</span>
        </div>
      </header>

      <section className="resumeColumns">
        <div>
          <h2>Profile</h2>
          <p>
            Developer focused on AI products, agent systems, web experiences, automation and
            experimental software.
          </p>
          <h2>Selected projects</h2>
          <ul>
            {SELECTED.map(([title, summary]) => (
              <li key={title}>
                <b>{title}</b> — {summary}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Capabilities</h2>
          <ul>
            {CAPABILITIES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h2>Current direction</h2>
          <p>Building under {profile.studio} and contributing to open-source software.</p>
        </div>
      </section>

      <div className="resumeActions">
        <PrintButton />
        <Link className="underLink" href={href("/contact")}>
          Contact me →
        </Link>
      </div>
      <p className="printNote">Tip: press Ctrl/Cmd + P to save this page as a PDF.</p>
    </article>
  )
}
