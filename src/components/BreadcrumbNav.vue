<template>
  <div class="breadcrumb-container">
    <a-breadcrumb class="my-2 flex items-center flex-wrap">
      <a-breadcrumb-item>
        <router-link to="/" class="breadcrumb-link">
          <span>Trang chủ</span>
        </router-link>
      </a-breadcrumb-item>
      <template v-for="(item, index) in breadcrumbItems" :key="item.path || index">
        <a-breadcrumb-item>
          <router-link
            v-if="item.path"
            :to="item.path"
            class="breadcrumb-link"
          >
            <span :class="{ 'text-primary': index === breadcrumbItems.length - 1 }">{{ item.title }}</span>
          </router-link>
          <span v-else class="breadcrumb-text">
            {{ item.title }}
          </span>
        </a-breadcrumb-item>
      </template>
    </a-breadcrumb>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Định nghĩa cấu trúc breadcrumb cho mỗi route
const routeMap = {
  'home': [
    { title: 'Tổng quan', path: '/' }
  ],
  'add-pin-pv': [
    { title: 'Quản lý sản phẩm', path: null },
    { title: 'Thêm tấm pin PV', path: '/add-pin-pv' }
  ],
  'add-inverter': [
    { title: 'Quản lý sản phẩm', path: null },
    { title: 'Thêm biến tần', path: '/add-inverter' }
  ],
  'add-battery': [
    { title: 'Quản lý sản phẩm', path: null },
    { title: 'Thêm pin lưu trữ', path: '/add-battery' }
  ],
  'add-aluminum-frame': [
    { title: 'Quản lý sản phẩm', path: null },
    { title: 'Thêm hệ khung nhôm', path: '/add-aluminum-frame' }
  ],
  'add-cable': [
    { title: 'Quản lý sản phẩm', path: null },
    { title: 'Thêm dây điện', path: '/add-cable' }
  ],
  'add-cabinet': [
    { title: 'Quản lý sản phẩm', path: null },
    { title: 'Thêm tủ điện', path: '/add-cabinet' }
  ],
  'add-grounding-system': [
    { title: 'Quản lý sản phẩm', path: null },
    { title: 'Thêm hệ tiếp địa', path: '/add-grounding-system' }
  ],
  'add-installation': [
    { title: 'Quản lý sản phẩm', path: null },
    { title: 'Thêm gói lắp đặt', path: '/add-installation' }
  ],
  'combo-create': [
    { title: 'Quản lý hợp đồng', path: null },
    { title: 'Tạo Combo', path: '/combo-create' }
  ],
  'contract-create': [
    { title: 'Quản lý hợp đồng', path: null },
    { title: 'Tạo Hợp đồng mới', path: '/contract-create' }
  ],
  'contract-create-old': [
    { title: 'Quản lý hợp đồng', path: null },
    { title: 'Tạo Hợp đồng cũ', path: '/contract-create-old' }
  ],
  'add-content': [
    { title: 'Tạo nội dung', path: '/add-content' }
  ],
  'policy-and-privacy': [
    { title: 'Chính sách và quyền riêng tư', path: '/policy-and-privacy' }
  ]
}

const breadcrumbItems = computed(() => {
  const routeName = route.name
  return routeMap[routeName] || []
})
</script>

<style scoped>
.breadcrumb-container {
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none; /* Firefox */
  padding: 4px 0;
  -webkit-overflow-scrolling: touch; /* iOS */
}

.breadcrumb-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}

.breadcrumb-link {
  color: rgba(0, 0, 0, 0.65);
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  padding: 2px 0;
}

.breadcrumb-text {
  color: rgba(0, 0, 0, 0.45);
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  padding: 2px 0;
}

/* CSS để căn chỉnh icon */
:deep(.anticon) {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  position: relative;
  top: -1px;
}

.breadcrumb-link:hover {
  color: #ff4d4f;
}

.text-primary {
  color: #ff4d4f;
  font-weight: 500;
}

/* Điều chỉnh kiểu của Ant Design Breadcrumb */
:deep(.ant-breadcrumb) {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  width: 100%;
}

:deep(.ant-breadcrumb-separator) {
  margin: 0 12px;
  flex-shrink: 0;
  color: rgba(0, 0, 0, 0.3);
}

:deep(.ant-breadcrumb ol) {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
}

:deep(.ant-breadcrumb-item) {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  flex-shrink: 0;
}
</style>
