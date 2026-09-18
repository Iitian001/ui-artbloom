import type { SVGProps } from "react";

/**
 * Wordmark logos drawn as inline SVG so the block ships with no image assets.
 * Each is a simple mark + label; swap in real brand SVGs when you use it.
 */

function Northwind(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 140 32" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M6 24V8l10 12V8h3v16h-3L6 12v12H6z" />
      <text x="26" y="22" fontSize="15" fontWeight="600" fontFamily="system-ui, sans-serif">
        Northwind
      </text>
    </svg>
  );
}

function Cadence(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 130 32" fill="currentColor" aria-hidden="true" {...props}>
      <circle cx="14" cy="16" r="7" fill="none" stroke="currentColor" strokeWidth="3" />
      <text x="28" y="22" fontSize="15" fontWeight="700" fontFamily="system-ui, sans-serif">
        Cadence
      </text>
    </svg>
  );
}

function Stackfold(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 140 32" fill="currentColor" aria-hidden="true" {...props}>
      <rect x="6" y="9" width="14" height="14" rx="3" transform="rotate(45 13 16)" />
      <text x="28" y="22" fontSize="15" fontWeight="600" fontFamily="system-ui, sans-serif">
        Stackfold
      </text>
    </svg>
  );
}

function Loom(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 110 32" fill="currentColor" aria-hidden="true" {...props}>
      <circle cx="9" cy="16" r="4" />
      <circle cx="20" cy="16" r="4" />
      <text x="30" y="22" fontSize="15" fontWeight="700" fontFamily="system-ui, sans-serif">
        Loom
      </text>
    </svg>
  );
}

function Parcel(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 32" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13 6l7 4v8l-7 4-7-4v-8l7-4z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <text x="28" y="22" fontSize="15" fontWeight="600" fontFamily="system-ui, sans-serif">
        Parcel
      </text>
    </svg>
  );
}

function Bright(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 32" fill="currentColor" aria-hidden="true" {...props}>
      <circle cx="13" cy="16" r="5" />
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M13 4v3M13 25v3M4 16H1M25 16h-3M6.5 9.5L4.4 7.4M21.6 24.6l-2.1-2.1M6.5 22.5l-2.1 2.1M21.6 7.4l-2.1 2.1" />
      </g>
      <text x="30" y="22" fontSize="15" fontWeight="700" fontFamily="system-ui, sans-serif">
        Bright
      </text>
    </svg>
  );
}

const logos = [
  { name: "Northwind", Logo: Northwind },
  { name: "Cadence", Logo: Cadence },
  { name: "Stackfold", Logo: Stackfold },
  { name: "Loom", Logo: Loom },
  { name: "Parcel", Logo: Parcel },
  { name: "Bright", Logo: Bright },
];

export default function LogoCloud() {
  return (
    <section className="w-full bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-base font-medium text-slate-500">
          Trusted by fast-moving teams at companies you know
        </h2>

        <div className="mt-12 grid grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          {logos.map(({ name, Logo }) => (
            <div key={name} className="flex justify-center">
              <Logo className="h-8 w-auto text-slate-400 transition-colors hover:text-slate-600" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
