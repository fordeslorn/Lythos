<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Image Library</h1>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <Card v-for="i in 8" :key="i" class="overflow-hidden">
        <CardContent class="p-0">
          <div class="aspect-square bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400">
            Image {{ i }}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
