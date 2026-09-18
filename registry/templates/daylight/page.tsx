import { Reveal } from "./components/reveal"
import { about, contact, experience, hero, profile, projects, skills, stats } from "./data/content"

/**
 * The daylight portfolio: one long, bright scroll.
 *
 * Hero, a quick-facts strip, about, skills, featured work, an experience
 * timeline, and a closing contact card. Every string comes from
 * `data/content.ts`; the section ids match the header anchors.
 */
export default function DaylightHome() {
  return (
    <>
      {/* ------------------------------------------------------------- hero */}
      <section className="dlWrap dlHero">
        <div className="dlHeroGrid">
          <div>
            <p className="dlHeroGreeting">{hero.greeting}</p>
            <h1 className="dlHeroTitle">{hero.headline}</h1>
            <p className="dlLede">{hero.lede}</p>
            <div className="dlHeroActions">
              <a className="dlBtn dlBtnSolid" href={hero.primary.href}>
                {hero.primary.label}
                <span className="dlArrow" aria-hidden="true">
                  →
                </span>
              </a>
              <a className="dlBtn" href={hero.secondary.href}>
                {hero.secondary.label}
              </a>
            </div>
          </div>

          <div className="dlHeroArt">
            <img
              className="dlHeroPortrait"
              src={profile.portrait.src}
              width={profile.portrait.width}
              height={profile.portrait.height}
              alt={`${profile.name} ${profile.surname}, ${profile.role}`}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ stats */}
      <section className="dlWrap dlSection dlSectionTight">
        <Reveal className="dlStats">
          {stats.map((stat) => (
            <div className="dlStat" key={stat.label}>
              <span className="dlStatValue">{stat.value}</span>
              <span className="dlStatLabel">{stat.label}</span>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ------------------------------------------------------------ about */}
      <section id="about" className="dlWrap dlSection dlSectionTight">
        <Reveal className="dlAbout">
          <div>
            <p className="dlLabel">{about.label}</p>
            <h2 className="dlHeading">{about.heading}</h2>
            <div className="dlAboutBody" style={{ marginTop: "1.5rem" }}>
              {about.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <figure className="dlAboutFigure">
            <img
              className="dlAboutImage"
              src={about.image.src}
              width={about.image.width}
              height={about.image.height}
              alt={about.image.alt}
              loading="lazy"
              decoding="async"
            />
            <figcaption className="dlAboutCaption">{about.caption}</figcaption>
          </figure>
        </Reveal>
      </section>

      {/* ----------------------------------------------------------- skills */}
      <section id="skills" className="dlWrap dlSection dlSectionTight">
        <Reveal className="dlSectionHead">
          <p className="dlLabel">{skills.label}</p>
          <h2 className="dlHeading">{skills.heading}</h2>
          <p className="dlLede">{skills.lede}</p>
        </Reveal>
        <div className="dlSkills">
          {skills.groups.map((group, index) => (
            <Reveal className="dlSkillGroup" key={group.title} delay={index * 70}>
              <h3 className="dlSkillTitle">{group.title}</h3>
              <div className="dlChips">
                {group.items.map((item) => (
                  <span className="dlChip" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------- projects */}
      <section id="work" className="dlWrap dlSection dlSectionTight">
        <Reveal className="dlSectionHead">
          <p className="dlLabel">{projects.label}</p>
          <h2 className="dlHeading">{projects.heading}</h2>
        </Reveal>
        <div className="dlProjects">
          {projects.items.map((project, index) => {
            const image = "image" in project ? project.image : undefined
            const accent = "accent" in project ? project.accent : undefined
            return (
              <Reveal className="dlCard" as="article" key={project.title} delay={index * 80}>
                <div className="dlCardThumb" data-accent={accent}>
                  {image ? (
                    <img src={image.src} width={image.width} height={image.height} alt="" loading="lazy" decoding="async" />
                  ) : (
                    <span className="dlCardMark" aria-hidden="true">
                      {project.title}
                    </span>
                  )}
                </div>
                <div className="dlCardBody">
                  <h3 className="dlCardTitle">{project.title}</h3>
                  <p className="dlCardBlurb">{project.blurb}</p>
                  <div className="dlCardTags">
                    {project.tags.map((tag) => (
                      <span className="dlTag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="dlCardLinks">
                    {project.links.map((link) => (
                      <a className="dlCardLink" href={link.href} key={link.href} target="_blank" rel="noreferrer">
                        {link.label}
                        <span aria-hidden="true">→</span>
                      </a>
                    ))}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* ------------------------------------------------------- experience */}
      <section id="experience" className="dlWrap dlSection dlSectionTight">
        <Reveal className="dlSectionHead">
          <p className="dlLabel">{experience.label}</p>
          <h2 className="dlHeading">{experience.heading}</h2>
        </Reveal>
        <div className="dlTimeline">
          {experience.roles.map((role, index) => (
            <Reveal className="dlBeat" key={role.company} delay={index * 60}>
              <span className="dlBeatPeriod">{role.period}</span>
              <div>
                <h3 className="dlBeatTitle">
                  {role.title} <span className="dlBeatCompany">· {role.company}</span>
                </h3>
                <p className="dlBeatBody">{role.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- contact */}
      <section id="contact" className="dlWrap dlSection dlSectionTight">
        <Reveal className="dlContact">
          <p className="dlLabel">{contact.label}</p>
          <h2 className="dlHeading">{contact.heading}</h2>
          <p className="dlLede">{contact.lede}</p>
          <div className="dlContactActions">
            <a className="dlBtn dlBtnSolid" href={contact.cta.href}>
              {contact.cta.label}
              <span className="dlArrow" aria-hidden="true">
                →
              </span>
            </a>
            <a className="dlContactLink" href={profile.github.href} target="_blank" rel="noreferrer">
              {profile.github.label}
            </a>
            <a className="dlContactLink" href={profile.linkedin.href} target="_blank" rel="noreferrer">
              {profile.linkedin.label}
            </a>
          </div>
        </Reveal>
      </section>
    </>
  )
}
