<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { useRouter } from 'vue-router'
import { Rocket, Music } from 'lucide-vue-next'

const router = useRouter()

const guides = [
  {
    title: 'Pixiv Spider Guide',
    description: 'Learn how to configure and use the Pixiv crawler to download images.',
    path: '/docs/spider/pixiv',
    icon: Rocket
  },
  {
    title: 'NcMusic Spider Guide',
    description: 'Documentation for the NetEase Cloud Music crawler (Coming Soon).',
    path: '/docs/spider/nc-music',
    icon: Music
  }
]

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-2">Spider Documentation</h1>
    <p class="text-gray-500 mb-8">Select a guide to view detailed documentation.</p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card
        v-for="guide in guides"
        :key="guide.title"
        @click="navigateTo(guide.path)"
        tabindex="0"
        class="card-hover cursor-pointer transition-colors"
      >
        <CardHeader>
          <div class="flex items-center gap-4">
              <component :is="guide.icon" class="w-8 h-8 text-[#ffacd3]" />
            <CardTitle class="text-lg">{{ guide.title }}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-gray-500">{{ guide.description }}</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.card-hover {
  transition-property: transform, box-shadow;
  transition-duration: 230ms;
  transition-timing-function: ease-in-out;
}
.card-hover:hover {
  transform: translateY(-0.2rem); 
  box-shadow: 0 10px 30px rgba(59,130,246,0.18); 
}
/* 可选：键盘可访问时的 focus 样式 */
.card-hover:focus-visible {
  outline: none;
  box-shadow: 0 6px 18px rgba(59,130,246,0.14), 0 0 0 4px rgba(59,130,246,0.08);
}
</style>