<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'

import {
  LayoutDashboard,
  Settings2,
} from "lucide-vue-next"

import NavMain from '@/components/sidebar/NavMain.vue'
import NavUser from '@/components/sidebar/NavUser.vue'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
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
      isActive: true,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        { title: "General", url: "#" },
        { title: "Team", url: "#" },
        { title: "Billing", url: "#" },
      ],
    },
  ],
}))
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <div class="flex items-center justify-center p-4">
        <h1 class="text-xl font-semibold">Vue</h1>
      </div>
    </SidebarHeader>

    <SidebarContent>
      <NavMain :items="data.navMain" />
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