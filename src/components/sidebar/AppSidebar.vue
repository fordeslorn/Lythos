<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'

import {
  LayoutDashboard,
  Settings2,
  Snowflake,
  Package,
  Rocket,
  BookOpen
} from "lucide-vue-next"

import NavMain from '@/components/sidebar/NavMain.vue'
import NavUser from '@/components/sidebar/NavUser.vue'
import SidebarBrand from '@/components/sidebar/SidebarBrand.vue'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: "icon",
})

const userStore = useUserStore()

const data = computed(() => ({
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Resource",
      url: "/resource",
      icon: Package,
    },
    {
      title: "Spider",
      url: "/spider",
      icon: Rocket,
      items: [
        { title: "Pixiv", url: "/spider/pixiv" },
        { title: "NcMusic", url: "/spider/nc-music" },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Document",
      url: "/docs",
      icon: BookOpen,
      items: [
        { title: "Introduction", url: "/docs/introduction" },
        { title: "Spider", url: "/docs/spider" },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        { title: "General", url: "/settings/general" },
        { title: "Billing", url: "/settings/billing" },
      ],
    },
  ]
}))
</script>

<template>
  <Sidebar v-bind="props" class="overflow-hidden">
    <SidebarHeader>
      <SidebarBrand :icon="Snowflake" title="Vue System" />
    </SidebarHeader>

    <SidebarContent class="flex-1">
      <NavMain :items="data.navMain" label="Platform" />
      <SidebarSeparator class="!w-6/7   !ml-4" />
      <NavMain :items="data.navSecondary" label="Support" />
    </SidebarContent>

    <SidebarFooter>
      <NavUser 
        v-if="userStore.isLoggedIn" 
        :user="{
          name: userStore.userName!,
          email: userStore.userEmail!,
          avatar: '/avatars/shadcn.jpg'
        }" 
      />
      
      <div v-else class="p-4">
        <div class="h-10 w-full bg-zinc-800 animate-pulse rounded-md"></div>
      </div>
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>