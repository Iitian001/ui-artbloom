"use client"

import { useState } from "react"

import { profile } from "../data/projects"

type Status = "idle" | "shared" | "copied" | "mail" | "failed"

const HINTS: Record<Exclude<Status, "idle">, string> = {
  shared: "Shared. Thanks — a reply usually comes within a day or two.",
  copied: `Copied to your clipboard. Paste it into an email to ${profile.email}.`,
  mail: "Your email app should be opening with the message ready to send.",
  failed: `Could not copy automatically. Email ${profile.email} and paste the message yourself.`,
}

/**
 * A contact form with no backend, on purpose.
 *
 * A static template cannot host a mail server, and pretending otherwise means a
 * form that silently drops messages. So this hands the message to something that
 * *can* send it: the native share sheet, the clipboard, or a `mailto:` link, in
 * that order. Wire it to an action or an API route if you want real submissions.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle")
  const [copied, setCopied] = useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get("name") || "Website visitor")
    const email = String(data.get("email") || "")
    const message = String(data.get("message") || "")
    const subject = `Enquiry for ${profile.studio}`
    const text = `${subject}\n\n${message}\n\nFrom: ${name}\nEmail: ${email}`

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: subject, text })
        setStatus("shared")
        return
      } catch (error) {
        /* The user closing the sheet is not a failure — leave the form alone. */
        if (error instanceof Error && error.name === "AbortError") return
      }
    }

    try {
      await navigator.clipboard.writeText(text)
      setStatus("copied")
      return
    } catch {
      /*
       * Clipboard access fails on insecure origins and whenever permission is
       * refused. Fall through rather than swallowing the message.
       */
    }

    try {
      const url = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`
      window.location.href = url
      setStatus("mail")
    } catch {
      setStatus("failed")
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setStatus("failed")
    }
  }

  return (
    <div className="contactFormWrap">
      <form className="contactForm" onSubmit={submit}>
        <label>
          <span>Your name</span>
          <input name="name" required placeholder="Write it here..." autoComplete="name" />
        </label>
        <label>
          <span>Your email</span>
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>
        <label className="fullField">
          <span>What are we building?</span>
          <textarea
            name="message"
            required
            rows={7}
            placeholder="Tell me about the idea, the problem, or the collaboration..."
          />
        </label>
        <button className="inkButton" type="submit">
          Share / copy message <span aria-hidden="true">→</span>
        </button>
        <button className="paperButton" type="button" onClick={copyEmail}>
          {copied ? "Email copied ✓" : "Copy email address"}
        </button>
      </form>
      <p className="formHint" role="status" aria-live="polite">
        {status === "idle" ? "" : HINTS[status]}
      </p>
    </div>
  )
}
