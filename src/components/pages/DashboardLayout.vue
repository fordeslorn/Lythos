<script setup lang="ts">
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import AppSidebar from '@/components/sidebar/AppSidebar.vue'
import { Separator } from '@/components/ui/separator'
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    
    <SidebarInset>
      <!-- 顶部工具栏 -->
      <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 h-4" />
        <div class="flex items-center gap-2 text-sm">
          <span class="font-semibold">Dashboard</span>
        </div>
      </header>
      
      <!-- 主内容区域 -->
      <main class="flex-1 overflow-y-auto p-6">
        <RouterView />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>