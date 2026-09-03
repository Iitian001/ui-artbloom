import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ProjectMark } from "../../components/doodles"
import { getProject, href, projects } from "../../data/projects"

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  return project
    ? { title: project.title, description: project.short }
    : { title: "Project not found" }
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  return (
    <article className="caseStudy">
      <Link className="backLink" href={href("/projects")}>
        ← all projects
      </Link>

      <header className="caseHero">
        <div>
          <span className="eyebrow">
            {project.category} / {project.year}
          </span>
          <h1>{project.title}</h1>
          <p>{project.statement}</p>
          <div className="caseStatus">
            STATUS <b>{project.status}</b>
          </div>
        </div>
        <div className="caseArtwork paperPanel">
          <span className="topTape" aria-hidden="true" />
          <ProjectMark seed={project.mark} />
          <span className="caseDoodle" aria-hidden="true">
            selected work ✦
          </span>
        </div>
      </header>

      <section className="caseBody">
        <article>
          <span aria-hidden="true">01</span>
          <h2>The challenge</h2>
          <p>{project.challenge}</p>
        </article>
        <article>
          <span aria-hidden="true">02</span>
          <h2>The approach</h2>
          <p>{project.solution}</p>
        </article>
        <article>
          <span aria-hidden="true">03</span>
          <h2>Built with</h2>
          <div className="caseTags">
            {project.stack.map((item) => (
              <b key={item}>{item}</b>
            ))}
          </div>
        </article>
      </section>

      <footer className="caseFooter">
        {project.external ? (
          <a className="inkButton" href={project.external} target="_blank" rel="noreferrer">
            Open repository ↗
          </a>
        ) : (
          <Link className="inkButton" href={href("/contact")}>
            Ask about this build →
          </Link>
        )}
        <Link className="underLink" href={href("/projects")}>
          Next: project library ↗
        </Link>
      </footer>
    </article>
  )
}
