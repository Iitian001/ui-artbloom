import Link from "next/link"

import { href, profile } from "../data/projects"

export function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div>
        <span className="footerStar" aria-hidden="true">
          ✱
        </span>
        <strong>
          {profile.name} {profile.surname}
        </strong>
        <p>{profile.role}</p>
      </div>
      <div className="footerLinks">
        <Link href={href("/projects")}>Projects</Link>
        <Link href={href("/contact")}>Contact</Link>
        <a href={profile.repoUrl} target="_blank" rel="noreferrer">
          GitHub ↗
        </a>
        <a href={profile.siteUrl} target="_blank" rel="noreferrer">
          {profile.site} ↗
        </a>
      </div>
    </footer>
  )
}
