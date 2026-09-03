import Link from "next/link"

import { TornCollage } from "./components/doodles"
import { HeroMotion } from "./components/hero-motion"
import { ProjectCard } from "./components/project-card"
import { featuredProjects, href, profile } from "./data/projects"

const TOOLS: Array<[string, string]> = [
  ["N", "Next.js"],
  ["⚡", "FastAPI"],
  ["Py", "Python"],
  ["JS", "TypeScript"],
  ["♟", "AI Agents"],
  ["◇", "Design Systems"],
]

export default function PaperPortfolioHome() {
  return (
    <>
      <section className="homeHero">
        <div className="heroCopy">
          <div className="helloLine">
            hey! I&apos;m <span aria-hidden="true">↘</span>
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
            I build with code,
            <br />
            curiosity and <em>rebellion.</em>
          </p>
          <p className="heroIntro">
            I&apos;m {profile.name} {profile.surname}, an IIT student and developer from India
            building AI tools, digital products, and handcrafted web experiences.
          </p>
          <div className="heroActions">
            <Link className="inkButton" href={href("/work")}>
              View My Work <span aria-hidden="true">→</span>
            </Link>
            <Link className="underLink" href={href("/resume")}>
              View Resume <span aria-hidden="true">↘</span>
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
          <h3>WHAT I DO</h3>
          <ul>
            <li>AI/ML Systems</li>
            <li>Web Development</li>
            <li>UI/UX Design</li>
            <li>Automation</li>
            <li>Product Building</li>
          </ul>
          <span className="rocketDoodle" aria-hidden="true">
            ♧
          </span>
        </aside>

        <aside className="aboutSnippet">
          <span className="curvedArrow" aria-hidden="true">
            ↪
          </span>
          <h3>A BIT ABOUT ME</h3>
          <p>
            I love building things that live at the intersection of code, design and impact. From
            LLM apps to playful experiments — I ship ideas that matter.
          </p>
          <Link className="blackNote" href={href("/about")}>
            Always learning.
            <br />
            Always building. <span aria-hidden="true">♡</span>
          </Link>
        </aside>
      </section>

      <section className="featuredSection">
        <div className="sectionTitleLine">
          <h2>FEATURED WORK</h2>
          <span aria-hidden="true">☆</span>
          <Link href={href("/projects")}>More coming soon! ↘</Link>
        </div>
        <div className="homeProjectGrid">
          {featuredProjects.map((project, index) => (
            <ProjectCard project={project} compact key={project.slug} index={index} />
          ))}
        </div>
      </section>

      <section className="homeBottomRow">
        <div className="toolsBlock">
          <h2>TOOLS &amp; SUPERPOWERS</h2>
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
          Great ideas start
          <br />
          with a conversation.
          <br />
          <b>Let&apos;s do something. →</b>
        </Link>
      </section>
    </>
  )
}
