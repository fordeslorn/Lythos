<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { imageApi } from '@/api'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationFirst,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

const router = useRouter()
const images = ref<any[]>([])
const loading = ref(false)
const page = ref(0)
const limit = 20
const hasMore = ref(true)

const loadImages = async () => {
  if (loading.value || !hasMore.value) return
  loading.value = true
  try {
    const res = await imageApi.getImages({ limit, offset: page.value * limit })
    if (res.data.success) {
      const newImages = res.data.images || []
      if (newImages.length < limit) {
        hasMore.value = false
      }
      images.value.push(...newImages)
      page.value++
    }
  } catch (error) {
    console.error('Failed to load images', error)
  } finally {
    loading.value = false
  }
}

// Intersection Observer for infinite scroll
const observerTarget = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  loadImages()
  
  observer = new IntersectionObserver((entries) => {
    if (entries && entries[0] && entries[0].isIntersecting) {
      loadImages()
    }
  }, { rootMargin: '200px' })
  
  if (observerTarget.value) {
    observer.observe(observerTarget.value)
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

const goToDetail = (id: string) => {
  router.push(`/resource/image-library/${id}`)
}

// Helper to get thumbnail URL
const getThumbUrl = (id: string) => {
  // VITE_API_BASE_URL is http://localhost:8080/api/v1
  return `${import.meta.env.VITE_API_BASE_URL}/images/${id}?mode=thumb`
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Image Library</h1>
    
    <div v-if="loading && images.length === 0" class="flex justify-center items-center h-64">
      <span class="text-gray-400">Loading...</span>
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
      <Card 
        v-for="img in images" 
        :key="img.id" 
        class="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
        @click="goToDetail(img.id)"
      >
        <CardContent class="p-0 relative aspect-square bg-gray-100 dark:bg-zinc-800">
           <img 
             :src="getThumbUrl(img.id)" 
             :alt="img.title" 
             class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
             loading="lazy"
           />
        </CardContent>
      </Card>
    </div>
    
    <!-- Pagination -->
    <div v-if="total > limit" class="flex justify-center pb-8">
      <Pagination v-slot="{ page }" :total="total" :sibling-count="1" show-edges :default-page="1" :items-per-page="limit" @update:page="handlePageChange">
        <PaginationContent v-slot="{ items }" class="flex items-center gap-1">
          <PaginationFirst />
          <PaginationPrevious />

          <template v-for="(item, index) in items">
            <PaginationItem v-if="item.type === 'page'" :key="index" :value="item.value" :is-active="item.value === page">
              {{ item.value }}
            </PaginationItem>
            <PaginationEllipsis v-else :key="item.type" :index="index" />
          </template>

          <PaginationNext />
          <PaginationLast />
        </PaginationContent>
      </Pagination>
    </div>
    
    <div v-if="!loading && images.length === 0" class="text-center text-gray-400 py-12">
      No images found
    </div>
  </div>
</template>
