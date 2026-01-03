# PumpLab

AI-powered content generation tool for personal trainers to create Instagram Reels and Carousel posts.

## Tech Stack

- **Next.js 14** (App Router)
- **React 18** with TypeScript
- **Tailwind CSS** (dark theme with yellow accent)
- **Radix UI** for accessible components
- **pnpm** as package manager

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (install with `npm install -g pnpm`)

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Run the development server:
```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout with Header/Footer
│   ├── page.tsx        # Landing page
│   └── globals.css     # Global styles & Tailwind
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx  # Site header
│   │   └── Footer.tsx  # Site footer
│   │
│   └── ui/
│       └── Button.tsx  # Radix UI Button component
│
├── utils/
│   └── cn.ts          # Class name utility (clsx + tailwind-merge)
│
└── lib/
    └── fonts.ts       # Font configuration
```

## Features

- Dark theme with yellow accent colors
- Responsive design
- Accessible components with Radix UI
- TypeScript for type safety
- ESLint for code quality

## Build

```bash
pnpm build
```

## License

MIT

