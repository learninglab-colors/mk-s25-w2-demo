# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server with Turbopack (runs on http://localhost:3000)
- `pnpm build` - Build the application for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint for code linting

## Project Architecture

This is a Next.js 15 application with MDX support and Tailwind CSS styling.

### Key Configuration
- **MDX Integration**: Configured in `next.config.ts` to support `.md` and `.mdx` files as pages
- **Page Extensions**: Supports JS, JSX, TS, TSX, MD, and MDX files as pages
- **MDX Components**: Custom MDX components can be defined in `src/mdx-components.tsx`
- **Fonts**: Uses Geist Sans and Geist Mono fonts loaded via `next/font/google`

### Directory Structure
- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - React components
- `_questions/` - MDX/Markdown question files (not in src/ directory)
- `public/` - Static assets

### Styling
- Uses Tailwind CSS 4.x
- Global styles in `src/app/globals.css`
- Font variables set up in root layout for Geist fonts

### MDX Usage
The project is configured to render MDX files as pages. Questions and content can be written in either `.md` or `.mdx` format and will be automatically processed by Next.js.