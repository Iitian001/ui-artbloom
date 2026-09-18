const faqs = [
  {
    question: "How does billing work?",
    answer:
      "We bill monthly or annually based on the plan you choose, and annual plans save you two months compared to paying month to month. Your card is charged automatically on your renewal date, and every invoice is available to download from the billing section of your dashboard.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes. Every plan starts with a 14-day free trial that unlocks the full feature set, and we never ask for a credit card to get started. When the trial ends you can pick a plan to keep going, or your workspace simply pauses until you're ready.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Absolutely. You can cancel from your account settings in a couple of clicks, with no phone calls and no retention hoops. Your plan stays active until the end of the current billing period, so you keep access to everything you've already paid for.",
  },
  {
    question: "Can I export my data?",
    answer:
      "Your data belongs to you. You can export everything to CSV or JSON at any time, and our API lets you pull records programmatically whenever you need them. If you ever leave, we make it easy to take your data with you.",
  },
  {
    question: "What kind of support do you offer?",
    answer:
      "Every plan includes email support with a response time under one business day, plus a searchable help center full of guides and walkthroughs. Teams on our higher tiers also get priority chat support and a dedicated onboarding specialist.",
  },
  {
    question: "How do you keep my data secure?",
    answer:
      "Security is built in from the start. All data is encrypted in transit and at rest, we run continuous monitoring, and we're SOC 2 Type II compliant. We also support single sign-on and role-based access controls so your team stays protected.",
  },
];

export default function Faq() {
  return (
    <section className="w-full bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-indigo-600">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            Everything you need to know about plans, billing, and keeping your data safe.
          </p>
        </div>

        <div className="mt-12 divide-y divide-slate-200 border-y border-slate-200">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              open={index === 0}
              className="group py-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-medium text-slate-900 [&::-webkit-details-marker]:hidden">
                {faq.question}
                <svg
                  className="size-5 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-45"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M10 4v12M4 10h12" />
                </svg>
              </summary>
              <p className="mt-3 text-slate-500">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
