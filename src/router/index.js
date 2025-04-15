import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/add-pin-pv',
      name: 'add-pin-pv',
      component: () => import('../views/AddPinPv.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/add-inverter',
      name: 'add-inverter',
      component: () => import('../views/AddInverter.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/add-battery',
      name: 'add-battery',
      component: () => import('../views/AddBattery.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/add-aluminum-frame',
      name: 'add-aluminum-frame',
      component: () => import('../views/AddAluminumFrame.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/add-cable',
      name: 'add-cable',
      component: () => import('../views/AddCable.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/add-cabinet',
      name: 'add-cabinet',
      component: () => import('../views/AddCabinet.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/add-grounding-system',
      name: 'add-grounding-system',
      component: () => import('../views/AddGroundingSystem.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/add-installation',
      name: 'add-installation',
      component: () => import('../views/AddInstallation.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/combo-create',
      name: 'combo-create',
      component: () => import('../views/ComboCreate.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/contract-create',
      name: 'contract-create',
      component: () => import('../views/ContractCreate.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/contract-create-old',
      name: 'contract-create-old',
      component: () => import('../views/ContractCreateOld.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/add-content',
      name: 'add-content',
      component: () => import('../views/AddContent.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/policy-and-privacy',
      name: 'policy-and-privacy',
      component: () => import('../views/PolicyAndPrivacy.vue'),
      meta: { requiresAuth: true }
    },
  ],
})

// Navigation guard toàn cầu
router.beforeEach((to, from, next) => {
  // Khởi tạo trạng thái xác thực từ localStorage
  const authStore = useAuthStore()
  authStore.initAuth()

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  // Nếu route yêu cầu đăng nhập và người dùng chưa đăng nhập hoặc không phải là admin
  if (requiresAuth && (!authStore.isAuthenticated || !authStore.isAdmin)) {
    next('/login')
  }
  // Nếu đã đăng nhập và muốn vào trang login, chuyển hướng về trang chủ
  else if (to.path === '/login' && authStore.isAuthenticated && authStore.isAdmin) {
    next('/')
  }
  else {
    next()
  }
})

export default router
