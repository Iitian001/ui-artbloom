import type { Metadata } from "next"
import Link from "next/link"

import { PageIntro } from "../components/page-intro"
import { ProjectCard } from "../components/project-card"
import { href, projects } from "../data/projects"

export const metadata: Metadata = { title: "Work" }

export default function WorkPage() {
  return (
    <>
      <PageIntro eyebrow="01 / selected work" title="Things we have" accent="built.">
        Projects, experiments and product systems where the engineering and the design had to agree.
      </PageIntro>

      <section className="workEditorial">
        <div className="workLeadNote">
          <span className="topTape" aria-hidden="true" />
          <strong>How we choose work</strong>
          <p>
            A useful problem. A clear point of view. Enough technical difficulty that we learn
            something on the way through.
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
