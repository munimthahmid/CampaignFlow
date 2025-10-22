## CampaignFlow — System Outline (Frontend First)

### Goals
- Ship a delightful, production-quality UI for an influencer campaign task board.
- Demonstrate velocity, clear thinking, and pragmatic use of AI tools.
- Keep all data interactions mocked for now; real backend integration later.

### Architecture (UI Modules)
- **Design System**: Glass morphism with backdrop blur, gradient accents (purple/pink), custom animations, enhanced shadows with purple tints, smooth transitions throughout.
- **App Shell**: Glass header with gradient branding, enhanced search with keyboard shortcuts, gradient "Add Task" button with glow, premium user menu dropdown.
- **Filters Bar**: Glass card with filter icon, emoji icons in dropdowns, active filter count badge, enhanced clear button.
- **Board**: DnD context with staggered entrance animations, snap scrolling for mobile, enhanced drop zone highlighting.
- **Column**: Glass card columns with colored top accents (status-specific), animated pulsing status dots, gradient count badges.
- **TaskCard**: Glass cards with colored left accent bars (priority-based), platform icon overlay on avatar, enhanced badges, improved hover states with lift effect, scale + rotate on drag.
- **AddTaskModal**: Large glass modal with gradient header, enhanced form fields with hover states, emoji icons in dropdowns, loading spinner in button.
- **EditTaskDrawer**: Right-side drawer with glass panel, full task form with premium styling.
- **DeleteConfirmDialog**: Centered with glow effect, gradient text, warning message box, red-to-rose gradient delete button.
- **ToastProvider**: Success/error toasts with animations.
- **Skeletons/EmptyStates**: Glass card design with gradient icon containers and smooth animations.

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
- **Next.js 16** (App Router with Turbopack), TypeScript, Tailwind CSS 4.
- **lucide-react** for icons; **@hello-pangea/dnd** for drag-and-drop.
- **shadcn/ui** primitives (60+ components available).
- **Supabase** for authentication and database (optional, env-toggled).
- **Custom Design System**: Glass morphism utilities, gradient classes, animation keyframes, custom scrollbar.

### File Structure (desired)
- app/layout.tsx, app/globals.css, app/(auth)/login/page.tsx, app/dashboard/page.tsx
- components/: AppHeader, FiltersBar, Board, Column, TaskCard, AddTaskModal, EditTaskDrawer, DeleteConfirmDialog, EmptyState, Skeletons, ToastProvider
- lib/: dataClient, sampleData, utils
- types/: index.ts

### Milestones
1) ✅ UI generation via v0 (scaffold + components + sample data)
2) ✅ Hook up mock data client + DnD
3) ✅ Add/Edit/Delete flows + toasts + empty/skeleton
4) ✅ Supabase integration (auth + CRUD with env toggle)
5) ✅ **Premium UI Revamp** - Glass morphism design system with gradients, animations, and first-class visual polish
6) ✅ Production build fixes (Suspense boundaries for Next.js 16)
7) 🚀 Ready for deployment

### Success Criteria
- Beautiful, cohesive UI; fluid DnD; working filters; optimistic updates on mock client.
- Clear docs of prompts and plan; rapid shipping demonstrated.

