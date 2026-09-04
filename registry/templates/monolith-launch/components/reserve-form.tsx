"use client"

import { useState } from "react"

import { brand, reserve } from "../data/product"

/**
 * The reservation form, with no backend — on purpose.
 *
 * A template cannot host a mail server or a database, and a form that silently
 * drops what someone typed is worse than one that admits it. So this hands the
 * message to something that can actually deliver it: the user's mail client, via
 * a `mailto:` the browser opens. Nothing is stored and nothing is sent anywhere
 * else.
 *
 * To make it real, replace `submit` with a server action or a `fetch` to your own
 * route. The markup and the status line can stay exactly as they are.
 */
export function ReserveForm() {
  const [sent, setSent] = useState(false)

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const get = (key: string) => String(data.get(key) ?? "").trim()

    const body = [
      `Name: ${get("name")}`,
      `Email: ${get("email")}`,
      `Country: ${get("country")}`,
      "",
      get("note") || "(no note)",
    ].join("\n")

    /* `encodeURIComponent` on both halves — a name with an `&` in it would
       otherwise truncate the whole mailto. */
    const subject = encodeURIComponent(`${brand.product} reservation`)
    window.location.href = `mailto:${brand.email}?subject=${subject}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <form className="monoForm" onSubmit={submit}>
      <div className="monoField">
        <label className="monoFieldLabel" htmlFor="mono-name">
          {reserve.fields.name}
        </label>
        <input className="monoInput" id="mono-name" name="name" required autoComplete="name" />
      </div>

      <div className="monoField">
        <label className="monoFieldLabel" htmlFor="mono-email">
          {reserve.fields.email}
        </label>
        <input
          className="monoInput"
          id="mono-email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
      </div>

      <div className="monoField">
        <label className="monoFieldLabel" htmlFor="mono-country">
          {reserve.fields.country}
        </label>
        <input
          className="monoInput"
          id="mono-country"
          name="country"
          required
          autoComplete="country-name"
        />
      </div>

      <div className="monoField">
        <label className="monoFieldLabel" htmlFor="mono-note">
          {reserve.fields.note}
        </label>
        <textarea className="monoInput monoTextarea" id="mono-note" name="note" rows={4} />
      </div>

      <div className="monoHeroActions">
        <button type="submit" className="monoBtn monoBtnSolid">
          {reserve.submit}
          <span className="monoArrow" aria-hidden="true">
            →
          </span>
        </button>
      </div>

      {sent && (
        <p className="monoFormStatus" role="status">
          Your mail app should be opening with the message ready to send to {brand.email}. Nothing
          was stored by this page.
        </p>
      )}

      <p className="monoFormNote">{reserve.finePrint}</p>
    </form>
  )
}
