<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useNotificationStore } from '@/stores/notification'
import apiClient from '@/api'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Camera } from 'lucide-vue-next'
import AvatarCropperModal from './AvatarCropperModal.vue'

const userStore = useUserStore()
const notificationStore = useNotificationStore()

// --- Refs for data binding ---
const isCropperModalOpen = ref(false)
const initialImageForModal = ref<string | null>(null)
const avatarFileInput = ref<HTMLInputElement | null>(null) 
const localPreview = ref<string | null>(null);
const avatarPreview = computed(() => localPreview.value || userStore.userAvatar || '/avatars/shadcn.jpg')
const newUsername = ref('')
const newEmail = ref('')
const emailVerificationCode = ref('')
const oldPassword = ref('')
const newPassword = ref('')

// --- Refs for UI state ---
const isSendingCode = ref(false)
const countdown = ref(0)

// --- Refs for error messages ---
const newUsernameError = ref('')
const newEmailError = ref('')
const emailVerificationCodeError = ref('')
const oldPasswordError = ref('')
const newPasswordError = ref('')

// --- Computed properties ---
const sendCodeButtonText = computed(() => {
  if (countdown.value > 0) {
    return `${countdown.value}s`
  }
  return 'Send Code'
})

// --- Validation functions ---
watch(newUsername, (value) => {
  newUsernameError.value = value ? '' : 'Username cannot be empty.'
})
watch(newEmail, (value) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!value) {
    newEmailError.value = ''
  } else if (!emailRegex.test(value)) {
    newEmailError.value = 'Please enter a valid email address.'
  } else {
    newEmailError.value = ''
  }
})
watch(emailVerificationCode, (value) => {
  emailVerificationCodeError.value = /^\d{6}$/.test(value) || !value ? '' : 'Verification code must be 6 digits.'
})
watch(oldPassword, (value) => {
  oldPasswordError.value = value ? '' : 'Old password cannot be empty.'
})
watch(newPassword, (value) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
  if (!value) {
    newPasswordError.value = ''
  } else if (!passwordRegex.test(value)) {
    newPasswordError.value = 'Password must be at least 8 characters and include uppercase, lowercase, and numbers.'
  } else {
    newPasswordError.value = ''
  }
})
watch(isCropperModalOpen, (isOpen) => {
  // 当模态框从打开状态变为关闭状态时
  if (!isOpen && initialImageForModal.value) {
    // 延迟一小段时间再清理，确保子组件的过渡动画完成
    setTimeout(() => {
      URL.revokeObjectURL(initialImageForModal.value!)
      initialImageForModal.value = null
    }, 300) // 300ms 足够大多数 CSS 过渡
  }
})

// --- Event Handlers ---

// Avatar
// click the hidden file input
function handleAvatarClick() {
  avatarFileInput.value?.click()
}
// handle the file selection from the new hidden input
function onInitialFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // Revoke previous URL if it exists
  if (initialImageForModal.value) {
    URL.revokeObjectURL(initialImageForModal.value)
  }

  initialImageForModal.value = URL.createObjectURL(file)
  isCropperModalOpen.value = true

  // Reset the input value to allow selecting the same file again
  target.value = ''
}
function onAvatarUploadSuccess() {
  isCropperModalOpen.value = false

  if (initialImageForModal.value) {
    URL.revokeObjectURL(initialImageForModal.value)
    initialImageForModal.value = null
  }

  console.log('Avatar upload successful, modal closed from parent.')
}

// Username
async function handleUpdateUsername() {
  if (!newUsername.value) {
    newUsernameError.value = 'Username cannot be empty.'
    return
  }
  try {
    await apiClient.put('/user/username', { name: newUsername.value })
    userStore.setUser({
      id: userStore.userId!,
      name: newUsername.value,
      email: userStore.userEmail!,
      avatar: userStore.userAvatar,
    })
    notificationStore.showNotification('Username updated successfully!', 'success')
    newUsername.value = ''
  } catch (error) {
    notificationStore.showNotification('Failed to update username.', 'error')
  }
}

// Email
async function handleSendCode() {
  if (newEmailError.value || !newEmail.value) {
    notificationStore.showNotification('Please enter a valid new email first.', 'error')
    return
  }
  if (isSendingCode.value || countdown.value > 0) return

  isSendingCode.value = true
  try {
    await apiClient.post('/user/send-email-code', { email: newEmail.value })
    notificationStore.showNotification('Verification code sent to your new email!', 'success')
    countdown.value = 60
    const interval = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) clearInterval(interval)
    }, 1000)
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Failed to send code.'
    notificationStore.showNotification(msg, 'error')
  } finally {
    isSendingCode.value = false
  }
}

async function handleUpdateEmail() {
  if (newEmailError.value || !newEmail.value || !emailVerificationCode.value || emailVerificationCodeError.value) {
    notificationStore.showNotification('Please fill in the email fields correctly.', 'error')
    return
  }
  try {
    await apiClient.put('/user/email', {
      email: newEmail.value,
      code: emailVerificationCode.value,
    })
    userStore.setUser({
      id: userStore.userId!,
      name: userStore.userName!,
      email: newEmail.value,
      avatar: userStore.userAvatar,
    })
    notificationStore.showNotification('Email updated successfully!', 'success')
    newEmail.value = ''
    emailVerificationCode.value = ''
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Failed to update email.'
    notificationStore.showNotification(msg, 'error')
  }
}

// Password
async function handleUpdatePassword() {
  if (oldPasswordError.value || !oldPassword.value || newPasswordError.value || !newPassword.value) {
    notificationStore.showNotification('Please fill in the password fields correctly.', 'error')
    return
  }
  try {
    await apiClient.put('/user/password', {
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
    })
    notificationStore.showNotification('Password updated successfully!', 'success')
    oldPassword.value = ''
    newPassword.value = ''
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Failed to update password.'
    notificationStore.showNotification(msg, 'error')
  }
}
</script>

<template>
  <div class="py-6">
    <h1 class="text-2xl font-bold mb-6">User Settings</h1>
    <span>You can update your profile information below.</span><br /><br />
    <div class="space-y-6 max-w-3xl mx-auto w-full px-4">

      <!-- Avatar Card -->
      <Card>
        <CardHeader class="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Avatar</CardTitle>
            <CardDescription class="mt-2">
              This is your public avatar. <br />Click on the image to upload a new one.
            </CardDescription>
          </div>
          <div class="relative group cursor-pointer" @click="handleAvatarClick">
            <Avatar class="h-16 w-16">
              <AvatarImage :src="avatarPreview" alt="User Avatar" />
              <AvatarFallback>{{ userStore.userName?.slice(0, 2).toUpperCase() }}</AvatarFallback>
            </Avatar>
            <div class="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera class="w-6 h-6 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardFooter class="px-6 py-4 text-sm text-gray-500">
          Only JPG and PNG images are allowed. Maximum file size: 2MB.
        </CardFooter>
      </Card>

      <!-- Username Card -->
      <Card>
        <CardHeader>
          <CardTitle>Username</CardTitle>
          <CardDescription>
            This is your public display name.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid gap-2">
            <Label for="username">New Username</Label>
            <Input id="username" v-model="newUsername" placeholder="Enter your new username" />
            <p v-if="newUsernameError" class="text-sm text-red-400">{{ newUsernameError }}</p>
          </div>
        </CardContent>
        <CardFooter class="px-6 py-4 flex justify-end">
          <Button @click="handleUpdateUsername">Save</Button>
        </CardFooter>
      </Card>

      <!-- Email Card -->
      <Card>
        <CardHeader>
          <CardTitle>Email Address</CardTitle>
          <CardDescription>
            Update your email address. A verification code will be sent to the new email.
          </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-4">
          <div class="grid gap-2">
            <Label for="new-email">New Email</Label>
            <Input id="new-email" v-model="newEmail" type="email" placeholder="new.email@example.com" />
            <p v-if="newEmailError" class="text-sm text-red-400">{{ newEmailError }}</p>
          </div>
          <div class="grid gap-2">
            <Label for="verification-code">Verification Code</Label>
            <div class="flex items-center gap-2">
              <Input id="verification-code" v-model="emailVerificationCode" type="text" placeholder="6-digit code" />
              <Button @click="handleSendCode" :disabled="isSendingCode || countdown > 0" variant="outline">
                {{ sendCodeButtonText }}
              </Button>
            </div>
            <p v-if="emailVerificationCodeError" class="text-sm text-red-400">{{ emailVerificationCodeError }}</p>
          </div>
        </CardContent>
        <CardFooter class="px-6 py-4 flex justify-end">
          <Button @click="handleUpdateEmail">Save</Button>
        </CardFooter>
      </Card>

      <!-- Password Card -->
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Update your password. It's recommended to use a strong, unique password.
          </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-4">
          <div class="grid gap-2">
            <Label for="old-password">Old Password</Label>
            <Input id="old-password" v-model="oldPassword" type="password" placeholder="Enter your old password" />
            <p v-if="oldPasswordError" class="text-sm text-red-400">{{ oldPasswordError }}</p>
          </div>
          <div class="grid gap-2">
            <Label for="new-password">New Password</Label>
            <Input id="new-password" v-model="newPassword" type="password" placeholder="Enter your new password" />
            <p v-if="newPasswordError" class="text-sm text-red-400">{{ newPasswordError }}</p>
          </div>
        </CardContent>
        <CardFooter class="px-6 py-4 flex justify-end">
          <Button @click="handleUpdatePassword">Save</Button>
        </CardFooter>
      </Card>
    </div>

     <AvatarCropperModal
      v-model:open="isCropperModalOpen"
      :initial-image-url="initialImageForModal"
      @success="onAvatarUploadSuccess"
    />
    <input
      ref="avatarFileInput"
      type="file"
      class="hidden"
      accept="image/png, image/jpeg"
      @change="onInitialFileSelect"
    >
  </div>
</template>