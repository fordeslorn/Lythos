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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { RefreshCw, ChevronDown } from 'lucide-vue-next'

interface User {
  id: string
  username: string
  email: string
  avatarUrl: string
  userRights: {
    admin: boolean
    uploadVerified: boolean
    uploadSizeLimit: number
    uploadLimit: number
    deleteLimit: number
  }
}

const users = ref<User[]>([])
const loading = ref(false)
const activeUserId = ref<string | null>(null)
const tempSizeLimit = ref<number>(10) // Temporary storage for the input in Popover
const tempUploadLimit = ref<number>(100)
const tempDeleteLimit = ref<number>(50)
const successFeedback = ref<Record<string, boolean>>({})

const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await apiClient.get('/admin/users')
    if (response.data.success) {
      users.value = response.data.users.map((u: any) => ({
        ...u,
        userRights: {
          ...u.userRights,
          uploadSizeLimit: u.userRights.uploadSizeLimit || 10485760, // Default 10MB
          uploadLimit: u.userRights.uploadLimit || 100,
          deleteLimit: u.userRights.deleteLimit || 50
        }
      }))
    }
  } catch (error) {
    console.error('Failed to fetch users:', error)
  } finally {
    loading.value = false
  }
}

const updateUploadVerification = async (user: User, verified: boolean) => {
  try {
    const response = await apiClient.post('/admin/upload-verify', {
      userId: user.id,
      verified: verified
    })
    if (response.data.success) {
      // Update local state
      user.userRights.uploadVerified = verified
    }
  } catch (error) {
    console.error('Failed to update upload verification:', error)
  }
}

const updateUploadSizeLimit = async (user: User) => {
  try {
    const limitBytes = tempSizeLimit.value * 1024 * 1024
    const response = await apiClient.post('/admin/upload-size-limit', {
      userId: user.id,
      limit: limitBytes
    })
    if (response.data.success) {
      user.userRights.uploadSizeLimit = limitBytes
      // Trigger visual feedback
      triggerFeedback(user.id, 'uploadSizeLimit')
    }
  } catch (error) {
    console.error('Failed to update upload size limit:', error)
  }
}

const updateUploadLimit = async (user: User) => {
  try {
    const response = await apiClient.post('/admin/upload-limit', {
      userId: user.id,
      limit: tempUploadLimit.value
    })
    if (response.data.success) {
      user.userRights.uploadLimit = tempUploadLimit.value
      triggerFeedback(user.id, 'uploadLimit')
    }
  } catch (error) {
    console.error('Failed to update upload limit:', error)
  }
}

const updateDeleteLimit = async (user: User) => {
  try {
    const response = await apiClient.post('/admin/delete-limit', {
      userId: user.id,
      limit: tempDeleteLimit.value
    })
    if (response.data.success) {
      user.userRights.deleteLimit = tempDeleteLimit.value
      triggerFeedback(user.id, 'deleteLimit')
    }
  } catch (error) {
    console.error('Failed to update delete limit:', error)
  }
}

const triggerFeedback = (userId: string, type: string) => {
  const key = `${userId}-${type}`
  successFeedback.value[key] = true
  setTimeout(() => {
    successFeedback.value[key] = false
  }, 1000)
}

const openSizeLimitPopover = (currentLimit: number) => {
  tempSizeLimit.value = Math.round(currentLimit / (1024 * 1024))
}

const openUploadLimitPopover = (currentLimit: number) => {
  tempUploadLimit.value = currentLimit
}

const openDeleteLimitPopover = (currentLimit: number) => {
  tempDeleteLimit.value = currentLimit
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
            <TableHead class="w-[100px] text-center">Avatar</TableHead>
            <TableHead class="text-center">Username</TableHead>
            <TableHead class="text-center">Email</TableHead>
            <TableHead class="text-center">ID</TableHead>
            <TableHead class="text-center">Rights & Billing</TableHead>
            <TableHead class="text-center">Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="user in users" :key="user.id">
            <TableCell class="text-center">
              <div class="flex justify-center">
                <Avatar class="h-8 w-8 rounded-lg">
                  <AvatarImage :src="user.avatarUrl || ''" :alt="user.username || ''" />
                  <AvatarFallback class="rounded-lg">{{ user.username?.slice(0, 2).toUpperCase() }}</AvatarFallback>
                </Avatar>
              </div>
            </TableCell>
            <TableCell class="font-medium text-center">{{ user.username }}</TableCell>
            <TableCell class="text-center">{{ user.email }}</TableCell>
            <TableCell class="font-mono text-xs text-muted-foreground text-center">{{ user.id }}</TableCell>
            <TableCell class="text-center">
              <Sheet :open="activeUserId === user.id" @update:open="(val) => activeUserId = val ? user.id : null">
                <HoverCard>
                  <HoverCardTrigger as-child>
                    <SheetTrigger as-child>
                      <Button variant="outline" class="sm border-blue-100 hover:bg-blue-50">Configuration</Button>
                    </SheetTrigger>
                  </HoverCardTrigger>
                  <HoverCardContent class="w-80" v-if="activeUserId !== user.id">
                    <div class="flex justify-between space-x-4">
                      <div class="space-y-1">
                        <h4 class="text-sm font-semibold">User Rights</h4>
                        <p class="text-sm">
                          Admin: 
                          <span :class=" user.userRights?.admin ? 'text-[#5f38cc]' : 'text-muted-foreground'">
                            {{ user.userRights?.admin ? 'Yes' : 'No' }}
                          </span>
                        </p>
                        <p class="text-sm">
                          Upload Verified: 
                          <span :class="user.userRights?.uploadVerified ? 'text-green-500' : 'text-red-500'">
                            {{ user.userRights?.uploadVerified ? 'Yes' : 'No' }}
                          </span>
                        </p>
                        <p class="text-sm">
                          Upload Size Limit: 
                          <span class="text-muted-foreground">
                            {{ (user.userRights?.uploadSizeLimit / (1024 * 1024)).toFixed(0) }} MB
                          </span>
                        </p>
                        <Separator class="my-2" />
                        <h4 class="text-sm font-semibold">Billing Info</h4>
                        <p class="text-sm">
                          Upload Limit: 
                          <span class="text-muted-foreground">{{ user.userRights?.uploadLimit }} / month</span>
                        </p>
                        <p class="text-sm">
                          Delete Limit: 
                          <span class="text-muted-foreground">{{ user.userRights?.deleteLimit }} / month</span>
                        </p>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
                <SheetContent>
                  <SheetHeader class="p-6">
                    <SheetTitle>User Configuration</SheetTitle>
                    <SheetDescription>
                      User: {{ user.username }}<br />
                      ID: {{ user.id }}
                    </SheetDescription>
                  </SheetHeader>
                  <div class="p-6">
                    <h4 class="font-medium mb-4">Rights</h4>
                    <div class="flex items-center justify-between border-b pb-4 mb-4">
                      <span class="text-sm font-medium ">Upload Verification</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            class="transition-colors duration-200"
                            :class="{
                              'bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900': user.userRights?.uploadVerified,
                              'bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900': !user.userRights?.uploadVerified
                            }"
                          >
                            {{ user.userRights?.uploadVerified ? 'Verified' : 'Unverified' }}
                            <ChevronDown class="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem @click="updateUploadVerification(user, true)">
                            Verified
                          </DropdownMenuItem>
                          <DropdownMenuItem @click="updateUploadVerification(user, false)">
                            Unverified
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div class="flex items-center justify-between border-b pb-4 mb-4">
                      <span class="text-sm font-medium">Upload Size Limit</span>
                      <Popover>
                        <PopoverTrigger as-child>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            @click="openSizeLimitPopover(user.userRights.uploadSizeLimit)"
                            class="transition-colors duration-300 border-blue-100 hover:bg-blue-100"
                            :class="{
                              'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900': successFeedback[`${user.id}-uploadSizeLimit`]
                            }"
                          >
                            {{ (user.userRights.uploadSizeLimit / (1024 * 1024)).toFixed(0) }} MB
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent class="w-80">
                          <div class="grid gap-4">
                            <div class="space-y-2">
                              <h4 class="font-medium leading-none">Size Limit</h4>
                              <p class="text-sm text-muted-foreground">
                                Set the maximum upload size for this user.
                              </p>
                            </div>
                            <div class="flex items-center gap-4">
                              <Label for="size">Size</Label>
                              <Input
                                id="size"
                                type="number"
                                class="h-8"
                                v-model="tempSizeLimit"
                              />
                              <span class="text-sm text-muted-foreground">MB</span>
                            </div>
                            <Button size="sm" @click="updateUploadSizeLimit(user)">Save</Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <br /><br />
                    <h4 class="font-medium mb-4">Billing</h4>

                    <div class="flex items-center justify-between border-b pb-4 mb-4">
                      <span class="text-sm font-medium">Upload Limit</span>
                      <Popover>
                        <PopoverTrigger as-child>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            @click="openUploadLimitPopover(user.userRights.uploadLimit)"
                            class="transition-colors duration-300 border-blue-100 hover:bg-blue-100"
                            :class="{
                              'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900': successFeedback[`${user.id}-uploadLimit`]
                            }"
                          >
                            {{ user.userRights.uploadLimit }} / month
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent class="w-80">
                          <div class="grid gap-4">
                            <div class="space-y-2">
                              <h4 class="font-medium leading-none">Upload Limit</h4>
                              <p class="text-sm text-muted-foreground">
                                Set the monthly upload limit for this user.
                              </p>
                            </div>
                            <div class="flex items-center gap-4">
                              <Label for="uploadLimit">Limit</Label>
                              <Input
                                id="uploadLimit"
                                type="number"
                                class="h-8"
                                v-model="tempUploadLimit"
                              />
                            </div>
                            <Button size="sm" @click="updateUploadLimit(user)">Save</Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div class="flex items-center justify-between border-b pb-4 mb-4">
                      <span class="text-sm font-medium">Delete Limit</span>
                      <Popover>
                        <PopoverTrigger as-child>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            @click="openDeleteLimitPopover(user.userRights.deleteLimit)"
                            class="transition-colors duration-300 border-blue-100 hover:bg-blue-100"
                            :class="{
                              'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900': successFeedback[`${user.id}-deleteLimit`]
                            }"
                          >
                            {{ user.userRights.deleteLimit }} / month
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent class="w-80">
                          <div class="grid gap-4">
                            <div class="space-y-2">
                              <h4 class="font-medium leading-none">Delete Limit</h4>
                              <p class="text-sm text-muted-foreground">
                                Set the monthly delete limit for this user.
                              </p>
                            </div>
                            <div class="flex items-center gap-4">
                              <Label for="deleteLimit">Limit</Label>
                              <Input
                                id="deleteLimit"
                                type="number"
                                class="h-8"
                                v-model="tempDeleteLimit"
                              />
                            </div>
                            <Button size="sm" @click="updateDeleteLimit(user)">Save</Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                  </div>
                </SheetContent>
              </Sheet>
            </TableCell>
            <TableCell class="text-center">
              <Badge v-if="user.userRights?.admin" variant="default">Admin</Badge>
              <Badge v-else variant="secondary">User</Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
