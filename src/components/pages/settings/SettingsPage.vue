<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Settings, CreditCard } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

const navigateTo = (name: string) => {
  router.push({ name })
}

const isActive = (name: string) => {
  return route.name === name
}
</script>

<template>
  <div class="p-6 space-y-6">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">Settings</h1>
      <p class="text-muted-foreground">Manage your application settings and preferences.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Sidebar Navigation -->
      <div class="space-y-4">
        <Card 
          class="cursor-pointer transition-all hover:bg-accent"
          :class="{ 'border-primary bg-accent': isActive('settings-general') }"
          @click="navigateTo('settings-general')"
        >
          <CardHeader class="flex flex-row items-center space-y-0 p-4">
            <Settings class="w-5 h-5 mr-3 text-muted-foreground" />
            <div>
              <CardTitle class="text-base">General</CardTitle>
              <CardDescription>Profile and account settings</CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card 
          class="cursor-pointer transition-all hover:bg-accent"
          :class="{ 'border-primary bg-accent': isActive('settings-billing') }"
          @click="navigateTo('settings-billing')"
        >
          <CardHeader class="flex flex-row items-center space-y-0 p-4">
            <CreditCard class="w-5 h-5 mr-3 text-muted-foreground" />
            <div>
              <CardTitle class="text-base">Billing & Usage</CardTitle>
              <CardDescription>Usage limits and quotas</CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>

      <!-- Content Area -->
      <div class="md:col-span-2 border-l border-muted-foreground/10 pl-6">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>