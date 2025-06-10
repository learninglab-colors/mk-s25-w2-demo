# How To Make this Site

## Initial Setup

1. **Create Next.js App**
   ```bash
   npx create-next-app@latest mk-s25-w2-demo --typescript --tailwind --eslint --app --src-dir
   ```

2. **Install MDX Support**
   ```bash
   pnpm add @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
   ```

## Font Configuration

3. **Configure Inter Font**
   - Updated `src/app/layout.tsx` to use Inter font instead of Geist
   - Added all font weights (100-900) to support `font-black` class
   ```typescript
   import { Inter, Inter_Tight } from "next/font/google";
   
   const interSans = Inter({
     variable: "--font-inter-sans",
     subsets: ["latin"],
     weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
   });
   ```

4. **Create Tailwind Config**
   - Created `tailwind.config.js` to properly configure font families
   - Set up custom font variables for Inter fonts

## MDX Configuration

5. **Configure Next.js for MDX**
   - Updated `next.config.ts` to support MDX files as pages
   - Added page extensions: `['js', 'jsx', 'md', 'mdx', 'ts', 'tsx']`

6. **Custom MDX Components**
   - Created styled components in `src/mdx-components.tsx`
   - Added custom styling for headings, paragraphs, lists, code blocks, and links
   - All MDX files now automatically use these styled components

## Content Structure

7. **Created Personality Quiz**
   - Added `src/app/question-1/page.mdx` with learning style quiz
   - 5 questions with multiple choice answers
   - Uses custom MDX styling for consistent appearance

## Development Tools

8. **Claude History Reader Script**
   - Created `claude-history-reader.js` to manage conversation history
   - Can copy conversation files to `_log` directory
   - Usage: `node claude-history-reader.js --copy`

## Current Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with Inter fonts
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Global styles
│   └── question-1/
│       └── page.mdx        # Quiz page
├── components/
│   └── TitleOfMySite.tsx   # Site title component
└── mdx-components.tsx      # Custom MDX component styling
```

