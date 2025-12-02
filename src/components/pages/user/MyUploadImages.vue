<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiClient from '@/api'
import { useNotificationStore } from '@/stores/notification'
import { useUserStore } from '@/stores/user'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Upload, MoreHorizontal, Trash2, Image as ImageIcon } from 'lucide-vue-next'

interface Image {
  id: string
  url: string
  title: string
  uploadTime: string
}

const notificationStore = useNotificationStore()
const userStore = useUserStore()
const images = ref<Image[]>([])
const loading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const uploadQueue = ref<File[]>([])
const isUploading = ref(false)

const fetchImages = async () => {
  loading.value = true
  try {
    const response = await apiClient.get('/user/images')
    if (response.data.success) {
      images.value = response.data.images
    }
  } catch (error) {
    console.error('Failed to fetch images:', error)
  } finally {
    loading.value = false
  }
}

const checkUploadPermission = async () => {
  try {
    const response = await apiClient.get('/user/upload-permission')
    // Update store with latest limit if available
    if (response.data.uploadSizeLimit) {
      userStore.userRights.uploadSizeLimit = response.data.uploadSizeLimit
    }
    return true
  } catch (error: any) {
    if (error.response?.status === 403) {
      notificationStore.showNotification('You do not have permission to upload images. Please contact admin.', 'error')
    } else {
      notificationStore.showNotification('Failed to check upload permission.', 'error')
    }
    return false
  }
}

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const hasPermission = await checkUploadPermission()
    if (!hasPermission) {
      target.value = ''
      return
    }
    
    const files = Array.from(target.files)
    const limit = userStore.userRights.uploadSizeLimit || 10485760 // Default 10MB
    
    for (const file of files) {
      if (file.size > limit) {
        notificationStore.showNotification(`File "${file.name}" exceeds size limit of ${(limit / (1024 * 1024)).toFixed(0)}MB`, 'error')
        continue
      }
      uploadQueue.value.push(file)
    }
    target.value = '' // Reset input
  }
}

const removeFileFromQueue = (index: number) => {
  uploadQueue.value.splice(index, 1)
}

const uploadImages = async () => {
  if (uploadQueue.value.length === 0) return

  isUploading.value = true
  try {
    for (const file of uploadQueue.value) {
      const formData = new FormData()
      formData.append('file', file)

      await apiClient.post('/user/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      notificationStore.showNotification(`"${file.name}" uploaded successfully`, 'success')
    }
    uploadQueue.value = []
    fetchImages()
  } catch (error: any) {
    console.error('Upload failed:', error)
    notificationStore.showNotification('Failed to upload some images.', 'error')
  } finally {
    isUploading.value = false
  }
}

const deleteImage = async (id: string) => {
  if (!confirm('Are you sure you want to delete this image?')) return

  try {
    await apiClient.delete(`/user/images/${id}`)
    notificationStore.showNotification('Image deleted successfully', 'success')
    // Refresh the list
    await fetchImages()
  } catch (error) {
    console.error('Delete failed:', error)
    notificationStore.showNotification('Failed to delete image', 'error')
  }
}

const triggerFileInput = async () => {
  fileInput.value?.click()
}

onMounted(() => {
  fetchImages()
  // Also check permission on mount to update limits
  checkUploadPermission()
})
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">My Images</h1>
        <p class="text-muted-foreground">Manage your uploaded images.</p>
      </div>
      <Button @click="triggerFileInput">
        <Upload class="mr-2 h-4 w-4" />
        Upload Images
      </Button>
      <input
        type="file"
        ref="fileInput"
        class="hidden"
        multiple
        accept="image/*"
        @change="handleFileSelect"
      />
    </div>

    <!-- Upload Queue -->
    <Card v-if="uploadQueue.length > 0">
      <CardHeader class="relative">
        <CardTitle>Upload Queue</CardTitle>
        <CardDescription>Review images before uploading.</CardDescription>
        <div class="absolute top-6 right-6 bg-blue-500 text-primary-foreground px-3 py-1 rounded-full text-xs font-medium shadow-sm">
          Total: {{ uploadQueue.length }}
        </div>
      </CardHeader>
      <CardContent>
        <div class="space-y-2">
          <div v-for="(file, index) in uploadQueue" :key="index" class="flex items-center justify-between p-2 border rounded">
            <div class="flex items-center gap-2">
              <span class="text-sm truncate max-w-[200px]">{{ file.name }}</span>
              <span class="text-xs text-muted-foreground">({{ (file.size / (1024 * 1024)).toFixed(2) }} MB)</span>
            </div>
            <Button variant="ghost" size="sm" @click="removeFileFromQueue(index)">
              <Trash2 class="h-4 w-4 text-red-500" />
            </Button>
          </div>
          <div class="flex justify-end mt-4">
            <Button @click="uploadImages" :disabled="isUploading">
              {{ isUploading ? 'Uploading...' : 'Confirm Upload' }}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Image List -->
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-[60px] text-center">No</TableHead>
            <TableHead class="w-[100px] text-center">Preview</TableHead>
            <TableHead class="text-center">ID</TableHead>
            <TableHead class="text-center">Title</TableHead>
            <TableHead class="text-center">Uploaded At</TableHead>
            <TableHead class="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(image, index) in images" :key="image.id">
            <TableCell class="font-medium text-muted-foreground text-center">{{ index + 1 }}</TableCell>
            <TableCell class="text-center">
              <div class="h-12 w-12 rounded overflow-hidden bg-muted mx-auto">
                <img :src="image.url" :alt="image.title" class="h-full w-full object-cover" />
              </div>
            </TableCell>
            <TableCell class="font-mono text-xs text-center">{{ image.id }}</TableCell>
            <TableCell class="font-medium text-center">
              <router-link :to="`/resource/image-library/${image.id}`" class="hover:underline">
                {{ image.title }}
              </router-link>
            </TableCell>
            <TableCell class="text-center">{{ new Date(image.uploadTime).toLocaleString() }}</TableCell>
            <TableCell class="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" class="h-8 w-8 p-0">
                    <span class="sr-only">Open menu</span>
                    <MoreHorizontal class="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @click="deleteImage(image.id)" class="text-red-600">
                    <Trash2 class="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
          <TableRow v-if="images.length === 0 && !loading">
            <TableCell colspan="6" class="h-24 text-center">
              No images found.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
