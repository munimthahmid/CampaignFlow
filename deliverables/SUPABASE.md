## CampaignFlow — Supabase Wiring Guide

TL;DR
- Keep the UI frontend-first; persist data with Supabase using minimal schema + RLS.
- Use Next.js Server Actions with `@supabase/auth-helpers-nextjs` for CRUD.
- Start with mock client; flip to Supabase by swapping data client calls.

Environment
- Copy `.env.example` to `.env.local` in your Next.js app and set:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Schema
- Apply `supabase/SCHEMA.sql` in the Supabase SQL editor.
- Enables tasks with per-user isolation via `user_id`.

Row Level Security (RLS)
- Apply `supabase/POLICIES.sql` to restrict access to `auth.uid()` rows.

Quickstart
1) Create a new Supabase project.
2) Run SCHEMA.sql, then POLICIES.sql.
3) In Vercel/Local, set env vars from Supabase project settings.
4) Install packages in the Next.js app:
   - `@supabase/supabase-js @supabase/auth-helpers-nextjs zod`
5) Add clients:
   - `lib/supabase/server.ts` and `lib/supabase/client.ts` (snippets below).
6) Implement Server Actions in `app/actions.ts` for `listTasks`, `createTask`, `updateTask`, `deleteTask`.
7) Replace mock `dataClient` calls with these actions.

Types (align UI and DB)
```ts
export type Priority = 'High' | 'Medium' | 'Low';
export type Status = 'Backlog' | 'In Progress' | 'Awaiting Approval' | 'Done';

export interface Influencer {
  id: string;
  handle: string; // "@alex"
  name: string;
  avatarUrl?: string;
  platform: 'Instagram' | 'TikTok' | 'YouTube';
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  influencer: Influencer; // stored as JSONB in DB
  priority: Priority;
  status: Status;
  due_date?: string | null; // ISO
  assignees?: Array<{ id: string; name: string; avatarUrl?: string }>;
  budget?: number | null;
  deliverable?: 'Post' | 'Story' | 'Reel' | 'Short' | null;
  links?: { briefUrl?: string; assetsUrl?: string };
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}
```

Supabase Clients
```ts
// lib/supabase/server.ts
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export const supabaseServer = () => createServerComponentClient({ cookies });

// lib/supabase/client.ts
'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
export const supabaseClient = () => createClientComponentClient();
```

Server Actions (CRUD)
```ts
// app/actions.ts
'use server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';

export async function listTasks() {
  const supabase = createServerActionClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });
  return data ?? [];
}

export async function createTask(formData: FormData) {
  const supabase = createServerActionClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const title = String(formData.get('title') || '').trim();
  const priority = String(formData.get('priority') || 'Medium');
  const influencer = JSON.parse(String(formData.get('influencer') || '{}'));
  const due_date = formData.get('due_date') ? new Date(String(formData.get('due_date')!)).toISOString() : null;
  await supabase.from('tasks').insert({
    title,
    priority,
    status: 'Backlog',
    influencer,
    user_id: user.id,
    due_date,
  });
  revalidatePath('/dashboard');
}

export async function updateTask(id: string, patch: Record<string, any>) {
  const supabase = createServerActionClient({ cookies });
  await supabase.from('tasks').update(patch).eq('id', id);
  revalidatePath('/dashboard');
}

export async function deleteTask(id: string) {
  const supabase = createServerActionClient({ cookies });
  await supabase.from('tasks').delete().eq('id', id);
  revalidatePath('/dashboard');
}
```

Route Protection (optional)
```ts
// middleware.ts
import { NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession();
  return res;
}

export const config = { matcher: ['/dashboard/:path*'] };
```

Adapter Toggle (mock → Supabase)
- Keep the UI calling a small data layer (e.g., `lib/dataClient`).
- Implement two adapters: `mockDataClient` and `supabaseDataClient`.
- Choose based on env (e.g., `NEXT_PUBLIC_DATA_BACKEND=supabase`).

Deployment Notes
- Set env vars in Vercel Project Settings → Environment Variables.
- Ensure `@supabase/auth-helpers-nextjs` cookies work with your domain; use the App Router examples.

