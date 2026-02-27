<script setup lang="ts">
import { shallowRef, watch, nextTick } from 'vue'
import * as monaco from 'monaco-editor'
import type { editor as EditorNS } from 'monaco-editor'
import { useMonacoTheme } from '@/composables/useMonacoTheme'

const props = withDefaults(defineProps<{
  modelValue?: string
  language?: string
  readOnly?: boolean
}>(), {
  modelValue: '',
  language: 'typescript',
  readOnly: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const {
  THEME_NAME,
  fontSize,
  fontFamily,
  lineHeight,
  minimapEnabled,
  wordWrap,
  buildTheme,
} = useMonacoTheme()

const editorInstance = shallowRef<EditorNS.IStandaloneCodeEditor | null>(null)

const initialOptions: EditorNS.IStandaloneEditorConstructionOptions = {
  fontSize: fontSize.value,
  fontFamily: fontFamily.value,
  lineHeight: lineHeight.value,
  minimap: { enabled: minimapEnabled.value },
  wordWrap: wordWrap.value,
  automaticLayout: true,
  scrollBeyondLastLine: false,
  padding: { top: 16 },
  readOnly: props.readOnly,
}

const CodeEditorComponent = shallowRef<typeof import('monaco-editor-vue3').default | null>(null)

import('monaco-editor-vue3').then((mod) => {
  CodeEditorComponent.value = mod.default
})

function onEditorDidMount(editor: EditorNS.IStandaloneCodeEditor) {
  editorInstance.value = editor
  monaco.editor.defineTheme(THEME_NAME, buildTheme())
  monaco.editor.setTheme(THEME_NAME)
}

function onEditorChange(value: string) {
  emit('update:modelValue', value)
}

watch([fontSize, fontFamily, lineHeight, minimapEnabled, wordWrap], () => {
  if (!editorInstance.value) return
  editorInstance.value.updateOptions({
    fontSize: fontSize.value,
    fontFamily: fontFamily.value,
    lineHeight: lineHeight.value,
    minimap: { enabled: minimapEnabled.value },
    wordWrap: wordWrap.value,
  })
  nextTick(() => {
    monaco.editor.defineTheme(THEME_NAME, buildTheme())
    monaco.editor.setTheme(THEME_NAME)
  })
})
</script>

<template>
  <component
    :is="CodeEditorComponent"
    v-if="CodeEditorComponent"
    :value="modelValue"
    :language="language"
    :theme="THEME_NAME"
    :options="initialOptions"
    width="100%"
    height="100%"
    @editor-did-mount="onEditorDidMount"
    @change="onEditorChange"
  />
</template>
