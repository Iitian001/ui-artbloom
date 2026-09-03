import Link from "next/link"

import { TornCollage } from "./components/doodles"
import { HeroMotion } from "./components/hero-motion"
import { ProjectCard } from "./components/project-card"
import { featuredProjects, href, profile } from "./data/projects"

const TOOLS: Array<[string, string]> = [
  ["N", "Next.js"],
  ["TS", "TypeScript"],
  ["◇", "Design systems"],
  ["Py", "Python"],
  ["⚡", "Edge runtimes"],
  ["♟", "Accessibility"],
]

export default function PaperPortfolioHome() {
  return (
    <>
      <section className="homeHero">
        <div className="heroCopy">
          <div className="helloLine">
            hey! we&apos;re <span aria-hidden="true">↘</span>
          </div>
          <div className="heroCrown" aria-hidden="true">
            ♔
          </div>
          <h1>
            {profile.name}
            <br />
            <mark>{profile.surname}</mark>
          </h1>
          <h2>{profile.role}</h2>
          <span className="orangeUnderline" aria-hidden="true" />
          <p className="heroStatement">
            We build with code,
            <br />
            care and <em>stubbornness.</em>
          </p>
          <p className="heroIntro">
            A small studio making interfaces that hold up under real use — product surfaces,
            developer tools and the unglamorous parts nobody screenshots.
          </p>
          <div className="heroActions">
            <Link className="inkButton" href={href("/work")}>
              View our work <span aria-hidden="true">→</span>
            </Link>
            <Link className="underLink" href={href("/resume")}>
              Capabilities <span aria-hidden="true">↘</span>
            </Link>
          </div>
        </div>

        <aside className="identityNote">
          <span className="topTape" aria-hidden="true" />
          <div>
            <b aria-hidden="true">⌖</b>
            <span>{profile.location}</span>
          </div>
          <div>
            <b aria-hidden="true">◎</b>
            <a href={profile.siteUrl} target="_blank" rel="noreferrer">
              {profile.site}
            </a>
          </div>
          <div>
            <b aria-hidden="true">◉</b>
            <a href={profile.repoUrl} target="_blank" rel="noreferrer">
              {profile.handle}
            </a>
          </div>
          <div>
            <b aria-hidden="true">♜</b>
            <span>{profile.studio}</span>
          </div>
        </aside>

        <HeroMotion>
          <div className="heroArtwork">
            <span className="artTape artTapeOne" aria-hidden="true" />
            <span className="artTape artTapeTwo" aria-hidden="true" />
            <TornCollage />
          </div>
        </HeroMotion>

        <aside className="whatIDo stickyNote">
          <span className="topTape" aria-hidden="true" />
          <h3>WHAT WE DO</h3>
          <ul>
            <li>Product interfaces</li>
            <li>Front-end architecture</li>
            <li>Design systems</li>
            <li>Developer tooling</li>
            <li>Performance work</li>
          </ul>
          <span className="rocketDoodle" aria-hidden="true">
            ♧
          </span>
        </aside>

        <aside className="aboutSnippet">
          <span className="curvedArrow" aria-hidden="true">
            ↪
          </span>
          <h3>A BIT ABOUT US</h3>
          <p>
            We like the part of a project where the idea meets the constraint. Small team, long
            attention span, a preference for shipping the difficult version.
          </p>
          <Link className="blackNote" href={href("/about")}>
            Still learning.
            <br />
            Still building. <span aria-hidden="true">♡</span>
          </Link>
        </aside>
      </section>

      <section className="featuredSection">
        <div className="sectionTitleLine">
          <h2>FEATURED WORK</h2>
          <span aria-hidden="true">☆</span>
          <Link href={href("/projects")}>See the whole shelf ↘</Link>
        </div>
        <div className="homeProjectGrid">
          {featuredProjects.map((project, index) => (
            <ProjectCard project={project} compact key={project.slug} index={index} />
          ))}
        </div>
      </section>

      <section className="homeBottomRow">
        <div className="toolsBlock">
          <h2>TOOLS &amp; HABITS</h2>
          <div className="toolChips">
            {TOOLS.map(([glyph, tool]) => (
              <span key={tool}>
                <b aria-hidden="true">{glyph}</b>
                {tool}
              </span>
            ))}
          </div>
        </div>
        <div className="connectBlock">
          <h2>LET&apos;S CONNECT</h2>
          <div className="socialRow">
            <Link href={href("/contact")} aria-label="Contact">
              <span aria-hidden="true">✉</span>
            </Link>
            <a href={profile.repoUrl} target="_blank" rel="noreferrer" aria-label="GitHub">
              <span aria-hidden="true">GH</span>
            </a>
            <a href={profile.siteUrl} target="_blank" rel="noreferrer" aria-label="Website">
              <span aria-hidden="true">◎</span>
            </a>
          </div>
        </div>
        <Link className="conversationNote" href={href("/contact")}>
          Good projects start
          <br />
          with a conversation.
          <br />
          <b>Start one. →</b>
        </Link>
      </section>
    </>
  )
}
