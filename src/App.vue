<script setup>
import { RouterView, useRoute, useRouter } from 'vue-router'
import SideBar from './components/SideBar.vue';
import BreadcrumbNav from './components/BreadcrumbNav.vue';
import { ref, computed } from 'vue'
import { useAuthStore } from './stores/auth'

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const collapsed = ref(false)

const onCollapse = (val) => {
  collapsed.value = val
}

const showSidebar = computed(() => {
  return route.name !== 'policy-and-privacy' && route.name !== 'login' && authStore.isAuthenticated && authStore.isAdmin
})

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const shouldShowBreadcrumb = computed(() => {
  return route.name !== 'login' && authStore.isAuthenticated
})

// Tiêu đề trang
const pageTitles = {
  'home': 'Tổng quan',
  'add-pin-pv': 'Thêm tấm pin PV',
  'add-inverter': 'Thêm biến tần',
  'add-battery': 'Thêm pin lưu trữ',
  'add-aluminum-frame': 'Thêm hệ khung nhôm',
  'add-cable': 'Thêm dây điện',
  'add-cabinet': 'Thêm tủ điện',
  'add-grounding-system': 'Thêm hệ tiếp địa',
  'add-installation': 'Thêm gói lắp đặt',
  'combo-create': 'Tạo Combo',
  'contract-create': 'Tạo Hợp đồng mới',
  'contract-create-old': 'Tạo Hợp đồng cũ',
  'add-content': 'Tạo nội dung',
  'policy-and-privacy': 'Chính sách và quyền riêng tư'
}

const pageTitle = computed(() => {
  return pageTitles[route.name] || ''
})
</script>

<template>
  <a-layout class="min-h-screen w-full" style="padding: 0;">
    <a-layout-sider
      v-if="showSidebar"
      :width="250"
      :collapsed="collapsed"
      @collapse="onCollapse"
      collapsible
      class="fixed h-full z-10"
      style="left: 0; top: 0;"
    >
      <SideBar :collapsed="collapsed" @update:collapsed="onCollapse" />
    </a-layout-sider>

    <a-layout class="w-full" :style="{ marginLeft: showSidebar ? (collapsed ? '80px' : '250px') : '0', padding: 0 }">
      <!-- Header with page title -->
      <a-layout-header
        v-if="authStore.isAuthenticated"
        class="bg-white px-5 shadow-md sticky top-0 z-5 w-full"
        style="padding-left: 16px; padding-right: 16px;"
      >
        <div class="w-full flex justify-between items-center">
          <div class="text-lg font-semibold">
            {{ pageTitle }}
          </div>
        </div>
      </a-layout-header>

      <!-- Breadcrumb navigation with user info and logout -->
      <div class="breadcrumb-bar" v-if="shouldShowBreadcrumb">
        <div class="breadcrumb-container">
          <BreadcrumbNav />
        </div>
        <div class="user-controls">
          <span v-if="authStore.user" class="user-greeting">Xin chào, {{ authStore.user.name }}</span>
          <a-button type="primary" danger size="middle" @click="logout">
            Đăng xuất
          </a-button>
        </div>
      </div>

      <a-layout-content class="bg-[#f0f2f5] min-h-[calc(100vh-64px-48px)] w-full overflow-x-hidden">
        <div class="w-full max-w-full mx-auto px-4 py-4">
          <RouterView />
        </div>
      </a-layout-content>

      <a-layout-footer v-if="authStore.isAuthenticated" class="bg-white text-center py-3 w-full" style="padding-left: 0; padding-right: 0;">
        SLM Solar Admin © {{ new Date().getFullYear() }}
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<style>
/* Global styles */
body {
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden;
}

#app {
  width: 100%;
}

.ant-layout {
  width: 100% !important;
  max-width: 100% !important;
  padding: 0 !important;
}

.ant-layout-content {
  width: 100% !important;
  max-width: 100% !important;
  padding: 0 !important;
}

.ant-layout-content > div {
  width: 100% !important;
  max-width: 100% !important;
}

.ant-layout-sider {
  padding: 0 !important;
}

.ant-layout-header {
  padding-left: 16px !important;
  padding-right: 16px !important;
  height: 64px !important;
}

.ant-layout-footer {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

/* Breadcrumb and user info styles */
.breadcrumb-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: white;
  border-bottom: 1px solid #e8e8e8;
  width: 100%;
  box-sizing: border-box;
}

.breadcrumb-container {
  flex: 1;
  overflow-x: auto;
  min-width: 0; /* Để breadcrumb co lại khi cần */
  padding-right: 8px;
}

.user-controls {
  display: flex;
  align-items: center;
  white-space: nowrap;
  margin-left: 12px;
  flex-shrink: 0; /* Ngăn user controls co lại */
}

.user-greeting {
  margin-right: 12px;
}

@media (max-width: 640px) {
  .user-greeting {
    display: none;
  }
}
</style>
