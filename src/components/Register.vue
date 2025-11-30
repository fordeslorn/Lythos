<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notification'
import apiClient from '@/api'
import CaptchaModal from '@/components/auth/CaptchaModal.vue'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'


const router = useRouter()
const notificationStore = useNotificationStore()

const isSendingCode = ref(false)
const countdown = ref(0)
const isCaptchaOpen = ref(false)

const email = ref('')
const emailVerificationCode = ref('')
const password = ref('')
const confirmPassword = ref('')

// 错误信息 ref
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')
const emailVerificationCodeError = ref('')
const apiError = ref('')

// 验证函数
function validateEmail() {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!email.value) {
    emailError.value = 'Email cannot be empty'
    return false
  } else if (!emailRegex.test(email.value)) {
    emailError.value = 'Please enter a valid email address'
    return false
  } else {
    emailError.value = ''
    return true
  }
}

function validateEmailVerificationCode() {
  const codeRegex = /^\d{6}$/
  if (!emailVerificationCode.value) {
    emailVerificationCodeError.value = 'Verification code cannot be empty'
    return false
  } else if (!codeRegex.test(emailVerificationCode.value)) {
    emailVerificationCodeError.value = 'Verification code must be 6 digits'
    return false
  }
  emailVerificationCodeError.value = ''
  return true
}

function validatePassword() {
  // 密码要求：8位以上，包含大小写字母和数字
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
  if (!password.value) {
    passwordError.value = 'Password cannot be empty'
  } else if (password.value.length < 8) {
    passwordError.value = 'Password must be at least 8 characters long'
  } else if (!passwordRegex.test(password.value)) {
    passwordError.value = 'Password must contain uppercase, lowercase letters, and numbers'
  } else {
    passwordError.value = ''
  }
}

function validateConfirmPassword() {
  if (!confirmPassword.value) {
    confirmPasswordError.value = 'Please confirm your password'
  } else if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Passwords do not match'
  } else {
    confirmPasswordError.value = ''
  }
}

// 计算属性
const sendCodeButtonText = computed(() => {
  if (countdown.value > 0) {
    return `${countdown.value}s`
  }
  return 'Send Code'
})

// 发送验证码逻辑
async function handleSendCode() {
  if (!validateEmail()) {
    notificationStore.showNotification('Please enter a valid email first.', 'error')
    return
  }
  if (isSendingCode.value || countdown.value > 0) return

  isCaptchaOpen.value = true // 打开人机验证弹窗
}

// 处理人机验证成功后的逻辑
async function onCaptchaSuccess(captchaCode: string) {
  isCaptchaOpen.value = false // 关闭弹窗
  isSendingCode.value = true // 开始加载状态

  try {
    // 将人机验证码和邮箱一起发送到后端
    await apiClient.post('/auth/email-verification', { 
      email: email.value,
      captchaCode: captchaCode, // 发送人机验证码
    })
    notificationStore.showNotification('Verification code sent to your email!', 'success')
    
    // 开始倒计时
    countdown.value = 60
    const interval = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) clearInterval(interval)
    }, 1000)

  } catch (error: any) {
    const msg = error.response?.data?.message || 'Failed to send code. Please try again.'
    notificationStore.showNotification(msg, 'error')
  } finally {
    isSendingCode.value = false // 结束加载状态
  }
}


// 使用 watch 监听输入变化，提供实时反馈
watch(email, validateEmail)
watch(password, () => {
  validatePassword()
  // 如果确认密码已经有值，当主密码变化时也需要重新验证确认密码
  if (confirmPassword.value) {
    validateConfirmPassword()
  }
})
watch(emailVerificationCode, validateEmailVerificationCode)


async function handleRegister() {
  apiError.value = ''
  // 提交时进行最终验证
  validateEmail()
  validatePassword()
  validateConfirmPassword()
  validateEmailVerificationCode()

  // 如果有任何错误，则停止执行
  if (emailError.value || passwordError.value || confirmPasswordError.value || emailVerificationCodeError.value) {
    if (confirmPasswordError.value) {
      confirmPassword.value = ''
      await nextTick()
    }
    return
  }
  
  try {
    await apiClient.post('/auth/register', {
      email: email.value,
      password: password.value,
      emailVerificationCode: emailVerificationCode.value
    });

    // Register successful
    notificationStore.showNotification('Registration successful! Please log in.', 'success');
    router.push('/login');

  } catch (error: any) {
  
    console.error('Register failed:', error);
    const serverMsg = error?.response?.data?.message || error?.response?.data?.error
    
    if (serverMsg && serverMsg.toLowerCase().includes('verification code')) {
      apiError.value = serverMsg; // 显示后端返回的错误信息
      emailVerificationCode.value = ''; // 清空验证码输入框
      await nextTick();
    } else if (error?.response?.status === 409) {
      apiError.value = 'Email already exists'
      // 清空所有输入框
      email.value = ''
      password.value = ''
      confirmPassword.value = ''
      emailVerificationCode.value = ''
      await nextTick()
    } else if (serverMsg) {
      apiError.value = serverMsg
    } else {
      apiError.value = 'Register failed, please try again later.';
    }
  } 
}
</script>

<template>
<div class="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4" style="background-image: url('/bg5.png')">  
  <div class="absolute inset-0 bg-black/40"></div>
    <Card class="w-full max-w-sm relative z-10 bg-zinc-950/10 backdrop-blur-md border border-white/10 text-white shadow-2xl">
      <CardHeader>
        <CardTitle class="text-2xl text-center">
          Create your Account
        </CardTitle>
        <CardDescription class="text-center text-zinc-400">
          Please enter your email and password to create your account.
        </CardDescription>
        <p v-if="apiError" class="text-sm text-red-400 text-center">{{ apiError }}</p>
      </CardHeader>

      <CardContent class="grid gap-4">
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input id="email" v-model="email" type="email" placeholder="m@example.com" required class="bg-zinc-900/10 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-indigo-300/30" />
          <p v-if="emailError" class="text-sm text-red-400">{{ emailError }}</p>
        </div>
        <div class="grid gap-2">
          <Label for="verification-code">Verification Code</Label>
          <div class="flex items-center gap-2">
            <Input id="verification-code" v-model="emailVerificationCode" type="text" placeholder="6-digit code" class="flex-grow bg-zinc-900/10 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-indigo-300/30" required />
            <Button 
              @click="handleSendCode" 
              :disabled="isSendingCode || countdown > 0"
              variant="outline"
              class="bg-transparent border-white/10 hover:bg-white/5 text-zinc-300 hover:text-white transition-colors"
            >
              {{ sendCodeButtonText }}
            </Button>
          </div>
          <p v-if="emailVerificationCodeError" class="text-sm text-red-400">{{ emailVerificationCodeError }}</p>
        </div>
        <div class="grid gap-2">
          <Label for="password">Password</Label>
          <Input id="password" v-model="password" type="password" placeholder="Enter your password" required class="bg-zinc-900/10 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-indigo-300/30" />
          <p v-if="passwordError" class="text-sm text-red-400">{{ passwordError }}</p>
        </div>
        <div class="grid gap-2">
          <Label for="confirm-password">Confirm Password</Label>
          <Input id="confirm-password" v-model="confirmPassword" type="password" placeholder="Confirm your password" required class="bg-zinc-900/10 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-indigo-300/30" />
          <p v-if="confirmPasswordError" class="text-sm text-red-400">{{ confirmPasswordError }}</p>  
        </div>
      </CardContent>

      <CardFooter class="grid gap-4 justify-items-center">
        <Button class="w-full bg-indigo-600/80 hover:bg-indigo-500/80 text-white shadow-lg hover:shadow-indigo-500/20 transition-all duration-200" @click="handleRegister">
          Sign up
        </Button>
        <div class="relative w-full my-2">
          <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t border-white/10"></span>
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-transparent px-2 text-zinc-400">
              or
            </span>
          </div>
        </div>
        <Button variant="outline" 
                class="w-full bg-transparent border-white/10 hover:bg-white/5 text-zinc-300 hover:text-white transition-colors" 
                @click="router.push('/auth/forgot')">
          Forgot Password?
        </Button>
        <Label class="text-zinc-400">Already have an account? <RouterLink to="/login" class="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors">Log in</RouterLink></Label>
      </CardFooter>
    </Card>

    <CaptchaModal v-model:open="isCaptchaOpen" @success="onCaptchaSuccess" />
  </div>
</template>