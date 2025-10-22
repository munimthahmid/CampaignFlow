"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { USING_SUPABASE } from "@/lib/config"
import { supabaseClient } from "@/lib/supabase/client"

function VerifyEmailContent() {
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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center space-y-3 mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center font-bold text-2xl mx-auto text-white shadow-glow-purple hover-lift">
            CF
          </div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">Verify Your Email</h1>
          <p className="text-muted-foreground text-lg">{message}</p>
        </div>

        <div className="glass-card rounded-2xl p-8 space-y-6 animate-slide-up">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground uppercase tracking-wide">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3.5 rounded-xl bg-background/50 border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300 hover:border-accent/50"
            />
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 animate-scale-in">
              <p className="text-sm text-destructive font-medium">{error}</p>
            </div>
          )}

          <button
            onClick={handleResend}
            disabled={isSending}
            className="w-full px-6 py-3.5 rounded-xl gradient-accent text-white font-semibold hover-lift disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-glow-purple"
          >
            {isSending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : (
              "Resend Confirmation Email"
            )}
          </button>
        </div>

        <div className="mt-8 text-center">
          <Link href="/login" className="gradient-text font-semibold hover:underline transition-all">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}

