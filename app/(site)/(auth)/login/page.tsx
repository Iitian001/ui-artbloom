import type { Metadata } from "next"

import { AuthForm } from "@/components/auth-form"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to reach your lists and install history.",
}

export default function LoginPage() {
  return <AuthForm mode="login" />
}
