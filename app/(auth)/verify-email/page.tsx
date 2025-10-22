"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { USING_SUPABASE } from "@/lib/config"
import { supabaseClient } from "@/lib/supabase/client"

export default function VerifyEmailPage() {
  const params = useSearchParams()
  const router = useRouter()
  const emailParam = params.get("email") || ""
  const [email, setEmail] = useState(emailParam)
  const [isSending, setIsSending] = useState(false)
  const [message, setMessage] = useState<string>("Check your inbox to confirm your email address.")
  const [error, setError] = useState<string>("")

  const handleResend = async () => {
    setError("")
    if (!email) {
      setError("Enter your email to resend confirmation.")
      return
    }
    if (!USING_SUPABASE) {
      setMessage("Resend is only required with Supabase auth.")
      return
    }
    setIsSending(true)
    try {
      const supabase = supabaseClient()
      const { error } = await supabase.auth.resend({ type: "signup", email })
      if (error) {
        setError(error.message)
      } else {
        setMessage("Confirmation email sent. Please check your inbox.")
      }
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-lg bg-accent text-accent-foreground flex items-center justify-center font-bold text-lg mx-auto">
            CF
          </div>
          <h1 className="text-2xl font-bold text-foreground">Verify your email</h1>
          <p className="text-muted-foreground">{message}</p>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
          {error && <p className="text-sm text-rose-500">{error}</p>}
          <button
            onClick={handleResend}
            disabled={isSending}
            className="w-full px-4 py-2 rounded-lg bg-accent text-accent-foreground font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isSending ? "Sending..." : "Resend confirmation email"}
          </button>
        </div>

        <div className="text-center text-sm">
          <Link href="/login" className="text-accent hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}

