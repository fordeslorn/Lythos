<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FolderPlus, Folder } from 'lucide-vue-next'
import { imageApi } from '@/api'

const collections = ref<any[]>([])
const isCreateDialogOpen = ref(false)
const newCollectionName = ref('')
const loading = ref(false)

const fetchCollections = async () => {
  loading.value = true
  try {
    const res = await imageApi.getUserCollections()
    if (res.data.success) {
      collections.value = res.data.collections
    }
  } catch (error) {
    console.error('Failed to fetch collections', error)
  } finally {
    loading.value = false
  }
}

async function createCollection() {
  if (!newCollectionName.value.trim()) return

  try {
    const res = await imageApi.createCollection(newCollectionName.value)
    if (res.data.success) {
      collections.value.push(res.data.collection)
      newCollectionName.value = ''
      isCreateDialogOpen.value = false
    }
  } catch (error) {
    console.error('Failed to create collection', error)
  }
}

function openCollection(id: number) {
  // TODO: Navigate to collection details or expand
  console.log('Open collection', id)
}

onMounted(() => {
  fetchCollections()
})
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold">My Collections</h1>
        <p class="text-gray-500">Manage your personal collections and favorites.</p>
      </div>
      
      <Dialog v-model:open="isCreateDialogOpen">
        <DialogTrigger as-child>
          <Button class="gap-2">
            <FolderPlus class="w-4 h-4" />
            New Collection
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Collection</DialogTitle>
          </DialogHeader>
          <div class="grid gap-4 py-4">
            <div class="grid gap-2">
              <Label htmlFor="name">Collection Name</Label>
              <Input id="name" v-model="newCollectionName" placeholder="e.g., My Favorites" @keyup.enter="createCollection" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" @click="isCreateDialogOpen = false">Cancel</Button>
            <Button @click="createCollection">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <Card 
        v-for="collection in collections" 
        :key="collection.id"
        class="group cursor-pointer hover:shadow-lg transition-all duration-300"
        @click="openCollection(collection.id)"
      >
        <div class="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800 relative rounded-t-lg">
          <img 
            v-if="collection.cover" 
            :src="collection.cover" 
            :alt="collection.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
            <Folder class="w-12 h-12" />
          </div>
        </div>
        <CardHeader class="p-4 pb-2">
          <CardTitle class="text-lg truncate">{{ collection.name }}</CardTitle>
        </CardHeader>
        <CardContent class="p-4 pt-0">
          <p class="text-sm text-gray-500">{{ collection.itemCount }} items</p>
        </CardContent>
        <CardFooter class="p-4 pt-0 text-xs text-gray-400">
          Created {{ collection.createdAt }}
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
