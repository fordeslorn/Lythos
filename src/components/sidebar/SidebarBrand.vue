<script setup lang="ts">
import type { Component } from "vue"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

defineProps<{
  icon?: Component
  logo?: string
  title: string
}>()
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton size="lg" class="pointer-events-none">
        <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <img v-if="logo" :src="logo" alt="Logo" class="size-full object-contain" />
          <component v-else-if="icon" :is="icon" class="size-5" />
        </div>
        <div class="grid flex-1 text-left leading-tight">
          <span class="truncate font-semibold text-base">
            {{ title }}
          </span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
</template>