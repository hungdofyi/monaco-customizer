import { ref, computed, watchEffect } from 'vue'

type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'holistics-theme-mode'

const mode = ref<ThemeMode>((localStorage.getItem(STORAGE_KEY) as ThemeMode) || 'light')

watchEffect(() => {
  localStorage.setItem(STORAGE_KEY, mode.value)
  document.documentElement.setAttribute('data-theme', mode.value)
})

export function useThemeMode() {
  const isDark = computed(() => mode.value === 'dark')

  function toggle() {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
  }

  return { mode, isDark, toggle }
}
