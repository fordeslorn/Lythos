<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FolderPlus, Folder } from 'lucide-vue-next'

interface Collection {
  id: number
  name: string
  cover?: string
  itemCount: number
  createdAt: string
}

const collections = ref<Collection[]>([
  {
    id: 1,
    name: 'Default Collection',
    cover: '/catcat.gif',
    itemCount: 0,
    createdAt: new Date().toLocaleDateString()
  }
])

const isCreateDialogOpen = ref(false)
const newCollectionName = ref('')

function createCollection() {
  if (!newCollectionName.value.trim()) return

  collections.value.push({
    id: Date.now(),
    name: newCollectionName.value,
    itemCount: 0,
    createdAt: new Date().toLocaleDateString()
  })

  newCollectionName.value = ''
  isCreateDialogOpen.value = false
}

function openCollection(id: number) {
  // TODO: Navigate to collection details or expand
  console.log('Open collection', id)
}
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
