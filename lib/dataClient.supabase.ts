"use client"

import type { Task, Status } from "@/types"
import { supabaseClient } from "@/lib/supabase/client"

function dbToTask(row: any): Task {
  return {
    id: row.id,
    title: row.title,
    influencer: row.influencer,
    priority: row.priority,
    status: row.status,
    dueDate: row.due_date ?? undefined,
    assignees: row.assignees ?? undefined,
    budget: row.budget ?? undefined,
    deliverable: row.deliverable ?? undefined,
    links: row.links ?? undefined,
    notes: row.notes ?? undefined,
  }
}

function taskToInsert(task: Omit<Task, "id">, userId: string) {
  return {
    user_id: userId,
    title: task.title,
    influencer: task.influencer,
    priority: task.priority,
    status: task.status,
    due_date: task.dueDate ?? null,
    assignees: task.assignees ?? null,
    budget: task.budget ?? null,
    deliverable: task.deliverable ?? null,
    links: task.links ?? null,
    notes: task.notes ?? null,
  }
}

function patchToUpdate(patch: Partial<Task>) {
  const out: Record<string, any> = {}
  if (patch.title !== undefined) out.title = patch.title
  if (patch.influencer !== undefined) out.influencer = patch.influencer
  if (patch.priority !== undefined) out.priority = patch.priority
  if (patch.status !== undefined) out.status = patch.status
  if (patch.dueDate !== undefined) out.due_date = patch.dueDate ?? null
  if (patch.assignees !== undefined) out.assignees = patch.assignees ?? null
  if (patch.budget !== undefined) out.budget = patch.budget ?? null
  if (patch.deliverable !== undefined) out.deliverable = patch.deliverable ?? null
  if (patch.links !== undefined) out.links = patch.links ?? null
  if (patch.notes !== undefined) out.notes = patch.notes ?? null
  return out
}

export const dataClient = {
  async listTasks(): Promise<Task[]> {
    const supabase = supabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
    if (error) throw error
    return (data || []).map(dbToTask)
  },

  async createTask(task: Omit<Task, "id">): Promise<Task> {
    const supabase = supabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    const payload = taskToInsert(task, user.id)
    const { data, error } = await supabase
      .from('tasks')
      .insert(payload)
      .select('*')
      .single()
    if (error) throw error
    return dbToTask(data)
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const supabase = supabaseClient()
    const patch = patchToUpdate(updates)
    const { data, error } = await supabase
      .from('tasks')
      .update(patch)
      .eq('id', id)
      .select('*')
      .single()
    if (error) throw error
    return dbToTask(data)
  },

  async deleteTask(id: string): Promise<void> {
    const supabase = supabaseClient()
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (error) throw error
  },

  async updateTaskStatus(id: string, status: Status): Promise<Task> {
    return this.updateTask(id, { status })
  },
}

