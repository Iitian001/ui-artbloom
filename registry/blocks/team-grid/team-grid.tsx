const team = [
  {
    name: "Elena Vasquez",
    role: "Chief Executive Officer",
    bio: "Previously led product at two venture-backed startups through to acquisition.",
    initials: "EV",
    accent: "bg-indigo-100 text-indigo-700",
  },
  {
    name: "James Okonkwo",
    role: "Chief Technology Officer",
    bio: "Spent a decade building distributed systems before turning to developer tools.",
    initials: "JO",
    accent: "bg-emerald-100 text-emerald-700",
  },
  {
    name: "Mei Lin Chen",
    role: "VP of Design",
    bio: "Obsessed with the details that make an interface feel effortless to use.",
    initials: "MC",
    accent: "bg-rose-100 text-rose-700",
  },
  {
    name: "Omar Haddad",
    role: "VP of Engineering",
    bio: "Believes great teams ship small, ship often, and learn in the open.",
    initials: "OH",
    accent: "bg-amber-100 text-amber-700",
  },
  {
    name: "Grace Thompson",
    role: "Head of Customer Success",
    bio: "Turns first-time users into lifelong advocates, one conversation at a time.",
    initials: "GT",
    accent: "bg-sky-100 text-sky-700",
  },
  {
    name: "Raj Patel",
    role: "Head of Growth",
    bio: "Finds the channels that scale and doubles down before anyone else notices.",
    initials: "RP",
    accent: "bg-violet-100 text-violet-700",
  },
  {
    name: "Nadia Petrova",
    role: "Principal Product Manager",
    bio: "Translates messy customer problems into a roadmap the team can rally behind.",
    initials: "NP",
    accent: "bg-teal-100 text-teal-700",
  },
  {
    name: "Tom Fletcher",
    role: "Head of Marketing",
    bio: "Tells stories that make complex products feel simple and worth caring about.",
    initials: "TF",
    accent: "bg-orange-100 text-orange-700",
  },
];

export default function TeamGrid() {
  return (
    <section className="w-full bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-indigo-600">Our team</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            The people behind the product
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            A small, senior team that cares deeply about the craft of building software.
          </p>
        </div>

        <ul
          role="list"
          className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {team.map((member) => (
            <li key={member.name} className="text-center">
              <span
                aria-hidden="true"
                className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full text-2xl font-semibold ${member.accent}`}
              >
                {member.initials}
              </span>
              <h3 className="mt-5 text-base font-semibold text-slate-900">
                {member.name}
              </h3>
              <p className="text-sm font-medium text-indigo-600">{member.role}</p>
              <p className="mt-3 text-sm text-slate-500">{member.bio}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
