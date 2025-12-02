<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import api from '@/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useNotificationStore } from '@/stores/notification'
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const router = useRouter()
const userStore = useUserStore()
const notificationStore = useNotificationStore()

const title = ref('')
const content = ref('')
const recipientId = ref('all')
const users = ref<{ id: string; username: string; email: string }[]>([])
const loading = ref(false)
const open = ref(false)

onMounted(async () => {
  try {
    const res = await api.get('/admin/users')
    users.value = res.data.users || []
  } catch (error) {
    console.error('Failed to fetch users', error)
  }
})

const sendNotification = async () => {
  if (!title.value || !content.value) {
    notificationStore.showNotification('Please fill in all fields', 'error')
    return
  }

  loading.value = true
  try {
    await api.post('/admin/notifications', {
      recipientId: recipientId.value,
      title: title.value,
      content: content.value,
      type: 'info'
    })
    notificationStore.showNotification('Notification sent successfully', 'success')
    router.push('/admin')
  } catch (error) {
    console.error('Failed to send notification', error)
    notificationStore.showNotification('Failed to send notification', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Send Notification</h1>
    
    <div class="space-y-6 bg-white p-6 rounded-lg border shadow-sm">
      <div class="space-y-2">
        <Label>Sender</Label>
        <Input :model-value="userStore.userName || ''" disabled />
      </div>

      <div class="space-y-2 flex flex-col">
        <Label>
          Recipient 
          <span class="text-xs text-muted-foreground font-normal ml-2">
            (Loaded {{ users.length }} users)
          </span>
        </Label>
        <Popover v-model:open="open">
          <PopoverTrigger as-child>
            <Button
              variant="outline"
              role="combobox"
              :aria-expanded="open"
              class="w-full justify-between"
            >
              {{ recipientId === 'all' 
                ? 'All Users (Broadcast)' 
                : users.find((user) => user.id === recipientId)?.username || 'Select recipient...' }}
              <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-[400px] p-0">
            <Command>
              <CommandInput class="h-9" placeholder="Search user..." />
              <CommandEmpty>No user found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  <CommandItem
                    value="all"
                    @select="() => {
                      recipientId = 'all'
                      open = false
                    }"
                  >
                    All Users (Broadcast)
                    <Check
                      :class="cn(
                        'ml-auto h-4 w-4',
                        recipientId === 'all' ? 'opacity-100' : 'opacity-0'
                      )"
                    />
                  </CommandItem>
                  <CommandItem
                    class="hover:bg-gray-100 transition-colors duration-200"
                    v-for="user in users"
                    :key="user.id"
                    :value="(user.username + ' ' + user.email).toLowerCase()"
                    @select="() => {
                      recipientId = user.id
                      open = false
                    }"
                  >
                    {{ user.username }}
                    <Check
                      :class="cn(
                        'ml-auto h-4 w-4',
                        recipientId === user.id ? 'opacity-100' : 'opacity-0'
                      )"
                    />
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div class="space-y-2">
        <Label>Description (Title)</Label>
        <Input v-model="title" placeholder="Enter notification title" />
      </div>

      <div class="space-y-2">
        <Label>Content</Label>
        <Textarea v-model="content" placeholder="Enter notification content" rows="5" />
      </div>

      <div class="flex justify-end gap-4">
        <Button variant="outline" @click="router.back()">Cancel</Button>
        <Button @click="sendNotification" :disabled="loading">
          {{ loading ? 'Sending...' : 'Send Notification' }}
        </Button>
      </div>
    </div>
  </div>
</template>
