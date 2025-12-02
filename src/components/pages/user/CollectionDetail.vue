<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { imageApi } from '@/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Trash2, Settings } from 'lucide-vue-next'
import { useNotificationStore } from '@/stores/notification'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
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

const collectionId = parseInt(route.params.id as string)
const collection = ref<any>(null)
const images = ref<any[]>([])
const loading = ref(true)
const coverUrl = ref('')
const isDeleteDialogOpen = ref(false)
const isSheetOpen = ref(false)

const fetchCollectionItems = async () => {
  loading.value = true
  try {
    const res = await imageApi.getCollectionItems(collectionId)
    if (res.data.success) {
      images.value = res.data.images || []
      
      // Fetch collection details to get name, cover, etc.
      const colRes = await imageApi.getUserCollections()
      if (colRes.data.success) {
        const col = colRes.data.collections.find((c: any) => c.id === collectionId)
        if (col) {
          collection.value = col
          coverUrl.value = col.cover || ''
        }
      }
    }
  } catch (error) {
    console.error('Failed to load collection items', error)
    notificationStore.showNotification('Failed to load collection items', 'error')
  } finally {
    loading.value = false
  }
}

const updateCover = async () => {
  if (!coverUrl.value.trim()) return
  try {
    const res = await imageApi.updateCollectionCover(collectionId, coverUrl.value)
    if (res.data.success) {
      notificationStore.showNotification('Cover updated successfully', 'success')
      if (collection.value) collection.value.cover = coverUrl.value
    }
  } catch (error) {
    console.error('Failed to update cover', error)
    notificationStore.showNotification('Failed to update cover', 'error')
  }
}

const deleteCollection = async () => {
  try {
    const res = await imageApi.deleteCollection(collectionId)
    if (res.data.success) {
      notificationStore.showNotification('Collection deleted successfully', 'success')
      router.push('/user/collection')
    }
  } catch (error) {
    console.error('Failed to delete collection', error)
    notificationStore.showNotification('Failed to delete collection', 'error')
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
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <Button variant="ghost" size="icon" @click="goBack">
          <ArrowLeft class="w-5 h-5" />
        </Button>
        <h1 class="text-3xl font-bold tracking-tight">{{ collection?.name || 'Collection Details' }}</h1>
      </div>

      <Sheet v-model:open="isSheetOpen">
        <SheetTrigger as-child>
          <Button variant="outline">
            <Settings class="w-4 h-4 mr-2" />
            Collection Settings
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Collection Settings</SheetTitle>
            <SheetDescription>
              Manage your collection settings here.
            </SheetDescription>
          </SheetHeader>
          
          <div class="py-6 px-6 space-y-6">
            <div class="space-y-2">
              <h3 class="font-medium">Information</h3>
              <div class="text-sm text-muted-foreground space-y-1">
                <p>Name: {{ collection?.name }}</p>
                <p>Items: {{ collection?.itemCount || 0 }}</p>
                <p>Created: {{ collection?.createdAt ? new Date(collection.createdAt).toLocaleDateString() : '-' }}</p>
              </div>
            </div>

            <div class="space-y-2">
              <Label for="cover">Cover URL</Label>
              <div class="flex space-x-2">
                <Input id="cover" v-model="coverUrl" placeholder="https://..." />
                <Button @click="updateCover">Save</Button>
              </div>
            </div>

            <div class="pt-6 border-t">
              <Dialog v-model:open="isDeleteDialogOpen">
                <DialogTrigger as-child>
                  <Button variant="destructive" class="w-full">
                    <Trash2 class="w-4 h-4 mr-2" />
                    Delete Collection
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete the collection "{{ collection?.name }}".
                      The images inside will not be deleted.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" @click="isDeleteDialogOpen = false">Cancel</Button>
                    <Button variant="destructive" @click="deleteCollection">Delete</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </SheetContent>
      </Sheet>
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
          <!-- Gradient Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <!-- Remove Button -->
          <div class="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
             <Button 
               variant="destructive" 
               size="icon" 
               class="h-8 w-8 rounded-full shadow-md hover:bg-red-600"
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
