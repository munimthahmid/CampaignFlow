"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { USING_SUPABASE } from "@/lib/config"
import { supabaseClient } from "@/lib/supabase/client"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    if (USING_SUPABASE) {
      const supabase = supabaseClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      setIsLoading(false)
      if (error) return
      // If email confirmation is enabled, Supabase won't return a session.
      if (!data.session) {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`)
      } else {
        router.push('/dashboard')
      }
    } else {
      setTimeout(() => {
        document.cookie = `session=demo; max-age=${7 * 24 * 60 * 60}; path=/`
        router.push("/dashboard")
      }, 600)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-lg bg-accent text-accent-foreground flex items-center justify-center font-bold text-lg mx-auto">
            CF
          </div>
          <h1 className="text-3xl font-bold text-foreground">Create your account</h1>
          <p className="text-muted-foreground">Start managing influencer campaigns</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 rounded-lg bg-accent text-accent-foreground font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
