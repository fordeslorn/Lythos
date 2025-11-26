import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import ForgotPassword from '@/components/auth/ForgotPassword.vue'

import LandingPage from '@/components/pages/LandingPage.vue'
import DashboardPage from '@/components/pages/DashboardPage.vue'
import DashboardLayout from '@/components/pages/DashboardLayout.vue'
import Account from '@/components/pages/user/Account.vue'
import UserSettings from '@/components/pages/user/UserSettings.vue'
import Notifications from '@/components/pages/user/Notifications.vue'
import Resource from '@/components/pages/resource/Resource.vue'
import General from '@/components/pages/settings/General.vue'
import Billing from '@/components/pages/settings/Billing.vue'
import SettingsPage from '@/components/pages/settings/SettingsPage.vue'
import SpidersPage from '@/components/pages/spider/SpidersPage.vue'
import NcMusic from '@/components/pages/spider/NcMusic.vue'
import Pixiv from '@/components/pages/spider/Pixiv.vue'
import SpiderDocs from '@/components/pages/docs/SpiderDocs.vue'
import IntroductionDocs from '@/components/pages/docs/IntroductionDocs.vue'
import DocsPage from '@/components/pages/docs/DocsPage.vue'

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
      // meta: { guestOnly: true }
    },
    {
      path: '/',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: DashboardPage,
        },
        {
          path: 'resource',
          name: 'resource',
          component: Resource
        },
        {
          path: 'spider',
          children: [
            { path: '', name: 'spiders', component: SpidersPage },  
            { path: 'nc-music', name: 'spiders-nc-music', component: NcMusic },  
            { path: 'pixiv', name: 'spiders-pixiv', component: Pixiv },  
          ]
        },
        {
          path: 'docs',
          children: [
            { path: 'spider', name: 'docs-spider', component: SpiderDocs },
            { path: 'introduction', name: 'docs-introduction', component: IntroductionDocs },
            { path: '', name: 'docs', component: DocsPage },
          ]
        },
        {
          path: 'settings',
          children: [
            { path: '', name: 'settings', component: SettingsPage },// 这个空的 path 子路由使得 /settings 路径本身可以渲染一个组件
            { path: 'general', name: 'settings-general', component: General },
            { path: 'billing', name: 'settings-billing', component: Billing },
          ]
        },
        {
          path: 'user',
          children: [
            { path: '', redirect: '/user/account' }, // 重定向到 account 页面
            { path: 'account', name: 'user-account', component: Account },
            { path: 'settings', name: 'user-settings', component: UserSettings },
            { path: 'notifications', name: 'user-notifications', component: Notifications },
          ]
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