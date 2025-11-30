<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import apiClient from '@/api'
import CaptchaModal from './auth/CaptchaModal.vue'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const router = useRouter()
const userStore = useUserStore()  

const email = ref('')
const password = ref('')

// 错误信息 ref
const emailError = ref('')
const passwordError = ref('')
const apiError = ref('')

// 人机验证
const isCaptchaOpen = ref(false)
const pendingLogin = ref(false)


// 验证函数
function validateEmail() {
  // 简单的邮箱格式正则
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!email.value) {
    emailError.value = 'Email cannot be empty'
  } else if (!emailRegex.test(email.value)) {
    emailError.value = 'Please enter a valid email address'
  } else {
    emailError.value = ''
  }
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

// 使用 watch 监听输入变化，提供实时反馈
watch(email, validateEmail)
// watch(password, validatePassword)

async function handleLogin() {
  apiError.value = ''
  // 提交时进行最终验证
  validateEmail()
  validatePassword()

  // 如果有任何错误，则停止执行
  if (emailError.value || passwordError.value) {
    return
  }

  isCaptchaOpen.value = true
}

// Captcha 成功回调：拿到一次性 code 后继续真正的登录请求
async function onCaptchaSuccess(code: string) {
  isCaptchaOpen.value = false
  if (pendingLogin.value) return
  pendingLogin.value = true
  apiError.value = ''

  try {
    const response = await apiClient.post('/auth/login', {
      email: email.value,
      password: password.value,
      verificationCode: code, // 把 captcha code 一并发送
    });

    const userData = {
      id: response.data.user.id,
      name: response.data.user.username,
      email: response.data.user.email,
      avatar: response.data.user.avatarUrl,
      rights: response.data.user.userRights,
    };

    // 将后端返回的用户信息存入 Pinia 全局状态
    userStore.setUser(userData);

    await nextTick();

    // 登录成功后跳转到主页面
    router.replace({ name: 'dashboard' });
  } catch (error: any) {
    
    console.error('Login failed:', error);
    password.value = ''
    await nextTick()
    if (error.response && error.response.data && error.response.data.error) {
      apiError.value = error.response.data.error;
    } else {
      apiError.value = 'Login failed, please check your email and password.';
    }
  } finally {
      pendingLogin.value = false
  }
}
</script>

<template>
<div class="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4" style="background-image: url('/bg5.png')">  
  <div class="absolute inset-0 bg-black/40"></div>
    <Card class="w-full max-w-sm relative z-10 bg-zinc-950/10 backdrop-blur-md border border-white/10 text-white shadow-2xl">
      <CardHeader>
        <CardTitle class="text-2xl text-center">
          Welcome
        </CardTitle>
        <CardDescription class="text-center text-zinc-400">
          Please enter your email and password to log in to your account.
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
          <Label for="password">Password</Label>
          <Input id="password" v-model="password" type="password" placeholder="Enter your password" required class="bg-zinc-900/10 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-indigo-300/30" />
          <p v-if="passwordError" class="text-sm text-red-400">{{ passwordError }}</p>
        </div>
      </CardContent>
      <CardFooter class="grid gap-4 justify-items-center">
        <Button class="w-full bg-indigo-600/80 hover:bg-indigo-500/80 text-white shadow-lg hover:shadow-indigo-500/20 transition-all duration-200" 
                @click="handleLogin"
                :disabled="pendingLogin">
          Log in
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

        <Label class="text-zinc-400">Don't have an account? <RouterLink to="/signup" class="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors">Sign up</RouterLink></Label>
      </CardFooter>
    </Card>

    <CaptchaModal v-model:open="isCaptchaOpen" @success="onCaptchaSuccess" />
  
  </div>
</template>