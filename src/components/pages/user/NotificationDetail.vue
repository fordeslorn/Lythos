<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api'
import { useNotificationStore } from '@/stores/notification'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ArrowLeft, Calendar, User } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const notificationStore = useNotificationStore()
const notification = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  const id = Number(route.params.id)
  
  // Try to get from store first for immediate display
  const cached = notificationStore.getNotificationById(id)
  if (cached) {
    notification.value = cached
    loading.value = false

    // If already read, we don't need to call API
    if (cached.isRead) {
      return
    }
  }

  try {
    // Fetch to get details (if not cached) or to mark as read (if unread)
    const res = await api.get(`/user/notifications/${id}`)
    notification.value = res.data
    
    // Update store to mark as read
    notificationStore.markAsReadInStore(id)
  } catch (error) {
    console.error('Failed to fetch notification details', error)
  } finally {
    loading.value = false
  }
})

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString()
}
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto">
    <Button variant="ghost" class="mb-4 pl-0 hover:pl-2 transition-all" @click="router.back()">
      <ArrowLeft class="mr-2 h-4 w-4" />
      Back to Notifications
    </Button>

    <div v-if="loading" class="text-center py-10">Loading...</div>
    
    <Card v-else-if="notification">
      <CardHeader>
        <div class="flex justify-between items-start">
          <div class="space-y-1">
            <CardTitle class="text-2xl">{{ notification.title }}</CardTitle>
            <div class="flex items-center gap-4 text-sm text-muted-foreground pt-2">
              <div class="flex items-center gap-1">
                <User class="h-4 w-4" />
                {{ notification.senderName }}
              </div>
              <div class="flex items-center gap-1">
                <Calendar class="h-4 w-4" />
                {{ formatDate(notification.createdAt) }}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div class="prose max-w-none whitespace-pre-wrap">
          {{ notification.content }}
        </div>
      </CardContent>
    </Card>

    <div v-else class="text-center py-10 text-muted-foreground">
      Notification not found
    </div>
  </div>
</template>
