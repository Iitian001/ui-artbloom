import type { Metadata } from "next"

import { ReserveForm } from "../components/reserve-form"
import { Reveal } from "../components/reveal"
import { offer, reserve } from "../data/product"

export const metadata: Metadata = {
  title: "Reserve",
  description: reserve.lede,
}

/** The form, and beside it the terms it commits you to — which is none. */
export default function ReservePage() {
  return (
    <>
      <section className="monoWrap monoPageHead">
        <p className="monoLabel">{reserve.eyebrow}</p>
        <h1 className="monoPageTitle">{reserve.heading}</h1>
        <p className="monoLede">{reserve.lede}</p>
      </section>

      <section className="monoSection monoSectionTight">
        <div className="monoWrap monoReserveGrid">
          <ReserveForm />

          <Reveal className="monoAside">
            <p className="monoLabel">{offer.eyebrow}</p>
            <p className="monoOfferPrice">{offer.price}</p>
            <p className="monoOfferNote">{offer.priceNote}</p>
            <ul className="monoAsideList">
              {reserve.terms.map((term) => (
                <li key={term}>{term}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  )
}
