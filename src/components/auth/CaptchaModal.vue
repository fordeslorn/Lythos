<script setup lang="ts">
import { ref, watch } from 'vue'
import apiClient from '@/api' 
import { useNotificationStore } from '@/stores/notification'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

defineOptions({
  inheritAttrs: false
})

// --- 1. 定义数据类型 ---
// 定义从后端获取的图片数据类型
interface CaptchaImage {
  id: string
  data: string // Base64 编码的图片字符串
}

// --- 2. 定义 Props 和 Emits ---
// props.open 用于控制弹窗显示，由父组件传入
const props = defineProps<{
  open: boolean
}>()
// 定义组件可以触发的事件
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void // 用于 v-model
  (e: 'success', code: string): void // 验证成功时触发，并传递 code
}>()

const captchaErrorMessageMap: Record<number, string> = {
  1: '杂鱼 ~ 连白毛老婆都分辨不出来了吗',
  2: '杂鱼 ~ 怎么又选错了!',
  3: '杂鱼 ~ 八嘎 ~ 杂鱼 ~ 臭杂鱼 ~',
  4: '臭杂鱼 ~ 做不对验证的臭杂鱼 ~',
  5: '八嘎八嘎八嘎八嘎八嘎八嘎八嘎八嘎',
  6: '杂鱼 ~ 你不会是机器人吧'
}

const notificationStore = useNotificationStore()

// --- 3. 内部响应式状态 ---
const selectedImages = ref(new Set<string>()) // 存储用户选中的图片 ID
const images = ref<CaptchaImage[]>([]) // 存储从后端获取的图片列表
const sessionId = ref('') // 存储当前验证会话的 ID
const loading = ref(true) // 控制加载状态的显示

// --- 4. 核心方法 ---
// 加载验证码数据
const loadCaptcha = async () => {
  loading.value = true

  try {
    // 使用你的 apiClient 向后端请求验证码数据
    const response = await apiClient.get<{
      images: CaptchaImage[]
      sessionId: string
    }>('/auth/captcha') // 注意：这里的路径是相对于 baseURL 的

    images.value = response.data.images
    sessionId.value = response.data.sessionId
    selectedImages.value.clear() // 清空之前的选择
  } catch (error) {
    console.error('加载验证码失败:', error)
    notificationStore.showNotification('加载验证失败，请稍后重试', 'error')
    } finally {
    loading.value = false
  }
}

// 切换图片选中状态
const toggleImageSelection = (id: string) => {
  // 如果正在加载，则不响应点击
  if (loading.value) return
  
  const newSelection = selectedImages.value
  if (newSelection.has(id)) {
    newSelection.delete(id)
  } else {
    newSelection.add(id)
  }
}

// 提交验证
const handleVerify = async () => {
  try {
    const response = await apiClient.post<{ code: string }>(
      '/auth/captcha', // 注意：这里的路径是相对于 baseURL 的
      {
        sessionId: sessionId.value,
        selectedIds: Array.from(selectedImages.value),
      }
    )
    // 验证成功，触发 success 事件并传递 code
    emit('success', response.data.code)
  } catch (error: any) {

    console.error('验证失败:', error)
    
    const messages = Object.values(captchaErrorMessageMap)
    const randomErrorMessage = (messages.length
      ? messages[Math.floor(Math.random() * messages.length)]
      : '验证失败，请重试') as string 

    notificationStore.showNotification(randomErrorMessage, 'error')

    // 失败后重新加载验证码
    loadCaptcha()
  }
}

// 关闭弹窗
const handleClose = () => {
  emit('update:open', false)
}

// --- 5. 监听器 ---
// 监听 open 属性，当弹窗从关闭状态变为打开时，加载数据
watch(
  () => props.open,
  (isOpen, wasOpen) => {
    if (isOpen && !wasOpen) {
      loadCaptcha()
    }
  }
)
</script>

<template>
  <Dialog :open="open" @update:open="handleClose">
    <DialogContent 
      :class="cn(
        'sm:max-w-[466px] bg-zinc-900 text-white border border-white/20 rounded-2xl shadow-lg',
        $attrs.class ?? ''
      )"
    >
      <DialogHeader>
        <DialogTitle>人机验证</DialogTitle>
        <DialogDescription>
          请选择下面所有的 <span class="text-pink-200">白毛</span> 女孩子
        </DialogDescription>
      </DialogHeader>

      <!-- 验证码主体区域 -->
      <div class="min-h-[200px] flex items-center justify-center relative">
        <!-- 加载动画 -->
        <div v-if="loading" class="text-gray-500">正在加载...</div>
        
        <!-- 图片网格 -->
        <div v-else class="grid grid-cols-2 gap-4">
          <div
            v-for="image in images"
            :key="image.id"
            class="aspect-square rounded-md overflow-hidden cursor-pointer border-4 transition-all"
            :class="[selectedImages.has(image.id) ? 'border-blue-500 scale-105' : 'border-transparent']"
            @click="toggleImageSelection(image.id)"
          >
            <img 
                :src="image.data" 
                alt="captcha-image" 
                class="w-full h-full object-cover rounded-2xl"
                :draggable="false"
                @dragstart.prevent
                @contextmenu.prevent
                />
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button 
            class="bg-black/20 text-[#f55f75] hover:bg-[#ffb1c9] border border-white/10"
            variant="outline" 
            @click="handleClose">
            取消
        </Button>
        <Button 
            class="bg-[#3669de] hover:bg-[#859efb] border border-white/20"
            @click="handleVerify" 
            :disabled="selectedImages.size === 0 || loading">
            确定
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>