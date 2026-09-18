const testimonials = [
  {
    quote:
      "We shipped our new marketing site in a single afternoon. What used to take a design sprint now takes an hour, and the result looks better than anything we built by hand.",
    name: "Amara Okafor",
    role: "Head of Design, Northwind",
    initials: "AO",
  },
  {
    quote:
      "The components are genuinely production-ready. Accessible, responsive, and clean enough that our engineers stopped rewriting them and just started shipping.",
    name: "Daniel Rossi",
    role: "Staff Engineer, Loom Labs",
    initials: "DR",
  },
  {
    quote:
      "Our conversion rate jumped 24% after the redesign. The pricing and testimonial sections did most of the heavy lifting — they just work out of the box.",
    name: "Priya Nair",
    role: "Growth Lead, Cadence",
    initials: "PN",
  },
  {
    quote:
      "I've tried every UI kit out there. This is the first one where I didn't have to fight the defaults to get something that matched our brand.",
    name: "Marcus Bennett",
    role: "Founder, Stackfold",
    initials: "MB",
  },
  {
    quote:
      "Onboarding a new designer used to mean weeks of ramp-up. Now they pull a block, swap the copy, and they're contributing on day one.",
    name: "Sofia Herrera",
    role: "Design Manager, Bright",
    initials: "SH",
  },
  {
    quote:
      "It feels like having a senior front-end developer on the team. The code is the kind you'd actually approve in review, not something you tolerate.",
    name: "Kenji Tanaka",
    role: "CTO, Parcel",
    initials: "KT",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="Rated 5 out of 5">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className="h-4 w-4 text-amber-400"
        >
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.77l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="w-full bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-indigo-600">Testimonials</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Loved by teams that ship
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            Thousands of designers and engineers build faster with our blocks. Here&apos;s what a few of them have to say.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <Stars />
              <blockquote className="mt-4 flex-1 text-slate-700">
                <p>&ldquo;{t.quote}&rdquo;</p>
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700"
                >
                  {t.initials}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-slate-900">
                    {t.name}
                  </span>
                  <span className="block truncate text-sm text-slate-500">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
