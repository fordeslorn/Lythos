<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useRouter } from 'vue-router'
import { FolderHeart, Settings, Bell } from 'lucide-vue-next'

const router = useRouter()

const menuItems = [
  {
    title: 'My Collection',
    description: 'Manage your personal collections and favorites.',
    path: '/user/collection',
    icon: FolderHeart,
    color: 'text-pink-500'
  },
  {
    title: 'Settings',
    description: 'Manage your account settings and preferences.',
    path: '/user/settings',
    icon: Settings,
    color: 'text-blue-500'
  },
  {
    title: 'Notifications',
    description: 'View your notifications and alerts.',
    path: '/user/notifications',
    icon: Bell,
    color: 'text-yellow-500'
  }
]

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-2">Account Center</h1>
    <p class="text-gray-500 mb-8">Manage your account, collections, and settings.</p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        v-for="item in menuItems"
        :key="item.title"
        @click="navigateTo(item.path)"
        tabindex="0"
        class="card-hover cursor-pointer transition-colors group"
      >
        <CardHeader>
          <div class="flex items-center gap-4">
            <div :class="`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors`">
              <component :is="item.icon" :class="`w-6 h-6 ${item.color}`" />
            </div>
            <CardTitle class="text-lg">{{ item.title }}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-gray-500">{{ item.description }}</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.card-hover {
  transition-property: transform, box-shadow;
  transition-duration: 230ms;
  transition-timing-function: ease-in-out;
}
.card-hover:hover {
  transform: translateY(-0.2rem); 
  box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
}
</style>