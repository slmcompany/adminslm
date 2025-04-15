<script setup>
import { RouterView, useRoute, useRouter } from 'vue-router'
import SideBar from './components/SideBar.vue';
import BreadcrumbNav from './components/BreadcrumbNav.vue';
import { ref, computed } from 'vue'
import { useAuthStore } from './stores/auth'

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const collapsed = ref(true)

const onCollapse = (val) => {
  // Chỉ cập nhật trạng thái nếu được gọi từ SideBar component
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
</script>

<template>
  <div class="app-root">
    <a-layout class="layout-container">
      <a-layout-sider
        v-if="showSidebar"
        :width="250"
        :collapsed="collapsed"
        @collapse="onCollapse"
        class="sidebar"
        :style="{
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          zIndex: 1000,
          overflow: 'auto'
        }"
      >
        <SideBar :collapsed="collapsed" @update:collapsed="onCollapse" />
      </a-layout-sider>

      <a-layout class="main-layout" :style="{
          marginLeft: showSidebar ? (collapsed ? '80px' : '250px') : '0'
        }">
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

        <a-layout-content class="content-container">
          <div class="content-wrapper">
            <RouterView />
          </div>
        </a-layout-content>

        <a-layout-footer class="footer-container">
          SLM Solar Admin © {{ new Date().getFullYear() }}
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </div>
</template>

<style>
/* Reset and basic setup */
* {
  box-sizing: border-box;
}

body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden;
}

#app {
  width: 100%;
  overflow-x: hidden;
}

/* Layout structure */
.app-root {
  display: flex;
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
}

.layout-container {
  width: 100%;
  min-height: 100vh;
}

.sidebar {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.2s;
}

.main-layout {
  width: 100%;
  min-height: 100vh;
  transition: margin-left 0.2s ease;
  overflow-x: hidden;
}

/* Header styling */
.header-container {
  background-color: white;
  padding: 0 16px;
  height: 64px;
  line-height: 64px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 999;
  width: 100%;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
}

/* Breadcrumb styling */
.breadcrumb-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: white;
  border-bottom: 1px solid #e8e8e8;
  width: 100%;
}

.breadcrumb-container {
  flex: 1;
  overflow-x: auto;
  min-width: 0;
  padding-right: 8px;
}

.user-controls {
  display: flex;
  align-items: center;
  white-space: nowrap;
  margin-left: 16px;
  flex-shrink: 0;
}

.user-greeting {
  margin-right: 12px;
}

/* Content styling */
.content-container {
  background-color: #f0f2f5;
  padding: 16px;
  min-height: calc(100vh - 48px - 48px);
  width: 100%;
  overflow-x: hidden;
}

.content-wrapper {
  width: 100%;
  background-color: transparent;
}

/* Footer styling */
.footer-container {
  background-color: white;
  text-align: center;
  padding: 12px 0;
  height: 48px;
}

/* Make sure tables and cards use full width */
:deep(.ant-card),
:deep(.ant-card-body),
:deep(.ant-table-wrapper) {
  width: 100%;
  max-width: 100%;
}

:deep(.ant-row) {
  width: 100%;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .user-greeting {
    display: none;
  }
}
</style>
