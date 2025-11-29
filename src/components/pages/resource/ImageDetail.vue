<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { imageApi } from '@/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Heart, Star, ArrowLeft, Download, Share2, FolderPlus, Folder, Plus } from 'lucide-vue-next'
import { useNotificationStore } from '@/stores/notification'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const route = useRoute()
const router = useRouter()
const notificationStore = useNotificationStore()

const imageId = route.params.id as string
const image = ref<any>(null)
const loading = ref(true)
const liked = ref(false)
const collected = ref(false)
const likeAnimating = ref(false)
const collectAnimating = ref(false)

// Collection Drawer State
const collections = ref<any[]>([])
const isDrawerOpen = ref(false)
const isDialogOpen = ref(false)
const newCollectionName = ref('')
const creatingCollection = ref(false)

const fetchDetails = async () => {
  loading.value = true
  try {
    const res = await imageApi.getImageDetails(imageId)
    if (res.data.success) {
      image.value = res.data.image
      liked.value = res.data.liked
      collected.value = res.data.collected
    }
  } catch (error) {
    console.error('Failed to load image details', error)
    notificationStore.showNotification('Failed to load image details', 'error')
  } finally {
    loading.value = false
  }
}

const fetchCollections = async () => {
  try {
    const res = await imageApi.getUserCollections()
    if (res.data.success) {
      collections.value = res.data.collections
    }
  } catch (error) {
    console.error('Failed to fetch collections', error)
  }
}

const createCollection = async () => {
  if (!newCollectionName.value.trim()) return
  creatingCollection.value = true
  try {
    const res = await imageApi.createCollection(newCollectionName.value)
    if (res.data.success) {
      collections.value.push(res.data.collection)
      newCollectionName.value = ''
      notificationStore.showNotification('Collection created', 'success')
      isDialogOpen.value = false
    }
  } catch (error) {
    console.error('Failed to create collection', error)
    notificationStore.showNotification('Failed to create collection', 'error')
  } finally {
    creatingCollection.value = false
  }
}

const addToCollection = async (collectionId: number, collectionName: string) => {
  try {
    const res = await imageApi.addToCollection(collectionId, imageId)
    if (res.data.success) {
      notificationStore.showNotification(`Added to ${collectionName}`, 'success')
      isDrawerOpen.value = false
    }
  } catch (error) {
    console.error('Failed to add to collection', error)
    notificationStore.showNotification('Failed to add to collection', 'error')
  }
}

const toggleLike = async () => {
  likeAnimating.value = true
  try {
    const res = await imageApi.toggleLike(imageId)
    if (res.data.success) {
      liked.value = res.data.liked
    }
  } catch (error) {
    console.error('Failed to toggle like', error)
  } finally {
    setTimeout(() => {
      likeAnimating.value = false
    }, 300)
  }
}

const toggleCollection = async () => {
  collectAnimating.value = true
  try {
    const res = await imageApi.toggleCollection(imageId)
    if (res.data.success) {
      collected.value = res.data.collected
      notificationStore.showNotification(
        collected.value ? 'Added to My Collection' : 'Removed from My Collection',
        'success'
      )
    }
  } catch (error) {
    console.error('Failed to toggle collection', error)
    notificationStore.showNotification('Failed to toggle collection', 'error')
  } finally {
    setTimeout(() => {
      collectAnimating.value = false
    }, 300)
  }
}

const goBack = () => {
  router.back()
}

const getImageUrl = (mode: string) => {
  return `${import.meta.env.VITE_API_BASE_URL}/images/${imageId}?mode=${mode}`
}

onMounted(() => {
  fetchDetails()
})
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto">
    <Button variant="ghost" class="mb-4" @click="goBack">
      <ArrowLeft class="w-4 h-4 mr-2" /> Back
    </Button>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <span class="text-gray-400">Loading details...</span>
    </div>

    <div v-else-if="image" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Image Display -->
      <div class="lg:col-span-2">
        <Card class="overflow-hidden bg-black/5 border-0 shadow-sm">
          <CardContent class="p-0 flex items-center justify-center min-h-[400px] bg-gray-100 dark:bg-zinc-900">
            <img 
              :src="getImageUrl('detail')" 
              :alt="image.title" 
              class="max-w-full max-h-[80vh] object-contain"
            />
          </CardContent>
        </Card>
      </div>

      <!-- Details Sidebar -->
      <div class="space-y-6">
        <div>
          <p class="text-2xl font-bold mb-2">ID: {{ image.id }}</p>
        </div>

        <div class="flex space-x-4">
          <Button 
            size="lg" 
            variant="outline" 
            class="flex-1 transition-all duration-300"
            :class="{ 'text-red-500 border-red-200 bg-red-50 dark:bg-red-900/20': liked }"
            @click="toggleLike"
          >
            <Heart 
              class="w-6 h-6 mr-2 transition-transform duration-300" 
              :class="{ 'fill-current scale-125': liked, 'scale-100': !liked, 'animate-bounce': likeAnimating }" 
            />
            {{ liked ? 'Liked' : 'Like' }}
          </Button>

          <Button 
            size="lg" 
            variant="outline" 
            class="flex-1 transition-all duration-300"
            :class="{ 'text-yellow-500 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20': collected }"
            @click="toggleCollection"
          >
            <Star 
              class="w-6 h-6 mr-2 transition-transform duration-300" 
              :class="{ 'fill-current scale-125': collected, 'scale-100': !collected, 'animate-spin-once': collectAnimating }" 
            />
            {{ collected ? 'Saved' : 'Save' }}
          </Button>
        </div>

        <div v-if="collected" class="mt-4">
          <Drawer v-model:open="isDrawerOpen">
            <DrawerTrigger as-child>
              <Button variant="outline" class="w-full" @click="fetchCollections">
                <FolderPlus class="w-4 h-4 mr-2" />
                Move to Collection
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div class="mx-auto w-full max-w-4xl h-[50vh] flex flex-col p-6">
                <DrawerHeader class="text-left px-0">
                  <DrawerTitle class="text-2xl">Move to Collection</DrawerTitle>
                  <DrawerDescription>Select a collection to add this image to.</DrawerDescription>
                </DrawerHeader>
                
                <div class="flex justify-end mb-4">
                  <Dialog v-model:open="isDialogOpen">
                    <DialogTrigger as-child>
                      <Button>
                        <Plus class="w-4 h-4 mr-2" /> New Collection
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Collection</DialogTitle>
                        <DialogDescription>Enter a name for your new collection.</DialogDescription>
                      </DialogHeader>
                      <div class="py-4">
                        <Input v-model="newCollectionName" placeholder="Collection Name" />
                      </div>
                      <DialogFooter>
                        <Button @click="createCollection" :disabled="creatingCollection">Create</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pb-6">
                  <Card
                    v-for="col in collections"
                    :key="col.id"
                    class="cursor-pointer hover:shadow-md hover:scale-102 hover:bg-pink-50 transition-all duration-200 border border-blue-100 hover:border-[#ffacd3]/50 bg-white dark:bg-gray-800"
                    @click="addToCollection(col.id, col.name)"
                  >
                    <CardContent class="p-2 flex items-center space-x-2">
                      <div class="p-1 bg-primary/10 rounded-full">
                        <Folder class="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 class="font-medium text-sm">{{ col.name }}</h3>
                        <p class="text-xs text-muted-foreground">{{ col.itemCount || 0 }} items</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        <Card>
          <CardContent class="p-6 space-y-4">
            <div class="flex justify-between items-center py-2 border-b">
              <span class="text-gray-500">Uploader</span>
              <span class="font-medium">{{ image.uploader || 'Unknown' }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b">
              <span class="text-gray-500">Uploaded</span>
              <span class="font-medium">{{ new Date(image.uploadTime).toLocaleDateString() }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b">
              <span class="text-gray-500">Dimensions</span>
              <span class="font-medium">Original</span>
            </div>
             <div class="flex justify-between items-center py-2">
              <span class="text-gray-500">Format</span>
              <span class="font-medium">JPEG</span>
            </div>
          </CardContent>
        </Card>

        <div class="flex space-x-2">
           <Button variant="secondary" class="w-full" as="a" :href="getImageUrl('origin')" download target="_blank">
             <Download class="w-4 h-4 mr-2" /> Download Original
           </Button>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-12">
      <h2 class="text-xl font-semibold">Image not found</h2>
      <Button class="mt-4" @click="goBack">Go Back</Button>
    </div>
  </div>
</template>

<style scoped>
@keyframes spin-once {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.2); }
  100% { transform: rotate(360deg) scale(1); }
}
.animate-spin-once {
  animation: spin-once 0.5s ease-in-out;
}
</style>
