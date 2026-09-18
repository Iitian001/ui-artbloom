import { Reveal } from "./components/reveal"
import { Arrow, ArrowNote, Circle, Tick, Underline } from "./components/sketch-marks"
import { about, contact, hero, skills, work } from "./data/content"

const socialIcon: Record<string, React.ReactNode> = {
  github: <GitHubIcon />,
  linkedin: <LinkedInIcon />,
  mail: <MailIcon />,
}

/**
 * The graphite portfolio: one long scroll on warm paper.
 *
 * The order is the argument — who I am, the work, the essay behind it, the
 * toolkit, and a quiet way to get in touch. Every string comes from
 * `data/content.ts`; the marks come from `components/sketch-marks.tsx`.
 */
export default function GraphiteHome() {
  return (
    <>
      {/* ---------------------------------------------------------------- hero */}
      <section className="grWrap grHero">
        <Reveal className="grHeroText">
          <p className="grKicker">{hero.kicker}</p>
          <h1 className="grDisplay">
            {hero.title.map((line) => (
              <span key={line.text} className="grDisplayLine">
                {line.mark ? (
                  <span className="grMarkWord">
                    {line.text}
                    <Underline className="grUnderline" />
                  </span>
                ) : (
                  line.text
                )}
              </span>
            ))}
          </h1>
          <p className="grLede">{hero.lede}</p>
          <div className="grHeroActions">
            <a className="grBtn grBtnSolid" href={hero.primary.href}>
              {hero.primary.label}
              <Arrow className="grArrow" />
            </a>
            <a className="grBtn" href={hero.secondary.href}>
              {hero.secondary.label}
            </a>
          </div>
        </Reveal>

        <Reveal as="figure" className="grPortrait" delay={120}>
          <div className="grPortraitFrame">
            <span className="grTape grTapeLeft" aria-hidden="true" />
            <span className="grTape grTapeRight" aria-hidden="true" />
            <img
              className="grPortraitImg"
              src={hero.portrait.src}
              width={1024}
              height={1024}
              alt={hero.portrait.alt}
            />
          </div>
          <figcaption className="grPortraitCaption">{hero.portrait.caption}</figcaption>
        </Reveal>
      </section>

      <div className="grWrap">
        <hr className="grRule" />
      </div>

      {/* ---------------------------------------------------------------- work */}
      <section id="work" className="grSection grWrap">
        <Reveal className="grSectionHead">
          <p className="grLabel">{work.label}</p>
          <h2 className="grHeading">{work.heading}</h2>
        </Reveal>

        <div className="grWorkGrid">
          {work.projects.map((project, index) => (
            <Reveal
              key={project.index}
              as="article"
              className={`grCard ${index % 2 === 0 ? "grCardOdd" : "grCardEven"}`}
              delay={(index % 2) * 90}
            >
              <div className="grCardHead">
                <span className="grCardIndex">No. {project.index}</span>
                <span className="grCardMeta">
                  {project.kind} · {project.year}
                </span>
              </div>
              <h3 className="grCardTitle">{project.title}</h3>
              <p className="grCardBody">{project.body}</p>
              <ul className="grCardTags">
                {project.tags.map((tag) => (
                  <li key={tag} className="grCardTag">
                    {tag}
                  </li>
                ))}
              </ul>
              <a
                className="grCardLink"
                href={project.link.href}
                target="_blank"
                rel="noreferrer"
              >
                {project.link.label}
                <Arrow className="grArrow" size={16} />
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="grWrap">
        <hr className="grRule" />
      </div>

      {/* --------------------------------------------------------------- about */}
      <section id="about" className="grSection grWrap">
        <div className="grAbout">
          <Reveal className="grAboutHead">
            <p className="grLabel">{about.label}</p>
            <h2 className="grHeading">{about.lead}</h2>
            <span className="grAboutNote">
              <ArrowNote className="grArrowNote" />
              <span>{about.note}</span>
            </span>
          </Reveal>

          <Reveal className="grAboutBody" delay={90}>
            {about.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            <p className="grPull">{about.pull}</p>
          </Reveal>
        </div>
      </section>

      <div className="grWrap">
        <hr className="grRule" />
      </div>

      {/* -------------------------------------------------------------- skills */}
      <section className="grSection grWrap">
        <Reveal className="grSectionHead">
          <p className="grLabel">{skills.label}</p>
          <h2 className="grHeading">{skills.heading}</h2>
        </Reveal>

        <div className="grSkills">
          {skills.groups.map((group, index) => (
            <Reveal key={group.title} className="grSkillGroup" delay={index * 70}>
              <h3 className="grSkillTitle">{group.title}</h3>
              <ul className="grSkillList">
                {group.items.map((item) => (
                  <li key={item} className="grSkillItem">
                    <Tick className="grTick" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="grWrap">
        <hr className="grRule" />
      </div>

      {/* ------------------------------------------------------------- contact */}
      <section id="contact" className="grSection grWrap">
        <Reveal className="grContact">
          <p className="grLabel">{contact.label}</p>
          <h2 className="grContactHeading">
            {contact.heading.lead}{" "}
            <span className="grCircleWord">
              {contact.heading.accent}
              <Circle className="grCircle" />
            </span>
            {contact.heading.tail}
          </h2>
          <p className="grContactBody">{contact.body}</p>
          <div className="grContactActions">
            <a className="grBtn grBtnSolid" href={contact.cta.href}>
              {contact.cta.label}
              <Arrow className="grArrow" />
            </a>
            <ul className="grSocials">
              {contact.socials.map((social) => (
                <li key={social.label}>
                  <a className="grSocial" href={social.href} target="_blank" rel="noreferrer">
                    {socialIcon[social.icon]}
                    <span className="grSocialHandle">{social.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="grNote">{contact.note}</p>
          </div>
        </Reveal>
      </section>
    </>
  )
}

/* Inline social glyphs — small enough that a dependency would be overkill. */

function GitHubIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 1.5a10.5 10.5 0 0 0-3.32 20.47c.53.1.72-.23.72-.5v-1.75c-2.92.63-3.54-1.4-3.54-1.4-.48-1.22-1.17-1.55-1.17-1.55-.96-.65.07-.64.07-.64 1.06.08 1.62 1.09 1.62 1.09.94 1.62 2.47 1.15 3.07.88.1-.68.37-1.15.67-1.42-2.33-.27-4.78-1.17-4.78-5.19 0-1.15.41-2.08 1.09-2.82-.11-.27-.47-1.34.1-2.79 0 0 .89-.28 2.9 1.08a10.1 10.1 0 0 1 5.28 0c2.01-1.36 2.9-1.08 2.9-1.08.57 1.45.21 2.52.1 2.79.68.74 1.09 1.67 1.09 2.82 0 4.03-2.46 4.92-4.8 5.18.38.33.71.97.71 1.96v2.9c0 .28.19.61.73.5A10.5 10.5 0 0 0 12 1.5Z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.75C24 .78 23.2 0 22.22 0Z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x={2.5} y={4.5} width={19} height={15} rx={2} />
      <path d="m3 6 9 6 9-6" />
    </svg>
  )
}
