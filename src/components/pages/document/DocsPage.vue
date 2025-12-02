<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BookOpen, Rocket } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

const navigateTo = (name: string) => {
  router.push({ name })
}

const isActive = (name: string) => {
  // Simple check for exact match or if it's a child route (e.g. spider docs)
  return route.name === name || (name === 'docs-spider' && route.path.startsWith('/docs/spider'))
}
</script>

<template>
  <div class="p-6 space-y-6">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">Documentation</h1>
      <p class="text-muted-foreground">Guides and references for using the management system.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Sidebar Navigation -->
      <div class="space-y-4">
        <Card 
          class="cursor-pointer transition-all hover:bg-accent"
          :class="{ 'border-primary bg-accent': isActive('docs-introduction') }"
          @click="navigateTo('docs-introduction')"
        >
          <CardHeader class="flex flex-row items-center space-y-0 p-4">
            <BookOpen class="w-5 h-5 mr-3 text-muted-foreground" />
            <div>
              <CardTitle class="text-base">Introduction</CardTitle>
              <CardDescription>Platform features overview</CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card 
          class="cursor-pointer transition-all hover:bg-accent"
          :class="{ 'border-primary bg-accent': isActive('docs-spider') }"
          @click="navigateTo('docs-spider')"
        >
          <CardHeader class="flex flex-row items-center space-y-0 p-4">
            <Rocket class="w-5 h-5 mr-3 text-muted-foreground" />
            <div>
              <CardTitle class="text-base">Spider Guide</CardTitle>
              <CardDescription>Crawler tools documentation</CardDescription>
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