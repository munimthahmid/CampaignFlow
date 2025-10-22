import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { supabaseServer } from '@/lib/supabase/server'

export default async function Home() {
  const backend = process.env.NEXT_PUBLIC_DATA_BACKEND || 'mock'

  if (backend === 'supabase') {
    try {
      const supabase = await supabaseServer()
      const { data: { session } } = await supabase.auth.getSession()
      redirect(session ? '/dashboard' : '/login')
    } catch {
      redirect('/login')
    }
  } else {
    const cookieStore = await cookies()
    const hasSession = cookieStore.get('session')?.value
    redirect(hasSession ? '/dashboard' : '/login')
  }
}
