、<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import apiClient from '@/api'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

// --- 左侧控制区的状态 ---
const cookie = ref('')
const userId = ref('')
const isLoading = ref(false)
const isRunning = ref(false)
// --- 右侧结果区的状态 ---
const logs = ref('Spider logs will appear here...\n')
const crawledImages = ref<string[]>([])
// 爬取到的用户信息
const pixivUserInfo = ref<{ name: string; id: string; avatar: string } | null>(null)

let pollInterval: number | null = null

// 清理轮询，防止内存泄漏
onUnmounted(() => {
  if (pollInterval) {
    clearInterval(pollInterval)
  }
})

// --- 事件处理 ---
async function pollStatus(taskId: string) {
  pollInterval = window.setInterval(async () => {
    try {
      const response = await apiClient.get(`/spider/pixiv/status/${taskId}`)
      const data = response.data

      // 更新日志和图片 (这里假设 FastAPI 返回的格式)
      // 您需要根据 FastAPI 的真实返回来调整
      if (data.logs) {
        logs.value = data.logs.join('\n')
      }
      if (data.images) {
        crawledImages.value = data.images
      }

      if (data.status === 'completed' || data.status === 'failed') {
        if (pollInterval) clearInterval(pollInterval)
        isRunning.value = false
        isLoading.value = false
        logs.value += `\n[INFO] Task finished with status: ${data.status}`
      }
    } catch (error) {
      console.error('Polling failed:', error)
      if (pollInterval) clearInterval(pollInterval)
      isRunning.value = false
      isLoading.value = false
      logs.value += '\n[ERROR] Failed to get task status.'
    }
  }, 3000) // 每 3 秒查询一次
}
// 开始爬取
async function handleStartCrawling() {
  if (!cookie.value || !userId.value) {
    logs.value += '[ERROR] Cookie and User ID cannot be empty.\n'
    return
  }

  isLoading.value = true
  isRunning.value = true
  logs.value = `[INFO] Sending request to start crawl for user ID: ${userId.value}\n`
  crawledImages.value = []
  pixivUserInfo.value = null

  try {
    // 调用 Gin 后端的启动接口
    const response = await apiClient.post('/spider/pixiv/start', {
      user_id: userId.value,
      cookie: cookie.value
    })

    if (response.data.task_id) {
      logs.value += `[SUCCESS] Task started with ID: ${response.data.task_id}\n`
      // 开始轮询状态
      pollStatus(response.data.task_id)
    } else {
      throw new Error('Failed to get task ID from server.')
    }
  } catch (error) {
    console.error('Failed to start crawl:', error)
    logs.value += '[ERROR] Failed to start the crawl task.\n'
    isLoading.value = false
    isRunning.value = false
  }
}
// 停止爬取
function handleStopCrawling() {
  // 停止轮询
  if (pollInterval) {
    clearInterval(pollInterval)
  }
  isRunning.value = false
  isLoading.value = false
  logs.value += '[INFO] Crawl stopped by user.\n'
  // 您还可以向后端发送一个停止任务的请求
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
            <div>
              <Button
                v-if="!isRunning"
                @click="handleStartCrawling"
                :disabled="isLoading"
                class="w-full"
              >
                {{ isLoading ? 'Crawling...' : 'Start Crawling' }}
              </Button>
              <Button
                v-else
                variant="destructive"
                @click="handleStopCrawling"
                class="w-full"
              >
                Stop Crawling
              </Button>
            </div>
          </CardContent>
        </Card>

        <!-- 爬取到的用户信息卡片 -->
        <Card v-if="pixivUserInfo">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent class="flex items-center gap-4">
            <img :src="pixivUserInfo.avatar" alt="User Avatar" class="w-24 h-24 rounded-full border" />
            <div>
              <p class="font-bold text-lg">{{ pixivUserInfo.name }}</p>
              <p class="text-sm text-gray-500">ID: {{ pixivUserInfo.id }}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- 右侧：数据显示区 -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        <!-- 爬虫日志框 -->
        <div class="border rounded-lg p-4 flex-shrink-0">
          <h3 class="font-semibold mb-4">Logs</h3>
          <Textarea id="logs" v-model="logs" readonly class="h-48 font-mono text-xs bg-zinc-900 text-gray-300" />
        </div>
        <!-- 爬取到的图片预览 -->
         <div class="border rounded-lg p-4 overflow-y-auto max-h-82">
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