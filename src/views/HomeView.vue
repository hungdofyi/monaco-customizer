<script setup lang="ts">
import { ref } from 'vue'
import { motion } from 'motion-v'
import HolisticsEditor from '@/components/HolisticsEditor.vue'

const demoCode = ref(`// This editor uses the same theme you customize
function greet(name: string): string {
  return \`Hello, \${name}!\`
}

console.log(greet('Holistics'))
`)
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full gap-6 px-6">
    <motion.div
      :initial="{ opacity: 0, y: -20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.5 }"
    >
      <div class="flex items-center gap-3 mb-2">
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg font-bold"
          style="background: var(--color-accent)"
        >
          H
        </div>
        <h1 class="text-4xl font-bold tracking-tight" style="color: var(--color-text-primary)">
          Monaco Playground
        </h1>
      </div>
    </motion.div>

    <motion.p
      :initial="{ opacity: 0, y: 10 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.5, delay: 0.15 }"
      class="text-base max-w-md text-center leading-relaxed"
      style="color: var(--color-text-secondary)"
    >
      Customize Monaco Editor's theme in real-time. Your changes persist
      across reloads and apply everywhere.
    </motion.p>

    <motion.div
      :initial="{ opacity: 0, scale: 0.95 }"
      :animate="{ opacity: 1, scale: 1 }"
      :transition="{ duration: 0.3, delay: 0.3 }"
      class="w-full max-w-2xl"
    >
      <div
        class="rounded-lg overflow-hidden"
        style="border: 1px solid var(--color-border); height: 240px"
      >
        <HolisticsEditor v-model="demoCode" language="typescript" />
      </div>
    </motion.div>

    <motion.div
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :transition="{ duration: 0.3, delay: 0.5 }"
    >
      <RouterLink
        to="/monaco-customizer"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:brightness-110"
        style="background: var(--color-accent)"
      >
        Open Customizer
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </RouterLink>
    </motion.div>
  </div>
</template>
