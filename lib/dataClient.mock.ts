import type { Task, Status } from "@/types"
import { sampleTasks } from "./sampleData"

let tasks: Task[] = JSON.parse(JSON.stringify(sampleTasks))

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const dataClient = {
  async listTasks(): Promise<Task[]> {
    await delay(300)
    return tasks
  },

  async createTask(task: Omit<Task, "id">): Promise<Task> {
    await delay(400)
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
    }
    tasks.push(newTask)
    return newTask
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    await delay(400)
    const index = tasks.findIndex((t) => t.id === id)
    if (index === -1) throw new Error("Task not found")
    tasks[index] = { ...tasks[index], ...updates }
    return tasks[index]
  },

  async deleteTask(id: string): Promise<void> {
    await delay(300)
    tasks = tasks.filter((t) => t.id !== id)
  },

  async updateTaskStatus(id: string, status: Status): Promise<Task> {
    return this.updateTask(id, { status })
  },
}

