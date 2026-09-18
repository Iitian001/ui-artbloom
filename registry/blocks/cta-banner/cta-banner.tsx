export default function CtaBanner() {
  return (
    <section className="w-full bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 px-6 py-16 sm:px-16 sm:py-20 text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -right-10 h-80 w-80 rounded-full bg-violet-300/20 blur-3xl"
          />

          <div className="relative z-10">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Ready to ship faster?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-indigo-100">
              Turn ideas into production-ready interfaces in minutes. Start
              building today, no credit card required.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#get-started"
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Get started free
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="ml-2 h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 3.71a1 1 0 0 1 1.42 0l5.66 5.66a1 1 0 0 1 0 1.42l-5.66 5.66a1 1 0 1 1-1.42-1.42L12.16 10 7.21 5.05a1 1 0 0 1 0-1.34Z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#book-demo"
                className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold text-white ring-1 ring-inset ring-white/40 hover:bg-white/10"
              >
                Book a demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
