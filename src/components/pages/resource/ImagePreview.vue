<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, ZoomIn, ZoomOut, RotateCw, Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  open: boolean
  imageUrl: string
  altText?: string
}>()

const emit = defineEmits(['update:open'])

const scale = ref(1)
const rotation = ref(0)
const isDragging = ref(false)
const position = ref({ x: 0, y: 0 })
const startPos = ref({ x: 0, y: 0 })
const isLoading = ref(true)

watch(() => props.open, (newVal) => {
  if (newVal) {
    // Reset state when opened
    scale.value = 1
    rotation.value = 0
    position.value = { x: 0, y: 0 }
    isLoading.value = true // Reset loading state
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

const onImageLoad = () => {
  isLoading.value = false
}

const close = () => {
  emit('update:open', false)
}

const zoomIn = () => {
  scale.value = Math.min(scale.value + 0.25, 3)
}

const zoomOut = () => {
  scale.value = Math.max(scale.value - 0.25, 0.5)
}

const rotate = () => {
  rotation.value = (rotation.value + 90) % 360
}

const startDrag = (e: MouseEvent) => {
  if (scale.value <= 1) return
  isDragging.value = true
  startPos.value = {
    x: e.clientX - position.value.x,
    y: e.clientY - position.value.y
  }
}

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return
  e.preventDefault()
  position.value = {
    x: e.clientX - startPos.value.x,
    y: e.clientY - startPos.value.y
  }
}

const stopDrag = () => {
  isDragging.value = false
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="open" 
        class="fixed inset-0 z-50 flex items-center justify-center bg-white"
        @click.self="close"
      >
        <!-- Toolbar -->
        <div class="absolute top-4 right-4 flex items-center gap-2 z-50">
          <Button variant="secondary" size="icon" class="rounded-full bg-white text-black shadow-md hover:bg-gray-100 border border-gray-200" @click="zoomOut">
            <ZoomOut class="w-4 h-4" />
          </Button>
          <Button variant="secondary" size="icon" class="rounded-full bg-white text-black shadow-md hover:bg-gray-100 border border-gray-200" @click="zoomIn">
            <ZoomIn class="w-4 h-4" />
          </Button>
          <Button variant="secondary" size="icon" class="rounded-full bg-white text-black shadow-md hover:bg-gray-100 border border-gray-200" @click="rotate">
            <RotateCw class="w-4 h-4" />
          </Button>
          <Button variant="secondary" size="icon" class="rounded-full bg-white text-black shadow-md hover:bg-gray-100 border border-gray-200" @click="close">
            <X class="w-4 h-4" />
          </Button>
        </div>

        <!-- Image Container -->
        <div 
          class="relative w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
          @mousedown="startDrag"
          @mousemove="onDrag"
          @mouseup="stopDrag"
          @mouseleave="stopDrag"
        >
          <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center z-10">
            <Loader2 class="w-12 h-12 text-gray-900 animate-spin" />
          </div>
          
          <img 
            :src="imageUrl" 
            :alt="altText || 'Preview'"
            class="max-w-none transition-transform duration-200 ease-out select-none"
            :class="{ 'opacity-0': isLoading, 'opacity-100': !isLoading }"
            :style="{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
              maxWidth: scale <= 1 ? '90vw' : 'none',
              maxHeight: scale <= 1 ? '90vh' : 'none'
            }"
            draggable="false"
            @load="onImageLoad"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
