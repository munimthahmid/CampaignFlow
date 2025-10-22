## Prompts Used

### v0 Frontend Prompt (Refined)
- Source of truth: ../../refined_prompt.md
- Description: Comprehensive prompt instructing v0 to generate a premium, dark-first Next.js UI for CampaignFlow with Kanban board, DnD, search/filters, and mock data client. Includes design system guidance, components, file structure, sample data expectations, and acceptance criteria.

### Component-Scoped Prompts (fallback strategy)
If v0 struggles with the single large prompt, use these smaller ones component-by-component:

1) Main Dashboard Shell
> Create a full-page dashboard UI for a task management application using Next.js and Tailwind CSS (dark theme). Header: brand on left, environment badge, centered search, right-aligned Add Task, notifications icon, and user avatar with dropdown (Profile, Settings, Logout). Main area: four equal-width columns (Backlog, In Progress, Awaiting Approval, Done) in a responsive grid; columns independently scroll vertically; include a Filters Bar above the board (search, priority, platform, assignee, clear all). Provide mobile behavior: horizontal scrollable columns with snap.

2) Task Card Component
> Build a draggable TaskCard for a Kanban board (React + Tailwind). Shows: title, influencer (name + @handle + circular avatar), platform pill (Instagram/TikTok/YouTube icon), priority badge (High=rose, Medium=amber, Low=emerald), due date (relative), small stack of assignee avatars. On hover, reveal Edit and Delete icon buttons. Provide accessible roles, focus states, and props for status/priority/platform.

3) Add Task Modal
> Create a modal for adding a new task (Dialog). Fields: title (required), influencer handle, platform (select), priority (select), due date (date picker or input), optional notes. Include Cancel and Create buttons; validate required fields; on submit call a stub createTask(title, ...). Dark theme styling with Tailwind.

4) Edit Task Drawer
> Create a right-side Drawer to edit a task. Fields: title, influencer, platform, priority, status (Backlog/In Progress/Awaiting Approval/Done), due date, assignees (multi), notes. Include Save button; call stub updateTask(task). Include Delete as a secondary action that triggers a confirm dialog.

5) Board with DnD
> Implement a Board component using @hello-pangea/dnd with four Droppable columns and Draggable TaskCards. Handle onDragEnd to update task status based on destination droppableId. Keyboard accessible DnD, smooth animations, and empty/overflow states.

