import type { Metadata } from "next"

import { AuthForm } from "@/components/auth-form"

export const metadata: Metadata = {
  title: "Sign up",
  description: "Two copies a day, free. No card.",
}

export default function SignupPage() {
  return <AuthForm mode="signup" />
}
