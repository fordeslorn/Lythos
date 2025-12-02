<script setup lang="ts">
import { ref, computed } from 'vue'
import { adminApi, imageApi } from '@/api'
import { useNotificationStore } from '@/stores/notification'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, Trash2, Loader2 } from 'lucide-vue-next'

import { Check } from 'lucide-vue-next'

interface User {
  id: string
  username: string
  email: string
  avatarUrl: string
}

interface Image {
  id: string
  title: string
  url: string
  uploadTime: string
}

const notificationStore = useNotificationStore()

const searchQuery = ref('')
const users = ref<User[]>([])
const selectedUser = ref<User | null>(null)
const userImages = ref<Image[]>([])
const loadingUsers = ref(false)
const loadingImages = ref(false)

// Selection & Deletion State
const selectedImageIds = ref<string[]>([])
const isDeleteDialogOpen = ref(false)
const imageToDelete = ref<string | null>(null) // If null, it's a bulk delete

const searchUsers = async () => {
  if (!searchQuery.value) {
    users.value = []
    selectedUser.value = null
    userImages.value = []
    selectedImageIds.value = []
    return
  }
  loadingUsers.value = true
  users.value = []
  selectedUser.value = null
  userImages.value = []
  selectedImageIds.value = []
  try {
    const response = await adminApi.getUsers(searchQuery.value)
    if (response.data.success) {
      users.value = response.data.users || []
    }
  } catch (error) {
    console.error('Failed to search users:', error)
  } finally {
    loadingUsers.value = false
  }
}

const selectUser = async (user: User) => {
  selectedUser.value = user
  loadingImages.value = true
  userImages.value = []
  selectedImageIds.value = []
  try {
    const response = await adminApi.getUserImages(user.id)
    if (response.data.success) {
      userImages.value = response.data.images || []
    }
  } catch (error) {
    console.error('Failed to fetch user images:', error)
  } finally {
    loadingImages.value = false
  }
}

// Checkbox Logic - Following TanStack Table pattern
const isAllSelected = computed(() => {
  return userImages.value.length > 0 && selectedImageIds.value.length === userImages.value.length
})

const isSomeSelected = computed(() => {
  return selectedImageIds.value.length > 0 && selectedImageIds.value.length < userImages.value.length
})

// Header checkbox modelValue: returns true, false, or 'indeterminate'
const headerCheckboxValue = computed(() => {
  return isAllSelected.value || (isSomeSelected.value && 'indeterminate')
})

const toggleSelectAll = (value: boolean | 'indeterminate') => {
  // When user clicks, value will be the NEW state (opposite of current)
  // If currently some/all selected, clicking will unselect all (value = false)
  // If currently none selected, clicking will select all (value = true)
  if (value === true) {
    selectedImageIds.value = userImages.value.map(img => img.id)
  } else {
    selectedImageIds.value = []
  }
}

const toggleSelect = (imageId: string, value: boolean | 'indeterminate') => {
  if (value === true) {
    if (!selectedImageIds.value.includes(imageId)) {
      selectedImageIds.value = [...selectedImageIds.value, imageId]
    }
  } else {
    selectedImageIds.value = selectedImageIds.value.filter(id => id !== imageId)
  }
}

// Delete Logic
const openDeleteDialog = (imageId?: string) => {
  imageToDelete.value = imageId || null
  isDeleteDialogOpen.value = true
}

const confirmDelete = async () => {
  const idsToDelete = imageToDelete.value ? [imageToDelete.value] : Array.from(selectedImageIds.value)
  
  if (idsToDelete.length === 0) return

  try {
    // Execute deletes in parallel
    await Promise.all(idsToDelete.map(id => adminApi.deleteImage(id)))
    
    // Update UI
    userImages.value = userImages.value.filter(img => !idsToDelete.includes(img.id))
    selectedImageIds.value = []
    isDeleteDialogOpen.value = false
    notificationStore.showNotification('Image deleted successfully', 'success')
  } catch (error) {
    console.error('Failed to delete images:', error)
    // Ideally show a toast notification here
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col space-y-2">
      <h2 class="text-lg font-semibold">User Image Management</h2>
      <div class="flex space-x-2">
        <Input v-model="searchQuery" placeholder="Search users by username or email..." @keyup.enter="searchUsers" />
        <Button @click="searchUsers" :disabled="loadingUsers">
          <Search class="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>
    </div>

    <!-- User List -->
    <div v-if="users.length > 0" class="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="text-center">Avatar</TableHead>
            <TableHead class="text-center">User</TableHead>
            <TableHead class="text-center">Email</TableHead>
            <TableHead class="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="user in users" :key="user.id">
            <TableCell class="text-center">
              <div class="flex justify-center">
                <Avatar class="w-8 h-8">
                  <AvatarImage :src="user.avatarUrl" />
                  <AvatarFallback>{{ user.username.charAt(0) }}</AvatarFallback>
                </Avatar>
              </div>
            </TableCell>
            <TableCell class="text-center">{{ user.username }}</TableCell>
            <TableCell class="text-center">{{ user.email }}</TableCell>
            <TableCell class="text-center">
              <Button variant="outline" class="sm border-blue-100 hover:bg-blue-50" @click="selectUser(user)">
                Manage Images
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    <div v-else-if="searchQuery && !loadingUsers && users.length === 0" class="text-sm text-muted-foreground">
        No users found.
    </div>

    <!-- Image List -->
    <div v-if="selectedUser" class="space-y-4 border-t pt-6">
      <div class="flex items-center justify-between">
        <h3 class="text-md font-medium">Images for {{ selectedUser.username }}</h3>
        <Button 
          v-if="selectedImageIds.length > 0" 
          variant="destructive" 
          size="sm" 
          @click="openDeleteDialog()"
        >
          Delete Selected ({{ selectedImageIds.length }})
        </Button>
      </div>
      
      <div v-if="loadingImages" class="flex justify-center py-4">
        <Loader2 class="w-6 h-6 animate-spin" />
      </div>
      
      <div v-else-if="userImages.length > 0" class="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-[50px] text-center">
                <Checkbox 
                  :model-value="headerCheckboxValue"
                  @update:model-value="toggleSelectAll"
                  aria-label="Select all"
                  class="w-5 h-5"
                />
              </TableHead>
              <TableHead class="text-center">Preview</TableHead>
              <TableHead class="text-center">Title</TableHead>
              <TableHead class="text-center">Uploaded At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="image in userImages" :key="image.id">
              <TableCell class="text-center">
                <Checkbox 
                  :model-value="selectedImageIds.includes(image.id)"
                  @update:model-value="(value: boolean | 'indeterminate') => toggleSelect(image.id, value)"
                  aria-label="Select row"
                  class="w-5 h-5"
                />
              </TableCell>
              <TableCell class="text-center">
                <div class="flex justify-center">
                    <img :src="imageApi.getImageUrl(image.id, 'thumb')" class="w-16 h-16 object-cover rounded" />
                </div>
              </TableCell>
              <TableCell class="text-center">{{ image.title || 'Untitled' }}</TableCell>
              <TableCell class="text-center">{{ new Date(image.uploadTime).toLocaleString() }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div v-else class="text-sm text-muted-foreground">
        No images found for this user.
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:open="isDeleteDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {{ imageToDelete ? 'this image' : `these ${selectedImageIds.length} images` }}? 
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="isDeleteDialogOpen = false">Cancel</Button>
          <Button variant="destructive" @click="confirmDelete">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
