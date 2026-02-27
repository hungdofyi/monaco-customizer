<script setup lang="ts">
import { ref } from 'vue'
import ColorInput from '@/components/ColorInput.vue'
import HolisticsEditor from '@/components/HolisticsEditor.vue'
import {
  useMonacoTheme,
  groupNames,
  groupedDefs,
} from '@/composables/useMonacoTheme'

const {
  colorRefs,
  updateColor,
  fontSize,
  fontFamily,
  lineHeight,
  minimapEnabled,
  wordWrap,
  resetDefaults,
  changedCount,
  exportTheme,
} = useMonacoTheme()

const sampleCode = ref(`import { createApp } from 'vue'
import App from './App.vue'

interface Config {
  theme: 'light' | 'dark'
  fontSize: number
  minimap: boolean
}

const defaultConfig: Config = {
  theme: 'dark',
  fontSize: 14,
  minimap: true,
}

function initApp(config: Config = defaultConfig) {
  const app = createApp(App)

  app.provide('config', config)
  app.mount('#app')

  console.log('App initialized with config:', config)
  return app
}

export { initApp, defaultConfig }
export type { Config }
`)

const collapsedGroups = ref<Record<string, boolean>>({})

function toggleGroup(group: string) {
  collapsedGroups.value[group] = !collapsedGroups.value[group]
}

const exportLabel = ref('Export')

function handleExport() {
  const css = exportTheme()
  navigator.clipboard.writeText(css).then(() => {
    exportLabel.value = 'Copied!'
    setTimeout(() => (exportLabel.value = 'Export'), 2000)
  })
}
</script>

<template>
  <div class="flex h-full">
    <!-- Sidebar -->
    <aside
      class="w-72 shrink-0 flex flex-col"
      style="background: var(--color-surface-1); border-right: 1px solid var(--color-border-subtle)"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between px-4 h-11 shrink-0"
        style="border-bottom: 1px solid var(--color-border-subtle)"
      >
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold" style="color: var(--color-text-primary)">Theme</span>
          <span
            v-if="changedCount > 0"
            class="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
            style="background: var(--color-accent); color: white"
          >
            {{ changedCount }}
          </span>
        </div>
        <div class="flex gap-1.5">
          <button
            class="text-[11px] px-2.5 py-1 rounded-md font-medium transition-colors"
            style="background: var(--color-surface-3); color: var(--color-text-secondary)"
            @click="resetDefaults"
          >
            Reset
          </button>
          <button
            class="text-[11px] px-2.5 py-1 rounded-md font-medium text-white transition-colors"
            style="background: var(--color-accent)"
            @click="handleExport"
          >
            {{ exportLabel }}
          </button>
        </div>
      </div>

      <!-- Scrollable controls -->
      <div class="flex-1 overflow-y-auto">
        <!-- Color groups -->
        <template v-for="group in groupNames" :key="group">
          <button
            class="flex items-center justify-between w-full px-4 py-2 text-left"
            style="border-bottom: 1px solid var(--color-border-subtle)"
            @click="toggleGroup(group)"
          >
            <span class="text-[11px] font-semibold uppercase tracking-wider" style="color: var(--color-text-tertiary)">
              {{ group }}
            </span>
            <svg
              class="w-3 h-3 transition-transform"
              :class="{ '-rotate-90': collapsedGroups[group] }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              style="color: var(--color-text-tertiary)"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            v-show="!collapsedGroups[group]"
            class="px-3 py-1"
            style="border-bottom: 1px solid var(--color-border-subtle)"
          >
            <ColorInput
              v-for="def in groupedDefs.get(group) ?? []"
              :key="def.key"
              :label="def.label"
              :model-value="colorRefs[def.key]?.value ?? def.defaultValue"
              :default-value="def.defaultValue"
              @update:model-value="updateColor(def.key, $event)"
            />
          </div>
        </template>

        <!-- Editor Options -->
        <button
          class="flex items-center justify-between w-full px-4 py-2 text-left"
          style="border-bottom: 1px solid var(--color-border-subtle)"
          @click="toggleGroup('_options')"
        >
          <span class="text-[11px] font-semibold uppercase tracking-wider" style="color: var(--color-text-tertiary)">
            Options
          </span>
          <svg
            class="w-3 h-3 transition-transform"
            :class="{ '-rotate-90': collapsedGroups['_options'] }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            style="color: var(--color-text-tertiary)"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div
          v-show="!collapsedGroups['_options']"
          class="px-4 py-3 flex flex-col gap-3"
          style="border-bottom: 1px solid var(--color-border-subtle)"
        >
          <label class="flex flex-col gap-1">
            <span class="text-[11px] font-medium" style="color: var(--color-text-tertiary)">Font Size</span>
            <input
              v-model.number="fontSize"
              type="number"
              min="8"
              max="40"
              class="text-xs rounded-md px-2.5 py-1.5 focus:outline-none"
              style="background: var(--color-surface-3); border: 1px solid var(--color-border); color: var(--color-text-primary)"
            />
          </label>

          <label class="flex flex-col gap-1">
            <span class="text-[11px] font-medium" style="color: var(--color-text-tertiary)">Font Family</span>
            <input
              v-model="fontFamily"
              type="text"
              class="text-xs rounded-md px-2.5 py-1.5 focus:outline-none"
              style="background: var(--color-surface-3); border: 1px solid var(--color-border); color: var(--color-text-primary)"
            />
          </label>

          <label class="flex flex-col gap-1">
            <span class="text-[11px] font-medium" style="color: var(--color-text-tertiary)">Line Height</span>
            <input
              v-model.number="lineHeight"
              type="number"
              min="10"
              max="60"
              class="text-xs rounded-md px-2.5 py-1.5 focus:outline-none"
              style="background: var(--color-surface-3); border: 1px solid var(--color-border); color: var(--color-text-primary)"
            />
          </label>

          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="minimapEnabled"
              type="checkbox"
              class="w-3.5 h-3.5 rounded accent-indigo-500"
            />
            <span class="text-[11px] font-medium" style="color: var(--color-text-secondary)">Minimap</span>
          </label>

          <label class="flex flex-col gap-1">
            <span class="text-[11px] font-medium" style="color: var(--color-text-tertiary)">Word Wrap</span>
            <select
              v-model="wordWrap"
              class="text-xs rounded-md px-2.5 py-1.5 focus:outline-none"
              style="background: var(--color-surface-3); border: 1px solid var(--color-border); color: var(--color-text-primary)"
            >
              <option value="off">Off</option>
              <option value="on">On</option>
              <option value="wordWrapColumn">Word Wrap Column</option>
              <option value="bounded">Bounded</option>
            </select>
          </label>
        </div>
      </div>
    </aside>

    <!-- Editor pane -->
    <div class="flex-1 min-w-0" style="background: var(--color-surface-0)">
      <HolisticsEditor v-model="sampleCode" language="typescript" />
    </div>
  </div>
</template>
