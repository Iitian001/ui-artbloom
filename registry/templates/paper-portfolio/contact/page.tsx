import type { Metadata } from "next"

import { ContactForm } from "../components/contact-form"
import { PageIntro } from "../components/page-intro"
import { profile } from "../data/projects"

export const metadata: Metadata = { title: "Contact" }

export default function ContactPage() {
  return (
    <>
      <PageIntro eyebrow="04 / contact" title="Have an idea?" accent="Write on the page.">
        For projects, collaborations, or a technical problem that sounds interesting enough to argue
        about.
      </PageIntro>

      <section className="contactPageGrid">
        <ContactForm />
        <aside className="contactSidebar">
          <div className="stickyNote contactSticky">
            <span className="topTape" aria-hidden="true" />
            <h2>Find us online</h2>
            <a href={profile.siteUrl} target="_blank" rel="noreferrer">
              {profile.site} ↗
            </a>
            <p>{profile.location}</p>
          </div>
          <div className="contactLinks paperPanel">
            <a href={profile.repoUrl} target="_blank" rel="noreferrer">
              GitHub <span aria-hidden="true">↗</span>
            </a>
            <a href={`mailto:${profile.email}`}>
              {profile.email} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </aside>
      </section>
    </>
  )
}
