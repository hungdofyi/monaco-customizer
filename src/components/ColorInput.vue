<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { colorFamilies, standaloneColors, type ColorShade } from '@/data/holisticsColors'

const props = defineProps<{
  label: string
  modelValue: string
  defaultValue?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isChanged = computed(() => props.defaultValue && props.modelValue !== props.defaultValue)

const showPicker = ref(false)
const pickerRef = ref<HTMLElement>()
const triggerRef = ref<HTMLElement>()
const searchInputRef = ref<HTMLInputElement>()
const search = ref('')
const viewMode = ref<'grid' | 'list'>('grid')

// Build a hex→token lookup for display
const hexToToken = computed(() => {
  const map = new Map<string, string>()
  for (const c of standaloneColors) map.set(c.hex.toLowerCase(), c.token)
  for (const f of colorFamilies) {
    for (const s of f.shades) map.set(s.hex.toLowerCase(), s.token)
  }
  return map
})

const displayToken = computed(() => {
  return hexToToken.value.get(props.modelValue.toLowerCase()) ?? props.modelValue
})

// Flat list for search filtering
const allColors = computed(() => {
  const items: (ColorShade & { family: string })[] = []
  for (const c of standaloneColors) items.push({ ...c, family: '' })
  for (const f of colorFamilies) {
    for (const s of f.shades) items.push({ ...s, family: f.name })
  }
  return items
})

const filteredFamilies = computed(() => {
  const q = search.value.toLowerCase().trim()
  if (!q) return null // use grouped view
  return allColors.value.filter(
    (c) =>
      c.token.toLowerCase().includes(q) ||
      c.hex.toLowerCase().includes(q) ||
      c.family.toLowerCase().includes(q),
  )
})

function togglePicker() {
  showPicker.value = !showPicker.value
  if (showPicker.value) {
    search.value = ''
    nextTick(() => searchInputRef.value?.focus())
  }
}

function selectColor(hex: string) {
  emit('update:modelValue', hex)
  showPicker.value = false
}

function onTextChange(e: Event) {
  const val = (e.target as HTMLInputElement).value.trim()
  // Try to resolve as token name first
  const match = allColors.value.find((c) => c.token === val)
  if (match) {
    emit('update:modelValue', match.hex)
    return
  }
  // Otherwise treat as hex
  let hex = val
  if (hex && !hex.startsWith('#')) hex = '#' + hex
  if (/^#[0-9a-fA-F]{3,8}$/.test(hex)) {
    emit('update:modelValue', hex)
  }
}

function reset() {
  if (props.defaultValue) emit('update:modelValue', props.defaultValue)
}

function isSelected(hex: string) {
  return props.modelValue.toLowerCase() === hex.toLowerCase()
}

function onClickOutside(e: MouseEvent) {
  if (
    showPicker.value &&
    pickerRef.value &&
    !pickerRef.value.contains(e.target as Node) &&
    triggerRef.value &&
    !triggerRef.value.contains(e.target as Node)
  ) {
    showPicker.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', onClickOutside))
</script>

<template>
  <div class="flex items-center gap-2 py-1 group relative">
    <!-- Color swatch trigger -->
    <button
      ref="triggerRef"
      class="w-6 h-6 rounded shrink-0 cursor-pointer"
      :style="{
        background: modelValue,
        border: '1px solid var(--color-border)',
      }"
      :title="modelValue"
      @click="togglePicker"
    />

    <div class="flex flex-col gap-0 min-w-0 flex-1">
      <div class="flex items-center gap-1">
        <span
          class="text-[11px] truncate"
          :style="{ color: isChanged ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)' }"
        >
          {{ label }}
        </span>
        <div
          v-if="isChanged"
          class="w-1.5 h-1.5 rounded-full shrink-0"
          style="background: var(--color-accent)"
        />
      </div>
      <input
        type="text"
        :value="displayToken"
        class="text-[10px] font-mono w-full px-1.5 py-0.5 rounded focus:outline-none"
        style="background: var(--color-surface-3); border: 1px solid var(--color-border); color: var(--color-text-secondary)"
        @change="onTextChange"
      />
    </div>
    <button
      v-if="isChanged"
      class="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 p-0.5 rounded"
      style="color: var(--color-text-tertiary)"
      title="Reset to default"
      @click="reset"
    >
      <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    </button>

    <!-- Swatch picker dropdown -->
    <Teleport to="body">
      <div
        v-if="showPicker"
        ref="pickerRef"
        class="fixed z-50 rounded-lg shadow-xl overflow-hidden flex flex-col"
        :style="{
          background: 'var(--color-surface-1)',
          border: '1px solid var(--color-border)',
          top: (triggerRef?.getBoundingClientRect().bottom ?? 0) + 4 + 'px',
          left: (triggerRef?.getBoundingClientRect().left ?? 0) + 'px',
          width: '300px',
          maxHeight: '400px',
        }"
      >
        <!-- Toolbar: search + view toggle -->
        <div
          class="flex items-center gap-1.5 px-2.5 py-2 shrink-0"
          style="border-bottom: 1px solid var(--color-border)"
        >
          <div class="relative flex-1">
            <svg
              class="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none"
              style="color: var(--color-text-tertiary)"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref="searchInputRef"
              v-model="search"
              type="text"
              placeholder="Search tokens..."
              class="w-full text-[11px] pl-6.5 pr-2 py-1 rounded focus:outline-none"
              style="background: var(--color-surface-3); border: 1px solid var(--color-border); color: var(--color-text-primary)"
            />
          </div>
          <div
            class="flex rounded overflow-hidden shrink-0"
            style="border: 1px solid var(--color-border)"
          >
            <button
              class="p-1 transition-colors"
              :style="{
                background: viewMode === 'grid' ? 'var(--color-accent)' : 'var(--color-surface-3)',
                color: viewMode === 'grid' ? 'white' : 'var(--color-text-tertiary)',
              }"
              title="Grid view"
              @click="viewMode = 'grid'"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              class="p-1 transition-colors"
              :style="{
                background: viewMode === 'list' ? 'var(--color-accent)' : 'var(--color-surface-3)',
                color: viewMode === 'list' ? 'white' : 'var(--color-text-tertiary)',
                borderLeft: '1px solid var(--color-border)',
              }"
              title="List view"
              @click="viewMode = 'list'"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Scrollable content -->
        <div class="overflow-y-auto flex-1">
          <!-- Search results (flat list) -->
          <template v-if="filteredFamilies">
            <div v-if="filteredFamilies.length === 0" class="px-3 py-4 text-center">
              <span class="text-[11px]" style="color: var(--color-text-tertiary)">No matches</span>
            </div>

            <!-- Search: Grid view -->
            <div v-else-if="viewMode === 'grid'" class="px-3 py-2 flex gap-1 flex-wrap">
              <div
                v-for="c in filteredFamilies"
                :key="c.token"
                class="relative group/swatch"
              >
                <button
                  class="w-6 h-6 rounded-sm cursor-pointer shrink-0 transition-transform hover:scale-110"
                  :style="{
                    background: c.hex,
                    border: '1px solid var(--color-border)',
                    outline: isSelected(c.hex) ? '2px solid var(--color-accent)' : 'none',
                    outlineOffset: '1px',
                  }"
                  @click="selectColor(c.hex)"
                />
                <!-- Tooltip -->
                <div
                  class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono whitespace-nowrap pointer-events-none opacity-0 group-hover/swatch:opacity-100 transition-opacity z-10"
                  style="background: var(--color-surface-3); color: var(--color-text-primary); border: 1px solid var(--color-border)"
                >
                  {{ c.token }}
                </div>
              </div>
            </div>

            <!-- Search: List view -->
            <div v-else class="py-1">
              <button
                v-for="c in filteredFamilies"
                :key="c.token"
                class="flex items-center gap-2.5 w-full px-3 py-1 text-left transition-colors hover:brightness-95"
                :style="{
                  background: isSelected(c.hex) ? 'var(--color-surface-3)' : 'transparent',
                }"
                @click="selectColor(c.hex)"
              >
                <span
                  class="w-4 h-4 rounded-sm shrink-0"
                  :style="{ background: c.hex, border: '1px solid var(--color-border)' }"
                />
                <span class="text-[11px] font-mono truncate" style="color: var(--color-text-primary)">
                  {{ c.token }}
                </span>
                <span class="text-[10px] font-mono ml-auto shrink-0" style="color: var(--color-text-tertiary)">
                  {{ c.hex }}
                </span>
              </button>
            </div>
          </template>

          <!-- Grouped view (no search) -->
          <template v-else>
            <!-- Standalone -->
            <div class="px-3 pt-2.5 pb-1">
              <template v-if="viewMode === 'grid'">
                <div class="flex gap-1">
                  <div
                    v-for="c in standaloneColors"
                    :key="c.token"
                    class="relative group/swatch"
                  >
                    <button
                      class="w-6 h-6 rounded-sm cursor-pointer shrink-0 transition-transform hover:scale-110"
                      :style="{
                        background: c.hex,
                        border: '1px solid var(--color-border)',
                        outline: isSelected(c.hex) ? '2px solid var(--color-accent)' : 'none',
                        outlineOffset: '1px',
                      }"
                      @click="selectColor(c.hex)"
                    />
                    <div
                      class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono whitespace-nowrap pointer-events-none opacity-0 group-hover/swatch:opacity-100 transition-opacity z-10"
                      style="background: var(--color-surface-3); color: var(--color-text-primary); border: 1px solid var(--color-border)"
                    >
                      {{ c.token }}
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <button
                  v-for="c in standaloneColors"
                  :key="c.token"
                  class="flex items-center gap-2.5 w-full py-1 text-left transition-colors hover:brightness-95"
                  :style="{
                    background: isSelected(c.hex) ? 'var(--color-surface-3)' : 'transparent',
                  }"
                  @click="selectColor(c.hex)"
                >
                  <span
                    class="w-4 h-4 rounded-sm shrink-0"
                    :style="{ background: c.hex, border: '1px solid var(--color-border)' }"
                  />
                  <span class="text-[11px] font-mono truncate" style="color: var(--color-text-primary)">
                    {{ c.token }}
                  </span>
                  <span class="text-[10px] font-mono ml-auto shrink-0" style="color: var(--color-text-tertiary)">
                    {{ c.hex }}
                  </span>
                </button>
              </template>
            </div>

            <!-- Color families -->
            <div
              v-for="family in colorFamilies"
              :key="family.name"
              class="px-3 pb-1.5"
            >
              <div
                class="text-[9px] font-medium uppercase tracking-wider mb-1 mt-1"
                style="color: var(--color-text-tertiary)"
              >
                {{ family.name }}
              </div>

              <!-- Grid -->
              <template v-if="viewMode === 'grid'">
                <div class="flex gap-0.5 flex-wrap">
                  <div
                    v-for="shade in family.shades"
                    :key="shade.token"
                    class="relative group/swatch"
                  >
                    <button
                      class="w-6 h-6 rounded-sm cursor-pointer shrink-0 transition-transform hover:scale-110"
                      :style="{
                        background: shade.hex,
                        border: '1px solid var(--color-border)',
                        outline: isSelected(shade.hex) ? '2px solid var(--color-accent)' : 'none',
                        outlineOffset: '1px',
                      }"
                      @click="selectColor(shade.hex)"
                    />
                    <!-- Tooltip -->
                    <div
                      class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono whitespace-nowrap pointer-events-none opacity-0 group-hover/swatch:opacity-100 transition-opacity z-10"
                      style="background: var(--color-surface-3); color: var(--color-text-primary); border: 1px solid var(--color-border)"
                    >
                      {{ shade.token }}
                    </div>
                  </div>
                </div>
              </template>

              <!-- List -->
              <template v-else>
                <button
                  v-for="shade in family.shades"
                  :key="shade.token"
                  class="flex items-center gap-2.5 w-full py-0.5 text-left transition-colors hover:brightness-95"
                  :style="{
                    background: isSelected(shade.hex) ? 'var(--color-surface-3)' : 'transparent',
                  }"
                  @click="selectColor(shade.hex)"
                >
                  <span
                    class="w-4 h-4 rounded-sm shrink-0"
                    :style="{ background: shade.hex, border: '1px solid var(--color-border)' }"
                  />
                  <span class="text-[11px] font-mono truncate" style="color: var(--color-text-primary)">
                    {{ shade.token }}
                  </span>
                  <span class="text-[10px] font-mono ml-auto shrink-0" style="color: var(--color-text-tertiary)">
                    {{ shade.hex }}
                  </span>
                </button>
              </template>
            </div>
            <div class="h-2" />
          </template>
        </div>
      </div>
    </Teleport>
  </div>
</template>
