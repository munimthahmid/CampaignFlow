## CampaignFlow — System Outline (Frontend First)

### Goals
- Ship a delightful, production-quality UI for an influencer campaign task board.
- Demonstrate velocity, clear thinking, and pragmatic use of AI tools.
- Keep all data interactions mocked for now; real backend integration later.

### Architecture (UI Modules)
- App Shell: header (brand, search, add task, user menu) + main content.
- Filters Bar: search, priority, platform, assignee chips with clear-all.
- Board: DnD context (keyboard-accessible), four fixed columns.
- Column: droppable zone with title + count, empty state, list of TaskCards.
- TaskCard: draggable; shows title, influencer (name + @handle + avatar), platform pill, priority badge, due date, assignees; hover actions edit/delete.
- AddTaskModal: minimal create form; validates; calls mock createTask.
- EditTaskDrawer: right-side drawer; full task form; calls mock updateTask.
- DeleteConfirmDialog: safety confirmation; calls mock deleteTask.
- ToastProvider: success toasts for create/update/delete.
- Skeletons/EmptyStates: smooth perceived performance and clear affordances.

### Data Model (types)
- Influencer: id, handle, name, avatarUrl, platform ('Instagram'|'TikTok'|'YouTube').
- Task: id, title, influencer, priority ('High'|'Medium'|'Low'), status ('Backlog'|'In Progress'|'Awaiting Approval'|'Done'), dueDate?, assignees?, budget?, deliverable?, links?, notes?.

### State & Data Flow
- Mock `lib/dataClient` with async CRUD, in-memory arrays, simulated latency.
- Board holds canonical task list; DnD triggers optimistic local update + mock persist.
- Filters and search are client-side only; debounced search.

### Key Interactions
- Drag TaskCard across columns to update status.
- Add task via header “Add Task” or column quick-add.
- Edit task by clicking card → opens drawer.
- Delete via icon → confirm dialog.
- Keyboard shortcuts: n (new task), / or ⌘/Ctrl+K (search), Esc (close modals/drawer).

### Accessibility & UX
- Semantic roles for lists/items; focus-visible rings; ARIA labels on icon buttons.
- Sufficient color contrast; motion kept subtle; supports reduced motion.
- Mobile: horizontal scroll + snap columns; filters collapse into a sheet.

### Stack & Libraries
- Next.js 14 (App Router), TypeScript, Tailwind.
- lucide-react for icons; @hello-pangea/dnd for DnD.
- Optional shadcn/ui primitives (Dialog, Drawer, DropdownMenu, Button, Input, Select, Badge, Avatar, Toast) for speed.

### File Structure (desired)
- app/layout.tsx, app/globals.css, app/(auth)/login/page.tsx, app/dashboard/page.tsx
- components/: AppHeader, FiltersBar, Board, Column, TaskCard, AddTaskModal, EditTaskDrawer, DeleteConfirmDialog, EmptyState, Skeletons, ToastProvider
- lib/: dataClient, sampleData, utils
- types/: index.ts

### Milestones
1) UI generation via v0 (scaffold + components + sample data)
2) Hook up mock data client + DnD
3) Add/Edit/Delete flows + toasts + empty/skeleton
4) A11y pass + responsive polish
5) Deploy to Vercel + Loom walkthrough

### Success Criteria
- Beautiful, cohesive UI; fluid DnD; working filters; optimistic updates on mock client.
- Clear docs of prompts and plan; rapid shipping demonstrated.

