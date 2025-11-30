<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notification'
import apiClient from '@/api'
import CaptchaModal from '@/components/auth/CaptchaModal.vue'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const router = useRouter()
const notificationStore = useNotificationStore()

const step = ref(1) // 1: enter email, 2: reset password
const isLoading = ref(false)
const isCaptchaOpen = ref(false)

// --- 表单状态 ---
const email = ref('')
const verificationCode = ref('')
const password = ref('')
const confirmPassword = ref('')

// --- 错误信息状态 ---
const emailError = ref('')
const verificationCodeError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')

// --- 验证函数 ---
function validateEmail() {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!email.value) {
    emailError.value = 'Email cannot be empty'
    return false
  } else if (!emailRegex.test(email.value)) {
    emailError.value = 'Please enter a valid email address'
    return false
  }
  emailError.value = ''
  return true
}

function validateVerificationCode() {
  const codeRegex = /^\d{6}$/
  if (!verificationCode.value) {
    verificationCodeError.value = 'Verification code cannot be empty'
    return false
  } else if (!codeRegex.test(verificationCode.value)) {
    verificationCodeError.value = 'Verification code must be 6 digits'
    return false
  }
  verificationCodeError.value = ''
  return true
}

function validatePassword() {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
  if (!password.value) {
    passwordError.value = 'Password cannot be empty'
    return false
  } else if (password.value.length < 8) {
    passwordError.value = 'Password must be at least 8 characters long'
    return false
  } else if (!passwordRegex.test(password.value)) {
    passwordError.value = 'Password must contain uppercase, lowercase letters, and numbers'
    return false
  }
  passwordError.value = ''
  return true
}

function validateConfirmPassword() {
  if (!confirmPassword.value) {
    confirmPasswordError.value = 'Please confirm your new password'
    return false
  } else if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Passwords do not match'
    return false
  }
  confirmPasswordError.value = ''
  return true
}

// --- 监听输入以提供实时验证 ---
watch(email, validateEmail)
watch(verificationCode, validateVerificationCode)
watch(password, () => {
  validatePassword()
  if (confirmPassword.value) {
    validateConfirmPassword()
  }
})

// --- Step 1: Request Code ---
async function handleRequestCode() {
  if (!validateEmail()) {
    return // 如果邮箱验证失败，则停止
  }
  isCaptchaOpen.value = true // 打开人机验证弹窗
}

async function onCaptchaSuccess(captchaCode: string) {
  isCaptchaOpen.value = false // 关闭弹窗
  isLoading.value = true
  try {
    // 将人机验证码和邮箱一起发送到后端
    await apiClient.post('/auth/forgot-password', { 
      email: email.value,
      captchaCode: captchaCode, // 发送人机验证码
    })
    notificationStore.showNotification('Verification code sent to your email!', 'success')
    step.value = 2 // 成功后进入下一步
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Failed to send code. Please try again.'
    notificationStore.showNotification(msg, 'error')
  } finally {
    isLoading.value = false
  }
}

// --- Step 2: Reset Password ---
async function handleResetPassword() {
  // 触发所有验证
  const isCodeValid = validateVerificationCode()
  const isPasswordValid = validatePassword()
  const isConfirmPasswordValid = validateConfirmPassword()

  if (!isCodeValid || !isPasswordValid || !isConfirmPasswordValid) {
    return // 如果有任何验证失败，则停止
  }

  isLoading.value = true
  try {
    // 预留的后端接口
    await apiClient.post('/auth/reset-password', {
      email: email.value,
      verificationCode: verificationCode.value,
      newPassword: password.value,
    })
    notificationStore.showNotification('Password has been reset successfully! Please log in.', 'success')
    router.push('/login')
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Failed to reset password. Please try again.'
    notificationStore.showNotification(msg, 'error')
  } finally {
    isLoading.value = false
  }
}

function goBack() {
  step.value = 1
  // 清空第二步的状态和错误信息
  verificationCode.value = ''
  password.value = ''
  confirmPassword.value = ''
  verificationCodeError.value = ''
  passwordError.value = ''
  confirmPasswordError.value = ''
}
</script>

<template>
  <div class="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4" style="background-image: url('/bg5.png')">
    <div class="absolute inset-0 bg-black/40"></div>
    <Card class="w-full max-w-sm relative z-10 bg-zinc-950/10 backdrop-blur-md border border-white/10 text-white shadow-2xl">
      <!-- Step 1: Enter Email -->
      <template v-if="step === 1">
        <CardHeader>
          <CardTitle class="text-2xl text-center">Forgot Password</CardTitle>
          <CardDescription class="text-center text-zinc-400">Enter your email to receive a verification code.</CardDescription>
        </CardHeader>
        <CardContent class="grid gap-4">
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input id="email" v-model="email" type="email" placeholder="m@example.com" required class="bg-zinc-900/10 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-indigo-300/30" />
            <p v-if="emailError" class="text-sm text-red-400">{{ emailError }}</p>
          </div>
        </CardContent>
        <CardFooter class="grid gap-4">
          <Button @click="handleRequestCode" 
                  :disabled="isLoading" 
                  class="w-full bg-indigo-600/80 hover:bg-indigo-500/80 text-white shadow-lg hover:shadow-indigo-500/20 transition-all duration-200">
            Send Code
          </Button>
          <Button variant="link" @click="router.push('/login')" class="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors">
            Back to Login
          </Button>
        </CardFooter>
      </template>

      <!-- Step 2: Reset Password -->
      <template v-else>
        <CardHeader>
          <CardTitle class="text-2xl text-center">Reset Password</CardTitle>
          <CardDescription class="text-center text-zinc-400">Please enter the verification code and new password.</CardDescription>
        </CardHeader>
        <CardContent class="grid gap-4">
          <div class="grid gap-2">
            <Label for="reset-email">Email</Label>
            <Input id="reset-email" v-model="email" type="email" readonly disabled class="bg-zinc-900/30 border-white/5 text-zinc-400" />
          </div>
          <div class="grid gap-2">
            <Label for="code">Verification Code</Label>
            <Input id="code" v-model="verificationCode" type="text" placeholder="6-digit code" required class="bg-zinc-900/10 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-indigo-300/30" />
            <p v-if="verificationCodeError" class="text-sm text-red-400">{{ verificationCodeError }}</p>
          </div>
          <div class="grid gap-2">
            <Label for="new-password">New Password</Label>
            <Input id="new-password" v-model="password" type="password" placeholder="Please enter your new password" required class="bg-zinc-900/10 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-indigo-300/30" />
            <p v-if="passwordError" class="text-sm text-red-400">{{ passwordError }}</p>
          </div>
          <div class="grid gap-2">
            <Label for="confirm-new-password">Confirm New Password</Label>
            <Input id="confirm-new-password" v-model="confirmPassword" type="password" placeholder="Please confirm your new password" required class="bg-zinc-900/10 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-indigo-300/30" />
            <p v-if="confirmPasswordError" class="text-sm text-red-400">{{ confirmPasswordError }}</p>
          </div>
        </CardContent>
        <CardFooter class="grid gap-4">
          <Button @click="handleResetPassword" 
                  :disabled="isLoading" 
                  class="w-full bg-indigo-600/80 hover:bg-indigo-500/80 text-white shadow-lg hover:shadow-indigo-500/20 transition-all duration-200">
            Confirm Reset
          </Button>
          <Button variant="link" @click="goBack" class="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors">
            Back
          </Button>
        </CardFooter>
      </template>
    </Card>

    <CaptchaModal v-model:open="isCaptchaOpen" @success="onCaptchaSuccess" />
  </div>
</template>
