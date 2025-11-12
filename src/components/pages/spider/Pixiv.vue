、<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

// --- 左侧控制区的状态 ---
const cookie = ref('')
const userId = ref('')
const isLoading = ref(false)

// 模拟爬取到的用户信息
const userInfo = ref<{ name: string; id: string; avatar: string } | null>(null)

// --- 右侧结果区的状态 ---
const logs = ref('Spider logs will appear here...\n')
const crawledImages = ref<string[]>([]) // 存储爬取到的图片 URL

// --- 事件处理 ---
function handleStartCrawling() {
  if (!cookie.value || !userId.value) {
    logs.value += '[ERROR] Cookie and User ID cannot be empty.\n'
    return
  }
  
  isLoading.value = true
  logs.value = `[INFO] Starting crawl for user ID: ${userId.value}\n`
  
  // 模拟 API 调用和爬取过程
  setTimeout(() => {
    logs.value += '[INFO] Successfully logged in with cookie.\n'
    logs.value += '[INFO] Fetching user information...\n'
    
    // 模拟获取到用户信息
    userInfo.value = {
      name: 'Mock User',
      id: userId.value,
      avatar: 'https://via.placeholder.com/96' // 使用占位图
    }
    logs.value += `[SUCCESS] User found: ${userInfo.value.name}\n`
    logs.value += '[INFO] Starting to crawl images...\n'

    // 模拟爬取图片
    const mockImages = Array.from({ length: 12 }, (_, i) => `https://via.placeholder.com/300x200?text=Image+${i + 1}`)
    crawledImages.value = mockImages
    
    logs.value += `[SUCCESS] Crawled ${mockImages.length} images.\n`
    logs.value += '[INFO] Crawl finished.\n'
    isLoading.value = false
  }, 2000)
}
</script>

<template>
  <div class="p-6 h-full flex flex-col">
    <h1 class="text-2xl font-bold mb-6">Pixiv Spider</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
      <!-- 左侧：交互区 -->
      <div class="lg:col-span-1 flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Controls</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <Label for="cookie">Cookie</Label>
              <Textarea id="cookie" v-model="cookie" placeholder="Enter your Pixiv cookie" />
            </div>
            <div class="space-y-2">
              <Label for="user-id">User ID</Label>
              <Input id="user-id" v-model="userId" placeholder="Enter the user ID to crawl" />
            </div>
            <Button @click="handleStartCrawling" :disabled="isLoading" class="w-full">
              {{ isLoading ? 'Crawling...' : 'Start Crawling' }}
            </Button>
          </CardContent>
        </Card>

        <!-- 爬取到的用户信息卡片 -->
        <Card v-if="userInfo">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent class="flex items-center gap-4">
            <img :src="userInfo.avatar" alt="User Avatar" class="w-24 h-24 rounded-full border" />
            <div>
              <p class="font-bold text-lg">{{ userInfo.name }}</p>
              <p class="text-sm text-gray-500">ID: {{ userInfo.id }}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- 右侧：数据显示区 -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        <!-- 爬虫日志框 -->
        <div class="flex-shrink-0">
          <Label for="logs">Spider Logs</Label>
          <Textarea id="logs" v-model="logs" readonly class="h-48 font-mono text-xs bg-zinc-900 text-gray-300" />
        </div>

        <!-- 爬取到的图片预览 -->
        <div class="flex-grow border rounded-lg p-4">
          <h3 class="font-semibold mb-4">Crawled Images</h3>
          <div v-if="crawledImages.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div v-for="(img, index) in crawledImages" :key="index" class="aspect-video bg-gray-200 rounded overflow-hidden">
              <img :src="img" alt="Crawled Image" class="w-full h-full object-cover" />
            </div>
          </div>
          <div v-else class="text-center text-gray-400 pt-10">
            <p>Image previews will appear here after crawling.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>