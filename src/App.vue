<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import { useThemeMode } from '@/composables/useThemeMode'

const route = useRoute()
const isCustomizer = computed(() => route.name === 'monaco-customizer')
const { isDark, toggle } = useThemeMode()
</script>

<template>
  <div class="h-full flex flex-col" style="background: var(--color-surface-0); color: var(--color-text-primary)">
    <nav
      class="flex items-center h-12 px-5 shrink-0"
      style="background: var(--color-surface-1); border-bottom: 1px solid var(--color-border-subtle)"
    >
      <RouterLink to="/" class="flex items-center gap-2.5 mr-8">
        <div
          class="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
          style="background: var(--color-accent)"
        >
          H
        </div>
        <span class="text-sm font-semibold tracking-tight" style="color: var(--color-text-primary)">
          Monaco Playground
        </span>
      </RouterLink>

      <div class="flex items-center gap-1">
        <RouterLink
          to="/"
          class="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
          :style="{
            color: route.name === 'home' ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
            background: route.name === 'home' ? 'var(--color-surface-3)' : 'transparent',
          }"
        >
          Home
        </RouterLink>
        <RouterLink
          to="/monaco-customizer"
          class="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
          :style="{
            color: isCustomizer ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
            background: isCustomizer ? 'var(--color-surface-3)' : 'transparent',
          }"
        >
          Customizer
        </RouterLink>
      </div>

      <div class="ml-auto">
        <button
          class="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
          style="color: var(--color-text-secondary)"
          title="Toggle light/dark mode"
          @click="toggle"
        >
          <!-- Sun icon (shown in dark mode) -->
          <svg v-if="isDark" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <!-- Moon icon (shown in light mode) -->
          <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
      </div>
    </nav>

    <main class="flex-1 min-h-0">
      <RouterView />
    </main>
  </div>
</template>
