<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bell } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToNotificationPage = () => {
  router.push('/admin/send-notification')
}
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-xl font-bold tracking-tight">Send Notifications</h2>
    <Card class="hover:shadow-md transition-shadow cursor-pointer border-blue-100 hover:bg-blue-50 transition-colors duration-200" @click="goToNotificationPage">
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">
          <div class="text-2xl font-bold">Broadcast</div>
        </CardTitle>
        <Bell class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div class="text-sm text-muted-foreground">Send alerts to users</div>
      </CardContent>
    </Card>
  </div>
  
</template>
