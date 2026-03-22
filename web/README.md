# Uncle Brew Web

Web client for Uncle Brew Coffee Shop built with **Vite + React + TypeScript**.

## Stack

- **Vite** — fast dev server & build tool
- **React 18** — UI library
- **TypeScript** — type safety
- **Tailwind CSS** — utility-first styling
- **React Router v6** — client-side routing
- **Clerk** — authentication (`@clerk/clerk-react`)
- **Zustand** — cart state management
- **Axios** — HTTP client

## Getting Started

```bash
# Install dependencies
npm install

# Copy env file and fill in values
cp .env.example .env.local

# Start dev server (http://localhost:3000)
npm run dev
```

## Environment Variables

| Variable                     | Description           |
| ---------------------------- | --------------------- |
| `VITE_API_URL`               | Backend API base URL  |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |

## Scripts

| Command           | Description                       |
| ----------------- | --------------------------------- |
| `npm run dev`     | Start Vite dev server             |
| `npm run build`   | Type-check & build for production |
| `npm run preview` | Preview production build          |
| `npm run lint`    | Run ESLint                        |

## Project Structure

```
src/
├── actions/        # API fetching functions
├── components/     # Shared UI components
│   └── ui/         # Radix/shadcn primitives
├── hooks/          # Custom React hooks
├── lib/            # Utilities
├── pages/          # Route-level page components
│   ├── Home/
│   ├── Menu/
│   ├── Cart/
│   ├── Orders/
│   └── About/
├── providers/      # Context/provider wrappers
├── types.db.ts     # Shared TypeScript types
├── App.tsx         # Router setup
└── main.tsx        # Entry point
```
