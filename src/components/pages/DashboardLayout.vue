<script setup lang="ts">
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import AppSidebar from '@/components/sidebar/AppSidebar.vue'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

// 动态生成面包屑路径
const breadcrumbs = computed(() => {
  const pathArray = route.path.split('/').filter(p => p)
  const crumbs = pathArray.map((path, i) => {
    const to = '/' + pathArray.slice(0, i + 1).join('/')
    // 将路径片段转换为首字母大写的标题
    const name = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')
    return { name, to }
  })
  return crumbs
})
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    
    <SidebarInset>
      <!-- 顶部工具栏 -->
      <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <template v-for="(crumb, index) in breadcrumbs" :key="crumb.to">
              <BreadcrumbItem>
                <BreadcrumbPage v-if="index === breadcrumbs.length - 1">
                  {{ crumb.name }}
                </BreadcrumbPage>
                <BreadcrumbLink v-else :href="crumb.to">
                  {{ crumb.name }}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator v-if="index < breadcrumbs.length - 1" />
            </template>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      
      <!-- 主内容区域 -->
      <main class="flex-1 overflow-y-auto p-6">
        <RouterView v-slot="{ Component }">
          <KeepAlive :include="['ImageLibrary']">
            <component :is="Component" />
          </KeepAlive>
        </RouterView>
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>