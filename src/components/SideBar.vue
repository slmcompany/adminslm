<template>
  <div class="h-full flex flex-col bg-[#1F2937] w-full">
    <div class="p-4 border-b border-gray-700 w-full">
      <h2 class="text-2xl font-bold text-[#FF0000]" v-if="!collapsed">SLM</h2>
      <h2 class="text-2xl font-bold text-[#FF0000]" v-else>S</h2>
    </div>
    <a-menu
      mode="inline"
      theme="dark"
      class="flex-1 custom-dark-menu w-full"
      :selectedKeys="[route.name]"
      :inline-collapsed="collapsed"
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
    <div class="p-4 border-t border-gray-700 w-full">
      <a-button type="text" @click="$emit('update:collapsed', !collapsed)" class="w-full text-gray-400 hover:text-white">
        <template #icon>
          <MenuFoldOutlined v-if="!collapsed" />
          <MenuUnfoldOutlined v-else />
        </template>
        <span v-if="!collapsed">Thu gọn menu</span>
      </a-button>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
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
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileTextOutlined
} from '@ant-design/icons-vue'

defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:collapsed'])

const route = useRoute()
</script>

<style scoped>
.custom-dark-menu {
  background-color: #1F2937;
  border-right: none !important;
  width: 100% !important;
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
