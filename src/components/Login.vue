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
<div class="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4" style="background-image: url('/bg3.png')">  
  <div class="absolute inset-0 bg-black/40"></div>
    <Card class="w-full max-w-sm relative z-10 bg-zinc-950 backdrop-blur-sm border border-white/20 text-white md:transform md:-translate-x-35">
      <CardHeader>
        <CardTitle class="text-2xl text-center">
          Welcome
        </CardTitle>
        <CardDescription>
          Please enter your email and password to log in to your account.
        </CardDescription>
        <p v-if="apiError" class="text-sm text-red-400 text-center">{{ apiError }}</p>
      </CardHeader>
      <CardContent class="grid gap-4">
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input id="email" v-model="email" type="email" placeholder="m@example.com" required />
          <p v-if="emailError" class="text-sm text-red-400">{{ emailError }}</p>
        </div>
        <div class="grid gap-2">
          <Label for="password">Password</Label>
          <Input id="password" v-model="password" type="password" placeholder="Enter your password" required />
          <p v-if="passwordError" class="text-sm text-red-400">{{ passwordError }}</p>
        </div>
      </CardContent>
      <CardFooter class="grid gap-4 justify-items-center">
        <Button class="w-full bg-gray-700/50 hover:bg-gray-700/80 active:bg-gray-600 text-white shadow-sm hover:shadow-md focus-visible:ring-2 focus-visible:ring-indigo-300/50 transition duration-150 transform hover:-translate-y-0.5" 
                @click="handleLogin"
                :disabled="pendingLogin">
          Log in
        </Button>
        <div class="relative w-full my-2">
          <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t border-white/20"></span>
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-zinc-950 px-2 text-zinc-400">
              or
            </span>
          </div>
        </div>
        <Button variant="outline" 
                class="w-full bg-zinc-900 hover:bg-zinc-800 hover:text-white active:bg-zinc-700 text-white shadow-sm hover:shadow-md focus-visible:ring-2 focus-visible:ring-indigo-300/50 transition duration-150 transform hover:-translate-y-0.5" 
                @click="router.push('/auth/forgot')">
          Forgot Password?
        </Button>

        <Label>Don't have an account? <RouterLink to="/signup" class="text-indigo-400 hover:underline">Sign up</RouterLink></Label>
      </CardFooter>
    </Card>

    <CaptchaModal v-model:open="isCaptchaOpen" @success="onCaptchaSuccess" />
  
  </div>
</template>