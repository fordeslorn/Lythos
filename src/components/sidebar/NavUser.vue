<script setup lang="ts">
import { useUserStore } from '@/stores/user'  

import {
  ChevronsUpDown,
  LogOut,
} from "lucide-vue-next"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

const { isMobile } = useSidebar()
const userStore = useUserStore()  
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar class="h-8 w-8 rounded-lg">
              <AvatarImage :src="userStore.userAvatar || ''" :alt="userStore.userName || ''" />
              <AvatarFallback class="rounded-lg">{{ userStore.userName?.slice(0, 2).toUpperCase() }}</AvatarFallback>
            </Avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">{{ userStore.userName }}</span>
              <span class="truncate text-xs">{{ userStore.userEmail }}</span>
            </div>
            <ChevronsUpDown class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          :side="isMobile ? 'bottom' : 'right'"
          align="end"
          :side-offset="4"
        >
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar class="h-8 w-8 rounded-lg">
                 <AvatarImage :src="userStore.userAvatar || ''" :alt="userStore.userName || ''" />
                  <AvatarFallback class="rounded-lg">{{ userStore.userName?.slice(0, 2).toUpperCase() }}</AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{{ userStore.userName }}</span>
                <span class="truncate text-xs">{{ userStore.userEmail }}</span>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuGroup v-if="userStore.userRights.admin">
            <RouterLink to="/admin" custom v-slot="{ navigate }">
              <DropdownMenuItem @click="navigate">
                Admin
              </DropdownMenuItem>
            </RouterLink>
          </DropdownMenuGroup>

          <DropdownMenuSeparator v-if="userStore.userRights.admin" />

          <DropdownMenuGroup>
            <RouterLink to="/user/account" custom v-slot="{ navigate }">
              <DropdownMenuItem @click="navigate">
                Account
              </DropdownMenuItem>
            </RouterLink>
            <RouterLink to="/user/settings" custom v-slot="{ navigate }">
              <DropdownMenuItem @click="navigate">
                Settings
              </DropdownMenuItem>
            </RouterLink>
            <RouterLink to="/user/notifications" custom v-slot="{ navigate }">
              <DropdownMenuItem @click="navigate">
                Notifications
              </DropdownMenuItem>
            </RouterLink>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem @click="userStore.logout()">
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>

      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>