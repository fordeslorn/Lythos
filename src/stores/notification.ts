import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  // --- State ---
  const message = ref('')
  const type = ref<'success' | 'error' | 'info'>('info')
  const isVisible = ref(false)
  let timeoutId: number | null = null

  // --- Notification List Cache ---
  const notifications = ref<any[]>([])
  const lastFetched = ref<number>(0)

  // --- Actions ---
  async function fetchNotifications(force = false) {
    // Cache for 1 minute
    if (!force && notifications.value.length > 0 && Date.now() - lastFetched.value < 60000) {
      return
    }
    
    try {
      // We need to import api here to avoid circular dependency issues if possible, 
      // or just assume it's available globally or imported at top.
      // Since this is a store, we can import the api instance.
      const { default: api } = await import('@/api')
      const res = await api.get('/user/notifications')
      notifications.value = res.data || []
      lastFetched.value = Date.now()
    } catch (error) {
      console.error('Failed to fetch notifications', error)
      throw error
    }
  }

  function getNotificationById(id: number) {
    return notifications.value.find(n => n.id === id)
  }

  function markAsReadInStore(id: number) {
    const n = notifications.value.find(n => n.id === id)
    if (n) {
      n.isRead = true
    }
  }

  function showNotification(
    newMessage: string,
    newType: 'success' | 'error' | 'info' = 'error',
    duration: number = 3300
  ) {
    // 如果当前有通知，先清除
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    message.value = newMessage
    type.value = newType
    isVisible.value = true

    // 设置一个定时器，在指定时间后自动隐藏通知
    timeoutId = window.setTimeout(() => {
      hideNotification()
    }, duration)
  }

  function hideNotification() {
    isVisible.value = false
    timeoutId = null
  }

  return { 
    message, 
    type, 
    isVisible, 
    showNotification, 
    hideNotification,
    // Cache exports
    notifications,
    fetchNotifications,
    getNotificationById,
    markAsReadInStore
  }
})