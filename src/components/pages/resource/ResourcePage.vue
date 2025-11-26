<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useRouter } from 'vue-router'
import { Globe, Image } from 'lucide-vue-next'

const router = useRouter()

const resources = [
  {
    title: 'Useful Sites',
    description: 'A collection of useful websites and tools for development.',
    path: '/resource/useful-site',
    icon: Globe
  },
  {
    title: 'Image Library',
    description: 'Browse and manage your image collection.',
    path: '/resource/image-library',
    icon: Image
  }
]

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-2">Resources</h1>
    <p class="text-gray-500 mb-8">Access your development resources and assets.</p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card
        v-for="item in resources"
        :key="item.title"
        @click="navigateTo(item.path)"
        tabindex="0"
        class="card-hover cursor-pointer transition-colors"
      >
        <CardHeader>
          <div class="flex items-center gap-4">
              <component :is="item.icon" class="w-8 h-8 text-[#ffacd3]" />
            <CardTitle class="text-lg">{{ item.title }}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-gray-500">{{ item.description }}</p>
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