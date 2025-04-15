<template>
  <div class="breadcrumb-container">
    <a-breadcrumb class="my-2 flex items-center flex-wrap">
      <a-breadcrumb-item>
        <router-link to="/" class="breadcrumb-link">
          <home-outlined class="mr-1" />
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
            <component :is="item.icon" class="mr-1" v-if="item.icon" />
            <span :class="{ 'text-primary': index === breadcrumbItems.length - 1 }">{{ item.title }}</span>
          </router-link>
          <span v-else class="breadcrumb-text">
            <component :is="item.icon" class="mr-1" v-if="item.icon" />
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
import {
  HomeOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  EditOutlined,
  SettingOutlined,
  PlusOutlined,
  DashboardOutlined,
  AppstoreAddOutlined,
  FileAddOutlined,
  FileOutlined
} from '@ant-design/icons-vue'

const route = useRoute()

// Định nghĩa cấu trúc breadcrumb cho mỗi route
const routeMap = {
  'home': [
    { title: 'Tổng quan', path: '/', icon: DashboardOutlined }
  ],
  'add-pin-pv': [
    { title: 'Quản lý sản phẩm', path: null, icon: ShoppingOutlined },
    { title: 'Thêm tấm pin PV', path: '/add-pin-pv', icon: PlusOutlined }
  ],
  'add-inverter': [
    { title: 'Quản lý sản phẩm', path: null, icon: ShoppingOutlined },
    { title: 'Thêm biến tần', path: '/add-inverter', icon: PlusOutlined }
  ],
  'add-battery': [
    { title: 'Quản lý sản phẩm', path: null, icon: ShoppingOutlined },
    { title: 'Thêm pin lưu trữ', path: '/add-battery', icon: PlusOutlined }
  ],
  'add-aluminum-frame': [
    { title: 'Quản lý sản phẩm', path: null, icon: ShoppingOutlined },
    { title: 'Thêm hệ khung nhôm', path: '/add-aluminum-frame', icon: PlusOutlined }
  ],
  'add-cable': [
    { title: 'Quản lý sản phẩm', path: null, icon: ShoppingOutlined },
    { title: 'Thêm dây điện', path: '/add-cable', icon: PlusOutlined }
  ],
  'add-cabinet': [
    { title: 'Quản lý sản phẩm', path: null, icon: ShoppingOutlined },
    { title: 'Thêm tủ điện', path: '/add-cabinet', icon: PlusOutlined }
  ],
  'add-grounding-system': [
    { title: 'Quản lý sản phẩm', path: null, icon: ShoppingOutlined },
    { title: 'Thêm hệ tiếp địa', path: '/add-grounding-system', icon: PlusOutlined }
  ],
  'add-installation': [
    { title: 'Quản lý sản phẩm', path: null, icon: ShoppingOutlined },
    { title: 'Thêm gói lắp đặt', path: '/add-installation', icon: PlusOutlined }
  ],
  'combo-create': [
    { title: 'Quản lý hợp đồng', path: null, icon: FileTextOutlined },
    { title: 'Tạo Combo', path: '/combo-create', icon: AppstoreAddOutlined }
  ],
  'contract-create': [
    { title: 'Quản lý hợp đồng', path: null, icon: FileTextOutlined },
    { title: 'Tạo Hợp đồng mới', path: '/contract-create', icon: FileAddOutlined }
  ],
  'contract-create-old': [
    { title: 'Quản lý hợp đồng', path: null, icon: FileTextOutlined },
    { title: 'Tạo Hợp đồng cũ', path: '/contract-create-old', icon: FileOutlined }
  ],
  'add-content': [
    { title: 'Tạo nội dung', path: '/add-content', icon: EditOutlined }
  ],
  'policy-and-privacy': [
    { title: 'Chính sách và quyền riêng tư', path: '/policy-and-privacy', icon: SettingOutlined }
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

.breadcrumb-link:hover {
  color: #1890ff;
}

.text-primary {
  color: #1890ff;
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
  margin: 0 8px;
  flex-shrink: 0;
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
