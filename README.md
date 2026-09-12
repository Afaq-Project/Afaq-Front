# Afaq

Afaq is a [Next.js](https://nextjs.org) web application built with the App Router, React 19, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router)
- **UI:** React 19, Tailwind CSS 4, `lucide-react`
- **Data fetching:** [TanStack Query](https://tanstack.com/query/latest), [Axios](https://axios-http.com)
- **Forms & validation:** [React Hook Form](https://react-hook-form.com), [Zod](https://zod.dev)
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 20+
- A running instance of the backend API

### Installation

```bash
npm install
```

### Environment variables

Copy the example env file and fill in the values:

```bash
cp .env.local.example .env.local
```

| Variable              | Description                                                                   |
| --------------------- | ----------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API (no trailing slash), e.g. `http://localhost:4000` |

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Available Scripts

| Script          | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the development server |
| `npm run build` | Build the app for production |
| `npm run start` | Start the production server  |
| `npm run lint`  | Run ESLint                   |

## Project Structure

```
src/
├── app/                # Next.js App Router routes
│   ├── (auth)/         # Login, register
│   └── (protected)/    # Authenticated routes (home, onboarding, etc.)
├── feature/            # Feature-based modules
│   ├── applications/
│   ├── auth/
│   ├── dashboard/
│   ├── discover/
│   ├── layout/
│   ├── onboarding/
│   ├── opportunities/
│   └── profile/
└── shared/             # Shared code
    ├── hooks/
    ├── lib/            # API client, auth, validation
    └── ui/             # Reusable UI components
```

Each feature module is typically organized into `components/`, `services/`, and `types/` (with `mocks/` where applicable).
