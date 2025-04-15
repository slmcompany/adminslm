<script setup>
import { RouterView, useRoute } from 'vue-router'
import SideBar from './components/SideBar.vue';
import { ref, computed } from 'vue'

const route = useRoute();
const collapsed = ref(false)

const onCollapse = (val) => {
  collapsed.value = val
}

const showSidebar = computed(() => {
  return route.name !== 'policy-and-privacy'
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
      <a-layout-header class="bg-white px-5 shadow-md sticky top-0 z-5 w-full" style="padding-left: 16px; padding-right: 16px;">
        <!-- Header content can be added here -->
      </a-layout-header>

      <a-layout-content class="bg-[#f0f2f5] min-h-[calc(100vh-64px-70px)] w-full">
        <div class="w-full max-w-full mx-auto">
          <RouterView />
        </div>
      </a-layout-content>

      <a-layout-footer class="bg-white text-center py-4 w-full" style="padding-left: 0; padding-right: 0;">
        <!-- Footer content can be added here -->
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
}

.ant-layout-footer {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

/* Remove all custom CSS as we're using Tailwind now */
</style>
