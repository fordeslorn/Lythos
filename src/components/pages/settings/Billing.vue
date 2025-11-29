<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiClient from '@/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()
const loading = ref(true)
const usage = ref({
  upload: { count: 0, limit: 100, resetsAt: null as string | null },
  delete: { count: 0, limit: 50, resetsAt: null as string | null }
})

const fetchUsage = async () => {
  loading.value = true
  try {
    const res = await apiClient.get('/user-settings/usage')
    if (res.data.success) {
      usage.value = res.data.usage
    }
  } catch (error) {
    console.error('Failed to fetch usage stats', error)
    notificationStore.showNotification('Failed to load usage statistics', 'error')
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString()
}

onMounted(() => {
  fetchUsage()
})
</script>

<template>
  <div class="p-6">
    <div>
      <h1 class="text-2xl font-bold mb-2">Billing & Usage</h1>
      <p class="text-gray-500 mb-8">Manage your billing information and view usage limits.</p>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Upload Limit</CardTitle>
          <CardDescription>Monthly image upload quota.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex justify-between text-sm">
            <span>{{ usage.upload.count }} / {{ usage.upload.limit }} images</span>
            <span class="text-muted-foreground">{{ Math.round((usage.upload.count / usage.upload.limit) * 100) }}%</span>
          </div>
          <Progress :model-value="(usage.upload.count / usage.upload.limit) * 100" />
          <p class="text-xs text-muted-foreground" v-if="usage.upload.resetsAt">
            Resets on {{ formatDate(usage.upload.resetsAt) }}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delete Limit</CardTitle>
          <CardDescription>Monthly image deletion quota.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex justify-between text-sm">
            <span>{{ usage.delete.count }} / {{ usage.delete.limit }} deletions</span>
            <span class="text-muted-foreground">{{ Math.round((usage.delete.count / usage.delete.limit) * 100) }}%</span>
          </div>
          <Progress :model-value="(usage.delete.count / usage.delete.limit) * 100" />
          <p class="text-xs text-muted-foreground" v-if="usage.delete.resetsAt">
            Resets on {{ formatDate(usage.delete.resetsAt) }}
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>