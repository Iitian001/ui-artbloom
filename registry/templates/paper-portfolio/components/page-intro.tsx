export type PageIntroProps = {
  eyebrow: string
  title: string
  /** Highlighted tail of the heading. */
  accent?: string
  children: React.ReactNode
}

export function PageIntro({ eyebrow, title, accent, children }: PageIntroProps) {
  return (
    <section className="pageIntro">
      <span className="eyebrow">{eyebrow}</span>
      <h1>
        {title} {accent ? <mark>{accent}</mark> : null}
      </h1>
      <p>{children}</p>
      <span className="introDoodle" aria-hidden="true">
        ↘
      </span>
    </section>
  )
}
