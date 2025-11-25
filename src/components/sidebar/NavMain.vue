<script setup lang="ts">
import type { LucideIcon } from "lucide-vue-next"
import { ChevronRight } from "lucide-vue-next"
import { RouterLink } from 'vue-router'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'

defineProps<{
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[],
  label?: string
}>()
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel v-if="label">{{ label }}</SidebarGroupLabel>
    <SidebarMenu>
      <template v-for="item in items" :key="item.title">
        <!-- Item with sub-items -->
        <Collapsible
          v-if="item.items && item.items.length > 0"
          as-child
          :default-open="item.isActive"
          class="group/collapsible"
        >
          <SidebarMenuItem>
            <div class="flex items-center">
              <SidebarMenuButton as-child :tooltip="item.title" class="flex-1 rounded-r-none group-data-[collapsible=icon]:rounded-r-md">
                <RouterLink :to="item.url">
                  <component :is="item.icon" v-if="item.icon" />
                  <span>{{ item.title }}</span>
                </RouterLink>
              </SidebarMenuButton>
              <CollapsibleTrigger as-child>
                <SidebarMenuButton class="w-8 rounded-l-none p-0 justify-center group-data-[collapsible=icon]:hidden">
                  <ChevronRight class="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent>
              <SidebarMenuSub>
                <SidebarMenuSubItem v-for="subItem in item.items" :key="subItem.title">
                  <SidebarMenuSubButton as-child>
                    <RouterLink :to="subItem.url">
                      <span>{{ subItem.title }}</span>
                    </RouterLink>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
            
          </SidebarMenuItem>
        </Collapsible>

        <!-- Item without sub-items -->
        <SidebarMenuItem v-else>
          <SidebarMenuButton as-child :tooltip="item.title">
            <RouterLink :to="item.url">
              <component :is="item.icon" v-if="item.icon" />
              <span>{{ item.title }}</span>
            </RouterLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </template>
    </SidebarMenu>
  </SidebarGroup>
</template>