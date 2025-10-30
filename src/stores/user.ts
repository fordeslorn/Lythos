import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import router from '@/router'
import apiClient from '@/api'

// 使用 'user' 作为第一个参数，这是 store 的唯一 ID
export const useUserStore = defineStore('user', () => {
    // State (状态)
    const userId = ref<string | null>(null)
    const userName = ref<string | null>(null)
    const userEmail = ref<string | null>(null)
    const userAvatar = ref<string | null>(null)
    const sessionChecked = ref(false) 

    const isLoggedIn = computed(() => !!userId.value)

     // [核心修改] 在开发环境下，根据环境变量设置初始状态
    if (import.meta.env.DEV && import.meta.env.VITE_MOCK_LOGGED_IN === 'true') {
      userId.value = 'mock-user-id';
      userName.value = 'Dev User';
      userEmail.value = 'dev@example.com';
      userAvatar.value = '/avatars/shadcn.jpg';
      sessionChecked.value = true; 
    }

    // Actions (方法)
    /**
   * [核心] 尝试恢复会话
   * 当用户刷新页面或首次访问时调用，检查用户是否已经有有效的登录凭证（如 cookie）
   */
    async function restoreSession() {
        // 如果正在检查，或已经登录了，就没必要再检查了
        if (isLoggedIn.value) {
            sessionChecked.value = true;
            return;
        }

        try {
            const response = await apiClient.get('/me');
            if (response.data) {
                setUser({ 
                    id: response.data.user.id, 
                    name: response.data.user.username,
                    email: response.data.user.email,
                    avatar: response.data.user.avatarUrl,
                });
            }
        } catch (error) {
            console.error('用户未登录或 token 失效', error)
        } finally {
            sessionChecked.value = true;  
        }
    }

    // 设置用户信息并更新登录状态
    function setUser(userData: { id: string; name: string; email: string; avatar?: string | null }) {
        userId.value = userData.id
        userName.value = userData.name
        userEmail.value = userData.email
        userAvatar.value = userData.avatar || null
        sessionChecked.value = true
    }

    async function logout() {
        try{
            await apiClient.post('/logout');
        } catch (error) {
            console.error('登出失败', error)
        } finally {
            userId.value = null
            userName.value = null
            userEmail.value = null
            userAvatar.value = null
            sessionChecked.value = false
            // 退出后，强制跳转到未登录的首页
            router.push('/')
        }
    }

    return {
    userId,
    userName,
    userEmail,
    userAvatar,
    sessionChecked,
    isLoggedIn,
    setUser,
    logout,
    restoreSession,
  }
})