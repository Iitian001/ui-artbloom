import type { Metadata } from "next"
import Link from "next/link"

import { PageIntro } from "../components/page-intro"
import { ProjectCard } from "../components/project-card"
import { href, projects } from "../data/projects"

export const metadata: Metadata = { title: "Work" }

export default function WorkPage() {
  return (
    <>
      <PageIntro eyebrow="01 / selected work" title="Things I have" accent="built.">
        Projects, experiments and product systems where engineering and design meet.
      </PageIntro>

      <section className="workEditorial">
        <div className="workLeadNote">
          <span className="topTape" aria-hidden="true" />
          <strong>How I choose work</strong>
          <p>
            Useful problem. Clear point of view. Enough technical difficulty to learn something.
          </p>
          <span className="scribble" aria-hidden="true">
            → make it real
          </span>
        </div>
        <div className="fullProjectGrid">
          {projects.map((project, index) => (
            <ProjectCard project={project} key={project.slug} index={index} />
          ))}
        </div>
      </section>

      <section className="pageCTA">
        <p>Have a difficult thing worth building?</p>
        <Link className="inkButton" href={href("/contact")}>
          Start a conversation →
        </Link>
      </section>
    </>
  )
}
