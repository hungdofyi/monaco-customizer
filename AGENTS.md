# Holistics Monaco Playground

## Commands

- **Dev server**: `npm run dev`
- **Build**: `npm run build`
- **Type-check**: `npm run type-check`
- **Preview**: `npm run preview`

## Stack

- Vue 3.5 + TypeScript (`<script setup lang="ts">`)
- Vite 6 with `@tailwindcss/vite` plugin
- Tailwind CSS 4.1 (use `@import "tailwindcss"` in CSS, no `@apply`)
- Monaco Editor via `monaco-editor-vue3`
- motion-v for animations
- Vue Router 4

## Conventions

- Use Tailwind utility classes directly in templates, never `@apply`
- Use TypeScript everywhere
- Use `<script setup lang="ts">` for all Vue components
- Path alias: `@/` maps to `src/`
