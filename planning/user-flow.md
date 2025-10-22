graph TD
    A[User visits the app URL] --> B{Is the user logged in?}
    B -->|No| C[Show Login/Signup Page]
    C --> D[User signs in via Supabase Auth]
    B -->|Yes| E[Show Campaign Task Dashboard]
    D --> E
    E --> F[User sees a list of their tasks]
    E --> G(User clicks '+ Add Task')
    G --> H[Show 'Add Task' form/modal]
    H --> I{Submits form}
    I --> J[Server Action saves task to Supabase]
    J --> E
    F --> K(User interacts with a task)
    K --> L[Option to change status or delete]
    L --> J
