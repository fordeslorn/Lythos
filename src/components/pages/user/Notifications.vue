<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notification'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Bell, Calendar, User } from 'lucide-vue-next'

const router = useRouter()
const notificationStore = useNotificationStore()
const loading = ref(true)

onMounted(async () => {
  try {
    await notificationStore.fetchNotifications()
  } catch (error) {
    console.error('Failed to fetch notifications', error)
  } finally {
    loading.value = false
  }
})

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString()
}

const openNotification = (id: number) => {
  router.push(`/user/notifications/${id}`)
}
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-2">Notifications</h1>
    <p class="text-gray-500 mb-8">Manage your notification preferences here.</p>

    <div v-if="loading" class="text-center py-8">Loading...</div>

    <div v-else-if="notificationStore.notifications.length === 0" class="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
      <Bell class="h-12 w-12 mx-auto text-gray-300 mb-3" />
      <p class="text-gray-500">No notifications yet</p>
    </div>

    <div v-else class="space-y-4">
      <Card 
        v-for="notification in notificationStore.notifications" 
        :key="notification.id"
        class="cursor-pointer hover:shadow-md transition-shadow"
        :class="{ 'bg-blue-50/50': !notification.isRead }"
        @click="openNotification(notification.id)"
      >
        <CardHeader>
          <div class="flex justify-between items-start">
            <div class="space-y-1">
              <CardTitle class="text-lg">{{ notification.title }}</CardTitle>
              <CardDescription class="flex items-center gap-4 mt-1">
                <span class="flex items-center gap-1">
                  <User class="h-3 w-3" />
                  {{ notification.senderName }}
                </span>
                <span class="flex items-center gap-1">
                  <Calendar class="h-3 w-3" />
                  {{ formatDate(notification.createdAt) }}
                </span>
              </CardDescription>
            </div>
            <div v-if="!notification.isRead" class="h-2 w-2 rounded-full bg-blue-500"></div>
          </div>
        </CardHeader>
      </Card>
    </div>
  </div>
</template>
