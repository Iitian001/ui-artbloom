import type { Metadata } from "next"

import { PageIntro } from "../components/page-intro"
import { ProjectCard } from "../components/project-card"
import { projects } from "../data/projects"

export const metadata: Metadata = { title: "Projects" }

export default function ProjectsPage() {
  return (
    <>
      <PageIntro eyebrow="03 / project library" title="Products, tools &" accent="experiments.">
        A growing shelf of shipped work, active builds and things we made on a weekend to find out
        whether they were possible.
      </PageIntro>
      <section className="projectLibrary">
        {projects.map((project, index) => (
          <ProjectCard project={project} key={project.slug} index={index} />
        ))}
      </section>
    </>
  )
}
