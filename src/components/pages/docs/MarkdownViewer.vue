<script setup lang="ts">
import { ref, watch, toRefs } from 'vue'
import MarkdownIt from 'markdown-it'
import 'github-markdown-css/github-markdown.css'

const props = defineProps<{
  fileName?: string
  fileNames?: string[]
  gap?: string
}>()

const { fileName, fileNames } = toRefs(props)
const contents = ref<string[]>([])
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

// 使用 Vite 的 glob 导入功能加载所有 markdown 文件
// as: 'raw' 确保我们得到的是字符串内容
const modules = import.meta.glob('@/assets/docs/*.md', { query: '?raw', import: 'default' })

async function loadContent() {
  contents.value = []
  
  const filesToLoad = fileNames?.value || (fileName?.value ? [fileName.value] : [])
  
  for (const name of filesToLoad) {
    const path = `/src/assets/docs/${name}.md`
    const loader = modules[path]
    
    if (loader) {
      try {
        const rawContent = await loader() as string
        contents.value.push(md.render(rawContent))
      } catch (e) {
        console.error('Error loading markdown:', e)
        contents.value.push('<h1>Error</h1><p>Failed to load document content.</p>')
      }
    } else {
      console.warn(`Document not found: ${path}`, Object.keys(modules))
      contents.value.push('<h1>404</h1><p>Document not found.</p>')
    }
  }
}

watch([fileName, fileNames], loadContent, { immediate: true })
</script>

<template>
  <div class="p-6 h-full overflow-y-auto">
    <div class="documents-grid" :style="{ '--docs-gap': gap || '3rem' }">
      <div 
        v-for="(html, index) in contents" 
        :key="index"
        class="markdown-body bg-transparent dark:text-gray-200 border border-gray-300 dark:border-gray-700 rounded-lg p-6"
      >
        <div v-html="html"></div>
      </div>
    </div>
  </div>
</template>

<style>
/* 简单的暗色模式适配，github-markdown-css 默认是亮色的 */
.dark .markdown-body {
  color: #c9d1d9;
  background-color: transparent;
}

.dark .markdown-body h1,
.dark .markdown-body h2,
.dark .markdown-body h3,
.dark .markdown-body h4,
.dark .markdown-body h5,
.dark .markdown-body h6 {
  color: #ffffff;
  border-bottom-color: #21262d;
}

.dark .markdown-body a {
  color: #58a6ff;
}

.dark .markdown-body pre {
  background-color: #161b22;
}

.dark .markdown-body code {
  background-color: rgba(110, 118, 129, 0.4);
}

/* 使用CSS Grid确保文档卡片之间有明显的间距 */
.documents-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--docs-gap, 3rem);
  align-items: start;
}
</style>
