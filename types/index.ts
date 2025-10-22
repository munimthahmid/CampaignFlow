export type Platform = "Instagram" | "TikTok" | "YouTube"
export type Priority = "High" | "Medium" | "Low"
export type Status = "Backlog" | "In Progress" | "Awaiting Approval" | "Done"
export type Deliverable = "Post" | "Story" | "Reel" | "Short"

export interface Influencer {
  id: string
  handle: string
  name: string
  avatarUrl?: string
  platform: Platform
}

export interface Assignee {
  id: string
  name: string
  avatarUrl?: string
}

export interface Task {
  id: string
  title: string
  influencer: Influencer
  priority: Priority
  status: Status
  dueDate?: string
  assignees?: Assignee[]
  budget?: number
  deliverable?: Deliverable
  links?: {
    briefUrl?: string
    assetsUrl?: string
  }
  notes?: string
}

export interface FilterState {
  search: string
  priority: Priority | "All"
  platform: Platform | "All"
  assignee: string | "All"
}
