import type { Metadata } from "next"
import Link from "next/link"

import { PrintButton } from "../components/print-button"
import { href, profile } from "../data/projects"

export const metadata: Metadata = { title: "Capabilities" }

const SELECTED = [
  ["Ledger Atlas", "finance reporting surface"],
  ["Kiln", "shared-workshop scheduling"],
  ["Field Recorder", "local-first audio capture"],
  ["Paper Trail", "documentation generated from source"],
  ["Signal Garden", "alert correlation and on-call design"],
]

const CAPABILITIES = [
  "Product interface design",
  "React / Next.js architecture",
  "Design systems & tokens",
  "Accessibility audits",
  "Performance budgets",
  "Developer tooling",
]

export default function ResumePage() {
  return (
    <article className="resumePage">
      <header>
        <div>
          <span className="eyebrow">CAPABILITIES / 2026</span>
          <h1>
            {profile.name}
            <br />
            <mark>{profile.surname}</mark>
          </h1>
          <p>{profile.role}</p>
        </div>
        <div className="resumeContact">
          <a href={profile.siteUrl}>{profile.site}</a>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <span>{profile.location}</span>
        </div>
      </header>

      <section className="resumeColumns">
        <div>
          <h2>Practice</h2>
          <p>
            A small studio working on product interfaces, front-end architecture, design systems and
            the tooling that keeps them honest.
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
          <p>
            Taking on interface work where the constraints are real, and publishing the reusable
            parts as open source.
          </p>
        </div>
      </section>

      <div className="resumeActions">
        <PrintButton />
        <Link className="underLink" href={href("/contact")}>
          Get in touch →
        </Link>
      </div>
      <p className="printNote">Tip: press Ctrl/Cmd + P to save this page as a PDF.</p>
    </article>
  )
}
