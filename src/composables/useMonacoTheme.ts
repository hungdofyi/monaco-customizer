import { ref, computed, onBeforeUnmount } from 'vue'
import * as monaco from 'monaco-editor'
import type { editor as EditorNS } from 'monaco-editor'
import { themePresets, type ThemePreset } from '@/data/theme-presets'

const THEME_NAME = 'holistics-custom'
const STORAGE_KEY = 'holistics-monaco-theme'

const activePresetId = ref(themePresets[0].id)

export interface ColorVarDef {
  key: string
  label: string
  monacoKey: string
  defaultValue: string
  group: string
}

export const colorVarDefs: ColorVarDef[] = [
  { key: '--editor-bg', label: 'Background', monacoKey: 'editor.background', defaultValue: '#1e1e1e', group: 'Editor' },
  { key: '--editor-fg', label: 'Foreground', monacoKey: 'editor.foreground', defaultValue: '#d4d4d4', group: 'Editor' },
  { key: '--cursor', label: 'Cursor', monacoKey: 'editorCursor.foreground', defaultValue: '#aeafad', group: 'Editor' },
  { key: '--selection-bg', label: 'Selection', monacoKey: 'editor.selectionBackground', defaultValue: '#264f78', group: 'Editor' },
  { key: '--selection-fg', label: 'Selection Text', monacoKey: 'editor.selectionForeground', defaultValue: '#ffffff', group: 'Editor' },
  { key: '--line-highlight-bg', label: 'Line Highlight', monacoKey: 'editor.lineHighlightBackground', defaultValue: '#2a2d2e', group: 'Editor' },
  { key: '--line-highlight-border', label: 'Line Highlight Border', monacoKey: 'editor.lineHighlightBorder', defaultValue: '#282828', group: 'Editor' },
  { key: '--line-number', label: 'Line Number', monacoKey: 'editorLineNumber.foreground', defaultValue: '#858585', group: 'Gutter' },
  { key: '--active-line-number', label: 'Active Line Number', monacoKey: 'editorLineNumber.activeForeground', defaultValue: '#c6c6c6', group: 'Gutter' },
  { key: '--gutter-bg', label: 'Gutter Background', monacoKey: 'editorGutter.background', defaultValue: '#1e1e1e', group: 'Gutter' },
  { key: '--indent-guide', label: 'Indent Guide', monacoKey: 'editorIndentGuide.background', defaultValue: '#404040', group: 'Gutter' },
  { key: '--active-indent-guide', label: 'Active Indent Guide', monacoKey: 'editorIndentGuide.activeBackground', defaultValue: '#707070', group: 'Gutter' },
  { key: '--widget-bg', label: 'Background', monacoKey: 'editorWidget.background', defaultValue: '#252526', group: 'Widgets' },
  { key: '--widget-fg', label: 'Foreground', monacoKey: 'editorWidget.foreground', defaultValue: '#cccccc', group: 'Widgets' },
  { key: '--widget-border', label: 'Border', monacoKey: 'editorWidget.border', defaultValue: '#454545', group: 'Widgets' },
  { key: '--suggest-bg', label: 'Suggest Background', monacoKey: 'editorSuggestWidget.background', defaultValue: '#252526', group: 'Widgets' },
  { key: '--suggest-border', label: 'Suggest Border', monacoKey: 'editorSuggestWidget.border', defaultValue: '#454545', group: 'Widgets' },
  { key: '--suggest-fg', label: 'Suggest Foreground', monacoKey: 'editorSuggestWidget.foreground', defaultValue: '#d4d4d4', group: 'Widgets' },
  { key: '--suggest-selected', label: 'Suggest Selected', monacoKey: 'editorSuggestWidget.selectedBackground', defaultValue: '#04395e', group: 'Widgets' },
  { key: '--scrollbar', label: 'Scrollbar', monacoKey: 'scrollbarSlider.background', defaultValue: '#79797966', group: 'Scrollbar' },
  { key: '--scrollbar-hover', label: 'Scrollbar Hover', monacoKey: 'scrollbarSlider.hoverBackground', defaultValue: '#646464b3', group: 'Scrollbar' },
  { key: '--scrollbar-active', label: 'Scrollbar Active', monacoKey: 'scrollbarSlider.activeBackground', defaultValue: '#bfbfbf66', group: 'Scrollbar' },
  { key: '--minimap-bg', label: 'Minimap Background', monacoKey: 'minimap.background', defaultValue: '#1e1e1e', group: 'Scrollbar' },
]

// Precompute groups
export const groupNames: string[] = []
export const groupedDefs = new Map<string, ColorVarDef[]>()
for (const def of colorVarDefs) {
  if (!groupedDefs.has(def.group)) {
    groupNames.push(def.group)
    groupedDefs.set(def.group, [])
  }
  groupedDefs.get(def.group)!.push(def)
}

// Module-level singleton state (shared across all consumers)
const colorRefs: Record<string, ReturnType<typeof ref<string>>> = {}
for (const def of colorVarDefs) {
  colorRefs[def.key] = ref(def.defaultValue)
}

const fontSize = ref(14)
const fontFamily = ref("'Fira Code', 'Cascadia Code', 'Consolas', monospace")
const lineHeight = ref(20)
const minimapEnabled = ref(true)
const wordWrap = ref<'off' | 'on' | 'wordWrapColumn' | 'bounded'>('off')

// Load saved state from localStorage
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const saved = JSON.parse(raw)
    // Restore preset first, then overlay user customizations
    if (saved.presetId && themePresets.some((p) => p.id === saved.presetId)) {
      activePresetId.value = saved.presetId
      const preset = themePresets.find((p) => p.id === saved.presetId)!
      for (const def of colorVarDefs) {
        const r = colorRefs[def.key]
        if (r) r.value = preset.colors[def.key] ?? def.defaultValue
      }
    }
    if (saved.colors) {
      for (const def of colorVarDefs) {
        if (saved.colors[def.key]) {
          const r = colorRefs[def.key]
          if (r) r.value = saved.colors[def.key]
        }
      }
    }
    if (saved.options) {
      if (typeof saved.options.fontSize === 'number') fontSize.value = saved.options.fontSize
      if (typeof saved.options.fontFamily === 'string') fontFamily.value = saved.options.fontFamily
      if (typeof saved.options.lineHeight === 'number') lineHeight.value = saved.options.lineHeight
      if (typeof saved.options.minimapEnabled === 'boolean') minimapEnabled.value = saved.options.minimapEnabled
      if (saved.options.wordWrap) wordWrap.value = saved.options.wordWrap
    }
  } catch { /* ignore corrupt data */ }
}

function saveToStorage() {
  const colors: Record<string, string> = {}
  for (const def of colorVarDefs) {
    const val = colorRefs[def.key]?.value
    if (val && val !== def.defaultValue) {
      colors[def.key] = val
    }
  }
  const data = {
    presetId: activePresetId.value,
    colors,
    options: {
      fontSize: fontSize.value,
      fontFamily: fontFamily.value,
      lineHeight: lineHeight.value,
      minimapEnabled: minimapEnabled.value,
      wordWrap: wordWrap.value,
    },
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// Init: load saved data
loadFromStorage()

function getColor(key: string): string {
  return colorRefs[key]?.value ?? ''
}

function getActivePreset(): ThemePreset {
  return themePresets.find((p) => p.id === activePresetId.value) ?? themePresets[0]
}

function buildTheme(): EditorNS.IStandaloneThemeData {
  const colors: Record<string, string> = {}
  for (const def of colorVarDefs) {
    colors[def.monacoKey] = getColor(def.key) || def.defaultValue
  }
  return { base: getActivePreset().base, inherit: true, rules: [], colors }
}

// Define initial theme
monaco.editor.defineTheme(THEME_NAME, buildTheme())

let themeRafId: number | null = null

function scheduleThemeUpdate() {
  if (themeRafId !== null) return
  themeRafId = requestAnimationFrame(() => {
    themeRafId = null
    monaco.editor.defineTheme(THEME_NAME, buildTheme())
    monaco.editor.setTheme(THEME_NAME)
    saveToStorage()
  })
}

export function useMonacoTheme() {
  onBeforeUnmount(() => {
    if (themeRafId !== null) cancelAnimationFrame(themeRafId)
  })

  function updateColor(key: string, value: string) {
    const r = colorRefs[key]
    if (r) r.value = value
    scheduleThemeUpdate()
  }

  function applyPreset(presetId: string) {
    const preset = themePresets.find((p) => p.id === presetId)
    if (!preset) return
    activePresetId.value = preset.id
    for (const def of colorVarDefs) {
      const r = colorRefs[def.key]
      if (r) r.value = preset.colors[def.key] ?? def.defaultValue
    }
    scheduleThemeUpdate()
  }

  function resetDefaults() {
    applyPreset(activePresetId.value)
    fontSize.value = 14
    fontFamily.value = "'Fira Code', 'Cascadia Code', 'Consolas', monospace"
    lineHeight.value = 20
    minimapEnabled.value = true
    wordWrap.value = 'off'
    scheduleThemeUpdate()
  }

  const changedCount = computed(() =>
    colorVarDefs.filter((d) => getColor(d.key) !== d.defaultValue).length
  )

  function exportTheme() {
    const lines = [`/* Monaco defineTheme colors */`, `const themeColors = {`]
    for (const def of colorVarDefs) {
      const val = getColor(def.key)
      if (val !== def.defaultValue) {
        lines.push(`  '${def.monacoKey}': '${val}',`)
      }
    }
    lines.push('}')
    return lines.join('\n')
  }

  return {
    THEME_NAME,
    colorRefs,
    getColor,
    updateColor,
    activePresetId,
    applyPreset,
    fontSize,
    fontFamily,
    lineHeight,
    minimapEnabled,
    wordWrap,
    resetDefaults,
    changedCount,
    exportTheme,
    scheduleThemeUpdate,
    buildTheme,
    saveToStorage,
  }
}
