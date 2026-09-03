import Link from "next/link"

import { href, type Project } from "../data/projects"

import { ProjectMark } from "./doodles"

export type ProjectCardProps = {
  project: Project
  /** The tighter variant used in the home-page grid. */
  compact?: boolean
  /** Position in the list. Only used to alternate the paper tilt. */
  index?: number
}

export function ProjectCard({ project, compact = false, index = 0 }: ProjectCardProps) {
  return (
    <Link
      href={href(`/projects/${project.slug}`)}
      className={compact ? "projectCard compact" : "projectCard"}
      /*
       * A custom property, so the hover rule in CSS can flatten the tilt without
       * needing to know which way this particular card leans.
       */
      style={{ "--tilt": `${index % 2 ? 0.6 : -0.5}deg` } as React.CSSProperties}
    >
      <ProjectMark seed={project.mark} />
      <div className="projectCardCopy">
        <div className="projectMeta">
          {project.category} · {project.year}
        </div>
        <h3>{project.title}</h3>
        <p>{project.short}</p>
      </div>
      <span className="projectArrow" aria-hidden="true">
        →
      </span>
    </Link>
  )
}
