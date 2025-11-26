<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Rocket, Music, Image } from 'lucide-vue-next'

const router = useRouter()

// 定义爬虫导航卡片的数据
const spiders = [
  {
    title: 'Pixiv Spider',
    description: 'Crawl illustrations from Pixiv.',
    path: '/spider/pixiv',
    icon: Image
  },
  {
    title: 'NetEase Cloud Music Spider',
    description: 'Crawl songs to local disk from NetEase Cloud Music.',
    path: '/spider/nc-music',
    icon: Music
  },
  {
    title: 'More Spiders',
    description: 'More spider tools will be added in the future.',
    path: '#', // 暂时不跳转
    icon: Rocket
  }
]

function navigateTo(path: string) {
  if (path && path !== '#') {
    router.push(path)
  }
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-2">Spider Center</h1>
    <p class="text-gray-500 mb-8">Select a spider task to start.</p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        v-for="spider in spiders"
        :key="spider.title"
        @click="navigateTo(spider.path)"
        tabindex="0"
        class="card-hover cursor-pointer transition-colors"
      >
        <CardHeader>
          <div class="flex items-center gap-4 mb-2">
            <component :is="spider.icon" class="w-8 h-8 text-[#ffacd3]" />
            <CardTitle>{{ spider.title }}</CardTitle>
          </div>
          <CardDescription>{{ spider.description }}</CardDescription>
        </CardHeader>
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