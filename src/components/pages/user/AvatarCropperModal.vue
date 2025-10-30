<script setup lang="ts">
import { ref, watch } from 'vue'
import { Cropper, Preview, type CropperResult } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import apiClient from '@/api'
import { useUserStore } from '@/stores/user'
import { useNotificationStore } from '@/stores/notification'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Upload } from 'lucide-vue-next'

// --- Props & Emits ---
const props = defineProps<{
  open: boolean
  initialImageUrl: string | null
}>()
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'success'): void
  (e: 'request-new-file'): void
}>()

// --- Component Refs ---
const cropperRef = ref<InstanceType<typeof Cropper> | null>(null)

// --- Internal State ---
const imageSrc = ref<string | null>(null)
const isLoading = ref(false)
const resultCanvas = ref<HTMLCanvasElement | null>(null)
const cropperKey = ref(0) 
const previewResult = ref<{
  coordinates: CropperResult['coordinates'] | null
  image: CropperResult['image'] | null
}>({
  coordinates: null,
  image: null,
})

const userStore = useUserStore()
const notificationStore = useNotificationStore()

// --- Methods ---
// 抛出事件到父组件(v-model自动生效)，更新isCropperModalOpen为false
function handleClose() {
  emit('update:open', false)
}
// 模拟点击隐藏的文件输入框
function triggerFileInput() {
  emit('request-new-file')
}

function onCropChange({ coordinates, image, canvas }: CropperResult) {
  resultCanvas.value = canvas || null
  previewResult.value = {
    coordinates,
    image,
  }
}

async function onSave() {
  if (!resultCanvas.value) {
    notificationStore.showNotification('Could not get cropped image.', 'error')
    return
  }

  isLoading.value = true
  resultCanvas.value.toBlob(async (blob: Blob | null) => {
    if (!blob) {
      notificationStore.showNotification('Failed to convert image to blob.', 'error')
      isLoading.value = false
      return
    }

    const formData = new FormData()
    formData.append('avatar', blob, 'avatar.png')

    try {
      const response = await apiClient.post('/user/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      userStore.setUser({
        id: userStore.userId!,
        name: userStore.userName!,
        email: userStore.userEmail!,
        avatar: response.data.avatarUrl,
      })
      notificationStore.showNotification('Avatar updated successfully!', 'success')
      emit('success')
      handleClose()
    } catch (error) {
      notificationStore.showNotification('Failed to upload avatar.', 'error')
    } finally {
      isLoading.value = false
    }
  }, 'image/png')
}

// --- Watchers ---
watch(() => props.initialImageUrl, (newUrl) => {
  // 监听 initialImageUrl 的变化来更新图片
  if (newUrl) {
    imageSrc.value = newUrl
    cropperKey.value++
  }
})

watch(() => props.open, (isOpen) => {
  if (isOpen && props.initialImageUrl && !imageSrc.value) {
    // 仅在模态框首次打开时设置 imageSrc
    imageSrc.value = props.initialImageUrl
    cropperKey.value++
  } else if (!isOpen) {
    // 当模态框关闭时，清理内部的 imageSrc
    imageSrc.value = null
  }
})
</script>

<template>
  <Dialog :open="open" @update:open="handleClose">
    <DialogContent class="sm:max-w-[600px] bg-gray-100 text-gray-900 border border-gray-200 rounded-2xl shadow-lg">
      <DialogHeader>
        <DialogTitle class="m-6">修改头像</DialogTitle>
      </DialogHeader>

      <div class="flex flex-col md:flex-row gap-6 items-start p-6">
        <!-- Cropper Area -->
        <div class="w-80 h-80 border border-dashed border-gray-500 rounded-lg flex items-center justify-center relative bg-zinc-800/50">
          <Cropper
            v-if="imageSrc"
            ref="cropperRef"
            :src="imageSrc"
            :stencil-props="{
              aspectRatio: 1,
            }"
            :debounce="false"
            class="w-full h-full"
            @change="onCropChange"
          />
          <div v-else class="text-center flex flex-col items-center gap-2 text-gray-400">
            <Upload class="w-10 h-10" />
            <p>No image selected.</p>
          </div>
        </div>

        <!-- Preview & Controls -->
        <div class="flex flex-col items-center gap-4 flex-shrink-0 m-6">
          <p class="font-semibold">头像预览</p>
          <Preview
            :width="96"
            :height="96"
            :image="previewResult.image"
            :coordinates="previewResult.coordinates"
            class="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 bg-gray-200"
          />
          <Button variant="link" class="text-sm" @click="triggerFileInput">重新上传</Button>
        </div>
      </div>

      <DialogFooter>
        <Button
          class="text-black/300 hover:bg-gray-100 border border-black/10"
          variant="outline"
          @click="handleClose"
        >
          取消
        </Button>
        <Button
          class="hover:bg-black/75 text-white border border-white/20"
          @click="onSave"
          :disabled="!imageSrc || isLoading"
        >
          {{ isLoading ? '保存中...' : '保存' }}
        </Button>
      </DialogFooter>
      
    </DialogContent>
  </Dialog>
</template>
