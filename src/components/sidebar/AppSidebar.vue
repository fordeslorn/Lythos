<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'

import {
  LayoutDashboard,
  Settings2,
  Snowflake,
  Package,
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
      url: "/dashboard/resource",
      icon: Package,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
      items: [
        { title: "General", url: "/dashboard/settings/general" },
        { title: "Billing", url: "/dashboard/settings/billing" },
      ],
    },
  ],
}))
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <SidebarBrand :icon="Snowflake" title="Vue System" />
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