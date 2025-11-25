<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useRouter } from 'vue-router'
import { BookOpen, Rocket } from 'lucide-vue-next'

const router = useRouter()

const docs = [
  {
    title: 'Introduction',
    description: 'Learn about the features and capabilities of this platform.',
    path: '/docs/introduction',
    icon: BookOpen
  },
  {
    title: 'Spider Guide',
    description: 'How to use the Pixiv and other spider tools effectively.',
    path: '/docs/spider',
    icon: Rocket
  }
]

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-2">Documentation</h1>
    <p class="text-gray-500 mb-8">Guides and references for using the management system.</p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        v-for="doc in docs"
        :key="doc.title"
        @click="navigateTo(doc.path)"
        tabindex="0"
        class="card-hover cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
      >
        <CardHeader>
          <div class="flex items-center gap-4">
            <div class="p-2 bg-primary/10 rounded-lg">
              <component :is="doc.icon" class="w-6 h-6 text-primary" />
            </div>
            <CardTitle class="text-lg">{{ doc.title }}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-gray-500">{{ doc.description }}</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
