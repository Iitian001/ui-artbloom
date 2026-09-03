import type { Metadata } from "next"

import { PageIntro } from "../components/page-intro"
import { ProjectCard } from "../components/project-card"
import { projects } from "../data/projects"

export const metadata: Metadata = { title: "Projects" }

export default function ProjectsPage() {
  return (
    <>
      <PageIntro eyebrow="03 / project library" title="Products, agents &" accent="experiments.">
        A growing shelf of shipped ideas, active builds and explorations.
      </PageIntro>
      <section className="projectLibrary">
        {projects.map((project, index) => (
          <ProjectCard project={project} key={project.slug} index={index} />
        ))}
      </section>
    </>
  )
}
