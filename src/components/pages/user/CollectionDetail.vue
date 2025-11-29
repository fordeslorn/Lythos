<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { imageApi } from '@/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Trash2 } from 'lucide-vue-next'
import { useNotificationStore } from '@/stores/notification'

const route = useRoute()
const router = useRouter()
const notificationStore = useNotificationStore()

const collectionId = parseInt(route.params.id as string)
const collectionName = ref('')
const images = ref<any[]>([])
const loading = ref(true)

const fetchCollectionItems = async () => {
  loading.value = true
  try {
    const res = await imageApi.getCollectionItems(collectionId)
    if (res.data.success) {
      images.value = res.data.images || []
      // We might want to fetch collection details to get the name, 
      // but for now let's assume we can get it or just show "Collection Items"
      // If the API returned collection details, we could use it.
      // Let's try to find the collection name from the previous page state or fetch it.
      // Since getCollectionItems only returns images, we might need another call or update the API.
      // For now, let's just fetch user collections to find the name.
      const colRes = await imageApi.getUserCollections()
      if (colRes.data.success) {
        const col = colRes.data.collections.find((c: any) => c.id === collectionId)
        if (col) collectionName.value = col.name
      }
    }
  } catch (error) {
    console.error('Failed to load collection items', error)
    notificationStore.showNotification('Failed to load collection items', 'error')
  } finally {
    loading.value = false
  }
}

const removeFromCollection = async (imageId: string) => {
  if (!confirm('Are you sure you want to remove this image from the collection?')) return

  try {
    const res = await imageApi.removeFromCollection(collectionId, imageId)
    if (res.data.success) {
      images.value = images.value.filter(img => img.id !== imageId)
      notificationStore.showNotification('Image removed from collection', 'success')
    }
  } catch (error) {
    console.error('Failed to remove image', error)
    notificationStore.showNotification('Failed to remove image', 'error')
  }
}

const getThumbUrl = (id: string) => {
  return `${import.meta.env.VITE_API_BASE_URL}/images/${id}?mode=thumb`
}

const goToDetail = (id: string) => {
  router.push(`/resource/image-library/${id}`)
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  fetchCollectionItems()
})
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center space-x-4">
      <Button variant="ghost" size="icon" @click="goBack">
        <ArrowLeft class="w-5 h-5" />
      </Button>
      <h1 class="text-3xl font-bold tracking-tight">{{ collectionName || 'Collection Details' }}</h1>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <span class="text-gray-400">Loading items...</span>
    </div>

    <div v-else-if="images.length === 0" class="text-center py-12">
      <p class="text-gray-500">No images in this collection.</p>
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <Card 
        v-for="image in images" 
        :key="image.id" 
        class="group overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
        @click="goToDetail(image.id)"
      >
        <CardContent class="p-0 relative aspect-square">
          <img 
            :src="getThumbUrl(image.id)" 
            :alt="image.title"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          
          <!-- Remove Button -->
          <div class="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <Button 
               variant="destructive" 
               size="icon" 
               class="h-8 w-8 rounded-full shadow-sm"
               @click.stop="removeFromCollection(image.id)"
             >
               <Trash2 class="w-4 h-4" />
             </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
