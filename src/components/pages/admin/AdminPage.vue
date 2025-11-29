<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiClient from '@/api'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { RefreshCw } from 'lucide-vue-next'

interface User {
  id: string
  username: string
  email: string
  avatarUrl: string
  userRights: {
    admin: boolean
  }
}

const users = ref<User[]>([])
const loading = ref(false)

const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await apiClient.get('/admin/users')
    if (response.data.success) {
      users.value = response.data.users
    }
  } catch (error) {
    console.error('Failed to fetch users:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold tracking-tight">User Management</h1>
      <Button variant="outline" size="sm" @click="fetchUsers" :disabled="loading">
        <RefreshCw class="mr-2 h-4 w-4" :class="{ 'animate-spin': loading }" />
        Refresh
      </Button>
    </div>

    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-[100px]">Avatar</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>ID</TableHead>
            <TableHead class="text-right">Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="user in users" :key="user.id">
            <TableCell>
              <Avatar class="h-8 w-8 rounded-lg">
                <AvatarImage :src="user.avatarUrl || ''" :alt="user.username || ''" />
                <AvatarFallback class="rounded-lg">{{ user.username?.slice(0, 2).toUpperCase() }}</AvatarFallback>
              </Avatar>
            </TableCell>
            <TableCell class="font-medium">{{ user.username }}</TableCell>
            <TableCell>{{ user.email }}</TableCell>
            <TableCell class="font-mono text-xs text-muted-foreground">{{ user.id }}</TableCell>
            <TableCell class="text-right">
              <Badge v-if="user.userRights?.admin" variant="default">Admin</Badge>
              <Badge v-else variant="secondary">User</Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
