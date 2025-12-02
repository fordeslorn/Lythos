<script setup lang="ts">
import { ref, onMounted, onActivated, nextTick } from 'vue'
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

defineOptions({
  name: 'ImageLibrary'
})

const router = useRouter()
const images = ref<any[]>([])
const loading = ref(false)
const page = ref(1)
const limit = 80
const total = ref(0)

const loadImages = async () => {
  loading.value = true
  try {
    // API uses 0-based offset
    const res = await imageApi.getImages({ limit, offset: (page.value - 1) * limit })
    if (res.data.success) {
      images.value = res.data.images || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('Failed to load images', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (newPage: number) => {
  page.value = newPage
  loadImages().then(() => {
    nextTick(() => {
      const container = document.querySelector('main') || window
      container.scrollTo({ top: 0, behavior: 'smooth' })
    })
  })
}

const goToDetail = (id: string) => {
  router.push(`/resource/image-library/${id}`)
}

// Helper to get thumbnail URL
const getThumbUrl = (id: string) => {
  return `${import.meta.env.VITE_API_BASE_URL}/images/${id}?mode=thumb`
}

// Scroll Restoration Logic
onBeforeRouteLeave((to, from, next) => {
  const container = document.querySelector('main')
  const scrollTop = container ? container.scrollTop : window.scrollY
  sessionStorage.setItem('image-library-scroll', scrollTop.toString())
  sessionStorage.setItem('image-library-page', page.value.toString())
  next()
})

const restoreScroll = () => {
  const savedScroll = sessionStorage.getItem('image-library-scroll')
  if (savedScroll) {
    nextTick(() => {
      const container = document.querySelector('main')
      if (container) {
        container.scrollTop = parseInt(savedScroll)
      } else {
        window.scrollTo({ top: parseInt(savedScroll), behavior: 'instant' })
      }
    })
  }
}

onMounted(() => {
  const savedPage = sessionStorage.getItem('image-library-page')
  if (savedPage) {
    page.value = parseInt(savedPage)
  }
  
  // Initial load
  loadImages().then(() => {
    restoreScroll()
  })
})

onActivated(() => {
  restoreScroll()
})
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
      <Pagination v-slot="{ page }" :total="total" :sibling-count="1" show-edges :page="page" :items-per-page="limit" @update:page="handlePageChange">
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
