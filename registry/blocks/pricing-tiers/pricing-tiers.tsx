function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className="mt-0.5 h-5 w-5 flex-none text-indigo-600"
    >
      <path
        fillRule="evenodd"
        d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.5 7.6a1 1 0 0 1-1.424 0l-3.5-3.548a1 1 0 0 1 1.424-1.404l2.788 2.826 6.788-6.888a1 1 0 0 1 1.418-.006Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const plans = [
  {
    name: "Starter",
    description: "Everything you need to launch your first project.",
    price: "$0",
    featured: false,
    cta: "Get started",
    features: [
      "Up to 3 active projects",
      "1 GB of asset storage",
      "Community support",
      "Basic analytics dashboard",
      "Weekly export to CSV",
    ],
  },
  {
    name: "Pro",
    description: "For growing teams that ship on a regular cadence.",
    price: "$29",
    featured: true,
    cta: "Start free trial",
    features: [
      "Unlimited active projects",
      "100 GB of asset storage",
      "Priority email support",
      "Advanced analytics and funnels",
      "Custom domains and branding",
    ],
  },
  {
    name: "Team",
    description: "Scale securely with roles, audit logs, and SSO.",
    price: "$79",
    featured: false,
    cta: "Contact sales",
    features: [
      "Everything in Pro, plus",
      "Unlimited team members",
      "SAML single sign-on",
      "Audit logs and access controls",
      "Dedicated success manager",
    ],
  },
];

export default function PricingTiers() {
  return (
    <section className="w-full bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-indigo-600">Pricing</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            Pick the plan that fits today and upgrade anytime — no hidden fees, no surprises.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={
                plan.featured
                  ? "relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-2 ring-indigo-600 lg:-mt-4"
                  : "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              }
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                    Most popular
                  </span>
                </div>
              )}

              <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
              <p className="mt-2 text-sm text-slate-500">{plan.description}</p>

              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-slate-900">
                  {plan.price}
                </span>
                <span className="text-sm font-medium text-slate-500">/mo</span>
              </p>

              <a
                href="#"
                className={
                  plan.featured
                    ? "mt-6 inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    : "mt-6 inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                }
              >
                {plan.cta}
              </a>

              <ul role="list" className="mt-8 space-y-3 border-t border-slate-200 pt-6 text-sm text-slate-600">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
