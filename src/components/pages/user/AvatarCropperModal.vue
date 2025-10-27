<script setup lang="ts">
import { ref, watch } from 'vue'
import { Cropper, type CropperResult } from 'vue-advanced-cropper'
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
import { Slider } from '@/components/ui/slider'
import { ZoomIn, ZoomOut, Upload } from 'lucide-vue-next'

// --- Props & Emits ---
const props = defineProps<{
  open: boolean
}>()
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'success'): void
}>()

// --- Component Refs ---
const cropperRef = ref<InstanceType<typeof Cropper> | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

// --- Internal State ---
const imageSrc = ref<string | null>(null)
const zoom = ref([0])
const isLoading = ref(false)
const resultCanvas = ref<HTMLCanvasElement | null>(null)
const previewDataUrl = ref<string | null>(null)

const userStore = useUserStore()
const notificationStore = useNotificationStore()

// --- Methods ---
function handleClose() {
  emit('update:open', false)
}

function triggerFileInput() {
  fileInputRef.value?.click()
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (imageSrc.value) {
    URL.revokeObjectURL(imageSrc.value)
  }

  imageSrc.value = URL.createObjectURL(file)
  zoom.value = [0]
}

function onCropChange({ canvas }: CropperResult) {
  resultCanvas.value = canvas || null
  previewDataUrl.value = canvas?.toDataURL() ?? null
}

// [修复] 添加实时更新函数
function updatePreview() {
  if (cropperRef.value) {
    const { canvas } = cropperRef.value.getResult()
    if (canvas) {
      previewDataUrl.value = canvas.toDataURL()
    }
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
watch(() => props.open, (isOpen) => {
  if (!isOpen) {
    if (imageSrc.value) {
      URL.revokeObjectURL(imageSrc.value)
    }
    imageSrc.value = null
    zoom.value = [0]
    resultCanvas.value = null
    previewDataUrl.value = null
  }
})

watch(zoom, (newZoom, oldZoom) => {
  if (!cropperRef.value) return
  // 计算缩放比例的差值
  const diff = newZoom[0] - (oldZoom ? oldZoom[0] : 0)
  // cropper.zoom 需要一个比例因子，例如 1.1 (放大10%) 或 0.9 (缩小10%)
  // 我们将滑块的微小变化转换为一个缩放因子
  cropperRef.value.zoom(1 + diff)
})
</script>

<template>
  <Dialog :open="open" @update:open="handleClose">
    <DialogContent class="sm:max-w-[600px] bg-zinc-900 text-white border border-white/20 rounded-2xl shadow-lg">
      <DialogHeader>
        <DialogTitle class="m-4">修改头像</DialogTitle>
      </DialogHeader>

      <div class="flex flex-col md:flex-row gap-6 items-start p-4">
        <!-- Cropper Area -->
        <div class="w-80 h-80 border border-dashed border-gray-500 rounded-lg flex items-center justify-center relative bg-zinc-800/50">
          <Cropper
            v-if="imageSrc"
            ref="cropperRef"
            :src="imageSrc"
            :stencil-props="{
              aspectRatio: 1,
            }"
            class="w-full h-full"
            @change="onCropChange"
          />
          <div v-else class="text-center flex flex-col items-center gap-2">
            <Upload class="w-10 h-10 text-gray-500" />
            <p class="text-gray-400">请上传图片</p>
            <Button variant="link" class="text-pink-400" @click="triggerFileInput">点击上传</Button>
          </div>
        </div>

        <!-- Preview & Controls -->
        <div class="flex flex-col items-center gap-4 flex-shrink-0">
          <p class="font-semibold">头像预览</p>
          <div class="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-600 bg-zinc-800">
             <div v-if="previewDataUrl" class="w-full h-full">
                <img :src="previewDataUrl" alt="Preview" class="w-full h-full object-cover" />
             </div>
            <div v-else class="w-full h-full flex items-center justify-center text-xs text-gray-400">
              预览
            </div>
          </div>
          <Button variant="link" class="text-sm" @click="triggerFileInput">重新上传</Button>
        </div>
      </div>

      <!-- Zoom Slider -->
      <div v-if="imageSrc" class="flex items-center gap-2 pt-4">
        <ZoomOut class="w-5 h-5 cursor-pointer" @click="zoom = [Math.max(zoom[0] - 0.1, -1)]" />
        <Slider
          v-model="zoom"
          :min="-1"
          :max="1"
          :step="0.01"
          class="w-full"
        />
        <ZoomIn class="w-5 h-5 cursor-pointer" @click="zoom = [Math.min(zoom[0] + 0.1, 1)]" />
      </div>

      <DialogFooter>
        <Button
          class="bg-black/20 text-gray-300 hover:bg-gray-700 border border-white/10"
          variant="outline"
          @click="handleClose"
        >
          取消
        </Button>
        <Button
          class="bg-pink-600 hover:bg-pink-700 text-white border border-white/20"
          @click="onSave"
          :disabled="!imageSrc || isLoading"
        >
          {{ isLoading ? '保存中...' : '保存' }}
        </Button>
      </DialogFooter>

      <input ref="fileInputRef" type="file" class="hidden" accept="image/png, image/jpeg" @change="onFileChange">
    </DialogContent>
  </Dialog>
</template>
