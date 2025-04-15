import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/add-pin-pv',
      name: 'add-pin-pv',
      component: () => import('../views/AddPinPv.vue'),
    },
    {
      path: '/add-inverter',
      name: 'add-inverter',
      component: () => import('../views/AddInverter.vue'),
    },
    {
      path: '/add-battery',
      name: 'add-battery',
      component: () => import('../views/AddBattery.vue'),
    },
    {
      path: '/add-aluminum-frame',
      name: 'add-aluminum-frame',
      component: () => import('../views/AddAluminumFrame.vue'),
    },
    {
      path: '/add-cable',
      name: 'add-cable',
      component: () => import('../views/AddCable.vue'),
    },
    {
      path: '/add-cabinet',
      name: 'add-cabinet',
      component: () => import('../views/AddCabinet.vue'),
    },
    {
      path: '/add-grounding-system',
      name: 'add-grounding-system',
      component: () => import('../views/AddGroundingSystem.vue'),
    },
    {
      path: '/add-installation',
      name: 'add-installation',
      component: () => import('../views/AddInstallation.vue'),
    },
    {
      path: '/combo-create',
      name: 'combo-create',
      component: () => import('../views/ComboCreate.vue'),
    },
    {
      path: '/contract-create',
      name: 'contract-create',
      component: () => import('../views/ContractCreate.vue'),
    },
    {
      path: '/contract-create-old',
      name: 'contract-create-old',
      component: () => import('../views/ContractCreateOld.vue'),
    },
    {
      path: '/add-content',
      name: 'add-content',
      component: () => import('../views/AddContent.vue'),
    },
    {
      path: '/policy-and-privacy',
      name: 'policy-and-privacy',
      component: () => import('../views/PolicyAndPrivacy.vue'),
    },
  ],
})

export default router
