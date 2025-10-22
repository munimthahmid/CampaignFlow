"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { USING_SUPABASE } from "@/lib/config"
import { supabaseClient } from "@/lib/supabase/client"
const GOOGLE_OAUTH_ENABLED = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED === 'true'

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

  const handleGoogle = async () => {
    if (!USING_SUPABASE) return
    const supabase = supabaseClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      // No toast provider here; we can route users to docs or show an inline message on login page
      alert('Google sign-in is not enabled. Enable the Google provider in Supabase → Authentication → Providers → Google and add Client ID/Secret, then retry.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Brand */}
        <div className="text-center space-y-3 mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center font-bold text-2xl mx-auto text-white shadow-glow-purple hover-lift">
            CF
          </div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">Join CampaignFlow</h1>
          <p className="text-muted-foreground text-lg">Start managing influencer campaigns today</p>
        </div>

        {/* Glass card container */}
        <div className="glass-card rounded-2xl p-8 space-y-6 animate-slide-up">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground uppercase tracking-wide">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3.5 rounded-xl bg-background/50 border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300 hover:border-accent/50"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground uppercase tracking-wide">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-xl bg-background/50 border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300 hover:border-accent/50"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">Must be at least 8 characters</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3.5 rounded-xl gradient-accent text-white font-semibold hover-lift disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-glow-purple"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {GOOGLE_OAUTH_ENABLED && (
            <>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Or Continue With</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              </div>

              <button
                onClick={handleGoogle}
                className="w-full px-6 py-3.5 rounded-xl border-2 border-border bg-card/50 text-foreground hover:bg-card hover:border-accent/50 transition-all duration-300 font-semibold cursor-pointer flex items-center justify-center gap-3 group hover-lift"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="group-hover:gradient-text transition-all">Sign up with Google</span>
              </button>
            </>
          )}
        </div>

        {/* Footer links */}
        <div className="mt-8 space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="gradient-text font-semibold hover:underline transition-all">
              Sign in
            </Link>
          </p>

          <p className="text-xs text-muted-foreground/70">
            By creating an account, you agree to our{" "}
            <Link href="#" className="hover:text-accent transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="hover:text-accent transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
