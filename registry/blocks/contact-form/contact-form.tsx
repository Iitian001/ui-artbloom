function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true" className="h-5 w-5 flex-none text-indigo-600">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true" className="h-5 w-5 flex-none text-indigo-600">
      <path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v10z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true" className="h-5 w-5 flex-none text-indigo-600">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

const details = [
  { Icon: MailIcon, label: "Email us", value: "hello@example.com" },
  { Icon: ChatIcon, label: "Live chat", value: "Available Mon–Fri, 9am–6pm" },
  { Icon: PinIcon, label: "Visit us", value: "100 Market Street, San Francisco" },
];

const inputClass =
  "mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30";

export default function ContactForm() {
  return (
    <section className="w-full bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div className="max-w-lg">
            <p className="text-sm font-semibold text-indigo-600">Contact</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Get in touch
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              Have a question or want to work together? Send us a message and we&apos;ll get back to you within one business day.
            </p>

            <dl className="mt-10 space-y-6">
              {details.map(({ Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <Icon />
                  <div>
                    <dt className="text-sm font-medium text-slate-900">{label}</dt>
                    <dd className="text-sm text-slate-500">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          <form className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium text-slate-900">
                  First name
                </label>
                <input
                  id="first-name"
                  name="first-name"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Jane"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm font-medium text-slate-900">
                  Last name
                </label>
                <input
                  id="last-name"
                  name="last-name"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Doe"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="email" className="block text-sm font-medium text-slate-900">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="jane@example.com"
                className={inputClass}
              />
            </div>

            <div className="mt-5">
              <label htmlFor="message" className="block text-sm font-medium text-slate-900">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Tell us how we can help…"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Send message
            </button>
            <p className="mt-3 text-center text-xs text-slate-400">
              By submitting this form you agree to our privacy policy.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
