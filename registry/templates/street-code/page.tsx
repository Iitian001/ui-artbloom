import { Reveal } from "./components/reveal"
import { Ticker } from "./components/ticker"
import {
  Arrow,
  CircleLoop,
  CornerScribble,
  Crown,
  Spark,
  Underline,
} from "./components/doodles"
import { about, brand, contact, hero, projects, skills } from "./data/content"

/**
 * The street-code portfolio: one long scroll.
 *
 * The order is the pitch — a shout, proof it's earned, the story behind it, the
 * kit, then the ask. Every string comes from `data/content.ts`; the only things
 * hard-coded in JSX are the graffiti marks, and those are the point.
 *
 * `scDraw` + `scDrawNow` on a doodle draws its stroke in on load; a doodle inside
 * a `<Reveal>` draws when that block scrolls into view instead.
 */
export default function StreetCodeHome() {
  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="scWrap scHero">
        <div className="scHeroCopy">
          <p className="scKicker">{hero.kicker}</p>

          <h1 className="scDisplay">
            {/* The crown sits over the first line, sprayed on. */}
            <Crown className="scCrown scDraw scDrawNow" />
            {hero.headline.map((word) => {
              const circled = word === hero.circled
              return (
                <span
                  key={word}
                  className={circled ? "scDisplayWord scDisplayWordMark" : "scDisplayWord"}
                >
                  {word}
                  {circled && <CircleLoop className="scWordLoop scDraw scDrawNow" />}
                </span>
              )
            })}
          </h1>

          <p className="scLede">{hero.lede}</p>

          <div className="scHeroActions">
            <a className="scBtn scBtnSolid" href={hero.primary.href}>
              {hero.primary.label}
              <span className="scBtnArrow" aria-hidden="true">
                →
              </span>
            </a>
            <a className="scBtn" href={hero.secondary.href}>
              {hero.secondary.label}
            </a>
          </div>

          <dl className="scHeroStats">
            {hero.stats.map((stat) => (
              <div key={stat.label} className="scStat">
                <dt className="scStatValue">{stat.value}</dt>
                <dd className="scStatLabel">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* The B&W portrait, with the green marker doodles layered over it. */}
        <div className="scPortrait">
          <div className="scPortraitFrame">
            {/* eslint-disable-next-line @next/next/no-img-element -- static asset, no optimization needed */}
            <img
              className="scPortraitImg"
              src={hero.portrait.src}
              alt={hero.portrait.alt}
              width={1024}
              height={1024}
            />
            <CornerScribble className="scPortraitCorner" />
            <Spark className="scPortraitSpark" />
          </div>
          <div className="scPortraitNote">
            <span className="scPortraitNoteText">{hero.portraitNote}</span>
            <Arrow className="scPortraitArrow scDraw scDrawNow" />
          </div>
        </div>
      </section>

      <Ticker />

      {/* ----------------------------------------------------------- about */}
      <section id="about" className="scSection">
        <div className="scWrap">
          <Reveal className="scAbout">
            <div className="scAboutHead">
              <p className="scLabel">{about.label}</p>
              <h2 className="scHeading">
                {about.heading}
                <Underline className="scHeadingRule scDraw" />
              </h2>
            </div>
            <div className="scAboutBody">
              {about.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p className="scAboutSign">{about.signature}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------ work */}
      <section id="work" className="scSection">
        <div className="scWrap">
          <Reveal className="scSectionHead">
            <p className="scLabel">{projects.label}</p>
            <h2 className="scHeading">{projects.heading}</h2>
          </Reveal>

          <div className="scCards">
            {projects.items.map((project, index) => (
              <Reveal key={project.index} className="scCard" delay={index * 80}>
                <div className="scCardTop">
                  <span className="scCardIndex">{project.index}</span>
                  <span className="scCardYear">{project.year}</span>
                </div>
                <h3 className="scCardTitle">{project.title}</h3>
                <p className="scCardBlurb">{project.blurb}</p>
                <ul className="scTags">
                  {project.tags.map((tag) => (
                    <li key={tag} className="scTag">
                      {tag}
                    </li>
                  ))}
                </ul>
                <a
                  className="scCardLink"
                  href={project.link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {project.link.label}
                  <span className="scBtnArrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- skills */}
      <section id="skills" className="scSection">
        <div className="scWrap">
          <Reveal className="scSectionHead">
            <p className="scLabel">{skills.label}</p>
            <h2 className="scHeading">{skills.heading}</h2>
          </Reveal>

          <div className="scSkills">
            {skills.groups.map((group, index) => (
              <Reveal key={group.title} className="scSkillGroup" delay={index * 80}>
                <h3 className="scSkillTitle">
                  <Spark className="scSkillSpark" />
                  {group.title}
                </h3>
                <ul className="scSkillList">
                  {group.items.map((item) => (
                    <li key={item} className="scSkillItem">
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- contact */}
      <section id="contact" className="scSection scContactSection">
        <div className="scWrap">
          <Reveal className="scContact">
            <p className="scLabel">{contact.label}</p>
            <h2 className="scContactHeading">
              {contact.heading}
              <Underline className="scHeadingRule scContactRule scDraw" />
            </h2>
            <p className="scLede">{contact.lede}</p>

            <a className="scBtn scBtnSolid scBtnBig" href={`mailto:${brand.email}`}>
              {contact.emailLabel}
              <span className="scBtnArrow" aria-hidden="true">
                →
              </span>
            </a>

            <ul className="scSocials">
              {contact.socials.map((social) => (
                <li key={social.label}>
                  <a className="scSocial" href={social.href} target="_blank" rel="noreferrer">
                    <span className="scSocialLabel">{social.label}</span>
                    <span className="scSocialHandle">{social.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  )
}
