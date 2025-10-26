import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import LandingPage from '@/components/pages/LandingPage.vue'
import DashboardPage from '@/components/pages/DashboardPage.vue'
import DashboardLayout from '@/components/pages/DashboardLayout.vue'
import ForgotPassword from '@/components/auth/ForgotPassword.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPage,
      meta: { guestOnly: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { guestOnly: true }
    },
    {
      path: '/signup',
      name: 'signup',
      component: Register,
      meta: { guestOnly: true }
    },
    {
      path: '/auth/forgot',
      name: 'forgot-password',
      component: ForgotPassword,
      meta: { guestOnly: true }
    },
    {
      path: '/dashboard',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardPage,
        },
      ]
    }
  ]
})

// 全局导航守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  
  // 只在会话未检查过时才调用 restoreSession
  if (!userStore.sessionChecked) {
    await userStore.restoreSession();
  }

  const isAuthenticated = userStore.isLoggedIn;

  if (to.meta.requiresAuth && !isAuthenticated) {
    // 需要登录但未登录，跳转到登录页
    next({ name: 'login' });
  } else if (to.meta.guestOnly && isAuthenticated) {
    // 只允许访客访问但已登录，跳转到仪表盘
    next({ name: 'dashboard' });
  } else {
    // 其他情况正常放行
    next();
  }
});
export default router