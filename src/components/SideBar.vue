<template>
  <div
    class="h-full flex flex-col bg-[#1F2937] w-full sidebar-container"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div class="py-6 px-4 border-b border-gray-700 w-full logo-container">
      <img
        v-if="!localCollapsed"
        src="@/assets/slm-logo-white.png"
        alt="SLM Logo"
        class="logo-full"
      />
      <img
        v-else
        src="@/assets/slm-logo-white.png"
        alt="SLM Logo"
        class="logo-small"
      />
    </div>
    <a-menu
      mode="inline"
      theme="dark"
      class="flex-1 custom-dark-menu w-full"
      :selectedKeys="[route.name]"
      :inline-collapsed="localCollapsed"
    >
      <a-menu-item key="dashboard" class="w-full">
        <template #icon><DashboardOutlined /></template>
        <span>Tổng quan</span>
      </a-menu-item>

      <a-sub-menu key="products" class="w-full">
        <template #icon><ShoppingOutlined /></template>
        <template #title>Quản lý sản phẩm</template>
        <a-menu-item key="add-pin-pv" class="w-full">
          <template #icon><PlusOutlined /></template>
          <router-link to="/add-pin-pv" class="w-full block">
            <span>Thêm tấm pin PV</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="add-inverter" class="w-full">
          <template #icon><PlusOutlined /></template>
          <router-link to="/add-inverter" class="w-full block">
            <span>Thêm biến tần</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="add-battery" class="w-full">
          <template #icon><PlusOutlined /></template>
          <router-link to="/add-battery" class="w-full block">
            <span>Thêm pin lưu trữ</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="add-aluminum-frame" class="w-full">
          <template #icon><PlusOutlined /></template>
          <router-link to="/add-aluminum-frame" class="w-full block">
            <span>Thêm hệ khung nhôm</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="add-cable" class="w-full">
          <template #icon><PlusOutlined /></template>
          <router-link to="/add-cable" class="w-full block">
            <span>Thêm dây điện</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="add-cabinet" class="w-full">
          <template #icon><PlusOutlined /></template>
          <router-link to="/add-cabinet" class="w-full block">
            <span>Thêm tủ điện</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="add-grounding-system" class="w-full">
          <template #icon><PlusOutlined /></template>
          <router-link to="/add-grounding-system" class="w-full block">
            <span>Thêm hệ tiếp địa</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="add-installation" class="w-full">
          <template #icon><PlusOutlined /></template>
          <router-link to="/add-installation" class="w-full block">
            <span>Thêm gói lắp đặt</span>
          </router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="contracts" class="w-full">
        <template #icon><FileTextOutlined /></template>
        <template #title>Quản lý hợp đồng</template>
        <a-menu-item key="combo-create" class="w-full">
          <template #icon><AppstoreAddOutlined /></template>
          <router-link to="/combo-create" class="w-full block">
            <span>Tạo Combo</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="contract-create" class="w-full">
          <template #icon><FileAddOutlined /></template>
          <router-link to="/contract-create" class="w-full block">
            <span>Tạo Hợp đồng mới</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="contract-create-old" class="w-full">
          <template #icon><FileOutlined /></template>
          <router-link to="/contract-create-old" class="w-full block">
            <span>Tạo Hợp đồng cũ</span>
          </router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-menu-item key="add-content" class="w-full">
        <template #icon><EditOutlined /></template>
        <router-link to="/add-content" class="w-full block">
          <span>Tạo nội dung</span>
        </router-link>
      </a-menu-item>

      <a-menu-item key="notifications" class="w-full">
        <template #icon><NotificationOutlined /></template>
        <span>Quản lý thông báo</span>
      </a-menu-item>

      <a-menu-item key="file-manager" class="w-full">
        <template #icon><FolderOutlined /></template>
        <span>Quản lý tệp và thư mục</span>
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import {
  DashboardOutlined,
  ShoppingOutlined,
  NotificationOutlined,
  FolderOutlined,
  PlusOutlined,
  AppstoreAddOutlined,
  FileAddOutlined,
  FileOutlined,
  EditOutlined,
  FileTextOutlined
} from '@ant-design/icons-vue'

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:collapsed'])

const route = useRoute()
const localCollapsed = ref(props.collapsed)

// Sync localCollapsed with props.collapsed
watch(() => props.collapsed, (newValue) => {
  localCollapsed.value = newValue
})

// Sync props.collapsed with localCollapsed
watch(localCollapsed, (newValue) => {
  emit('update:collapsed', newValue)
})

const onMouseEnter = () => {
  // Mở sidebar ngay lập tức khi hover
  localCollapsed.value = false
}

const onMouseLeave = () => {
  // Đóng sidebar ngay lập tức khi rời khỏi
  localCollapsed.value = true
}
</script>

<style scoped>
.sidebar-container {
  transition: width 0.2s ease;
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80px;
}

.logo-full {
  max-width: 100%;
  height: auto;
  max-height: 35px;
}

.logo-small {
  max-width: 100%;
  height: auto;
  max-height: 25px;
}

.custom-dark-menu {
  background-color: #1F2937;
  border-right: none !important;
  width: 100% !important;
  transition: all 0.3s ease;
}

.custom-dark-menu :deep(.ant-menu-item) {
  margin: 4px 0 !important;
  height: 40px !important;
  line-height: 40px !important;
  border-radius: 6px;
  margin: 0 8px !important;
  width: calc(100% - 16px) !important;
}

.custom-dark-menu :deep(.ant-menu-submenu-title) {
  height: 40px !important;
  line-height: 40px !important;
  border-radius: 6px;
  margin: 4px 8px !important;
  width: calc(100% - 16px) !important;
}

.custom-dark-menu :deep(.ant-menu-item-selected) {
  background-color: #374151 !important;
}

.custom-dark-menu :deep(.ant-menu-item:hover),
.custom-dark-menu :deep(.ant-menu-submenu-title:hover) {
  background-color: #374151 !important;
}

.custom-dark-menu :deep(.ant-menu-submenu-arrow) {
  color: #9CA3AF !important;
}

.custom-dark-menu :deep(.ant-menu-item),
.custom-dark-menu :deep(.ant-menu-submenu-title) {
  color: #9CA3AF !important;
}

.custom-dark-menu :deep(.ant-menu-item-selected),
.custom-dark-menu :deep(.ant-menu-item-active),
.custom-dark-menu :deep(.ant-menu-submenu-active) {
  color: #F3F4F6 !important;
}

.custom-dark-menu :deep(.anticon) {
  color: #9CA3AF !important;
}

.custom-dark-menu :deep(.ant-menu-item-selected .anticon),
.custom-dark-menu :deep(.ant-menu-item-active .anticon),
.custom-dark-menu :deep(.ant-menu-submenu-active .anticon) {
  color: #F3F4F6 !important;
}

.custom-dark-menu :deep(.ant-menu-item a) {
  color: inherit;
  text-decoration: none;
  width: 100%;
  display: block;
}

.custom-dark-menu :deep(.ant-menu-item-selected a) {
  color: #F3F4F6 !important;
}

.custom-dark-menu :deep(.ant-menu-sub) {
  width: 100% !important;
  background-color: #1F2937 !important;
}
</style>
