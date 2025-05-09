<template>
  <div class="merchandise-table-container">
    <!-- Filter controls -->
    <div class="filter-section mb-4">
      <a-row :gutter="[16, 16]" align="middle" class="mb-3">
        <a-col :span="12" :md="8" :lg="6">
          <a-select
            v-model:value="selectedBrand"
            style="width: 100%"
            placeholder="Chọn thương hiệu"
            @change="handleFiltersChange"
          >
            <a-select-option value="all">Tất cả thương hiệu</a-select-option>
            <a-select-option v-for="brand in uniqueBrands" :key="brand.id" :value="brand.id">
              {{ brand.name }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :span="24" :md="8" :lg="6">
          <a-input-search
            v-model:value="searchKeyword"
            placeholder="Tìm kiếm theo tên, mã sản phẩm"
            @change="handleFiltersChange"
            @search="handleFiltersChange"
            allow-clear
          />
        </a-col>
        <a-col :span="24" :md="24" :lg="12" class="text-right">
          <a-tag v-if="filteredData.length">Hiển thị {{ filteredData.length }} mục</a-tag>
        </a-col>
      </a-row>
    </div>

    <!-- Table data -->
    <div class="merchandise-table-container">
      <a-table
        class="responsive-table"
        :columns="columns"
        :data-source="filteredData"
        :rowKey="(record) => record.id"
        :scroll="{ x: '100%', y: 600 }"
        :pagination="tablePagination"
        bordered
        size="middle"
        :loading="isLoading"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.key === 'data_sheet_link'">
            <a :href="text" target="_blank" v-if="text && text.trim() !== ''">
              <FilePdfOutlined style="font-size: 20px; color: #ff4d4f;" />
            </a>
            <span v-else>-</span>
          </template>
          <template v-else-if="column.key === 'data_json'">
            <a-button type="link" size="small" @click="showJsonModal(text)">Xem chi tiết</a-button>
          </template>
          <template v-else-if="column.key === 'created_at'">
            {{ formatDate(text) }}
          </template>
          <template v-else-if="column.key === 'active'">
            <a-tag :color="record.active ? 'green' : 'red'">
              {{ record.active ? 'Có' : 'Không' }}
            </a-tag>
          </template>
          <template v-else>
            {{ text }}
          </template>
        </template>
        <template #emptyText>
          <div class="empty-data">
            <p>Không có dữ liệu</p>
          </div>
        </template>
      </a-table>
    </div>

    <!-- Modal for JSON data -->
    <a-modal
      v-model:visible="jsonModalVisible"
      title="Thông tin tuỳ biến"
      :footer="null"
      width="700px"
    >
      <a-table
        :dataSource="jsonTableData"
        :columns="jsonColumns"
        :pagination="false"
        size="small"
        bordered
      />
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { message } from 'ant-design-vue'
import { FilePdfOutlined } from '@ant-design/icons-vue'
// const CONST_HOST = "http://localhost:8080"
const CONST_HOST = "https://id.slmsolar.com"

const props = defineProps({
    merchandises: {
        type: Array,
        required: false,
        default: () => []
    },
    defaultGroup: {
        type: String,
        required: false,
        default: 'all'
    }
})

// State variables
const localMerchandises = ref([])
const jsonModalVisible = ref(false)
const jsonTableData = ref([])
const isLoading = ref(false)
const searchKeyword = ref('')
const selectedGroup = ref(props.defaultGroup || 'all')
const selectedBrand = ref('all')

// Pagination config
const tablePagination = {
  pageSize: 10,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50', '100'],
  showTotal: (total) => `Tổng số ${total} mục`,
  position: ['bottomCenter'],
  className: 'centered-pagination'
}

// Unique brands list for filter
const uniqueBrands = computed(() => {
  const brands = localMerchandises.value
    .map(item => item.brand)
    .filter((brand, index, self) =>
      brand && self.findIndex(b => b && b.id === brand.id) === index
    )
    .sort((a, b) => a.name.localeCompare(b.name))

  return brands
})

// Filtered data based on selected filters
const filteredData = computed(() => {
  let filtered = [...localMerchandises.value]

  // Filter by group (based on defaultGroup prop)
  if (selectedGroup.value !== 'all') {
    filtered = filtered.filter(item =>
      item.template && item.template.code === selectedGroup.value
    )
  }

  // Filter by brand
  if (selectedBrand.value !== 'all') {
    filtered = filtered.filter(item =>
      item.brand && item.brand.id === selectedBrand.value
    )
  }

  // Filter by search keyword
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase().trim()
    filtered = filtered.filter(item =>
      (item.name && item.name.toLowerCase().includes(keyword)) ||
      (item.code && item.code.toLowerCase().includes(keyword))
    )
  }

  return filtered
})

// Columns for JSON data modal
const jsonColumns = [
  {
    title: 'Thuộc tính',
    dataIndex: 'key',
    key: 'key',
    width: '40%',
  },
  {
    title: 'Giá trị',
    dataIndex: 'value',
    key: 'value',
    width: '60%',
  }
]

// Format date for better display
const formatDate = (dateString) => {
  if (!dateString) return '-'

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString // Invalid date

    // Format: DD/MM/YYYY HH:MM
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    return `${day}/${month}/${year} ${hours}:${minutes}`
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
}

const showJsonModal = (jsonData) => {
  const parsedData = formatJsonData(jsonData)
  const tableData = Object.entries(parsedData).map(([key, value]) => {
    return {
      key: formatKey(key),
      value: Array.isArray(value) ? value.join(', ') : String(value || '-')
    }
  })

  jsonTableData.value = tableData
  jsonModalVisible.value = true
}

// Event handlers
const handleFiltersChange = () => {
  // This is a placeholder for any additional actions needed when filters change
  // Currently the computed property handles the filtering automatically
}

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 40,
    align: 'center',
  },
  {
    title: 'Tên sản phẩm',
    dataIndex: 'name',
    key: 'name',
    width: 250,
  },
  {
    title: 'Thương hiệu',
    dataIndex: ['brand', 'name'],
    key: 'brand',
    width: 100,
    align: 'center',
  },
  {
    title: 'Data sheet',
    dataIndex: 'data_sheet_link',
    key: 'data_sheet_link',
    width: 100,
    align: 'center',
  },
  {
    title: 'Đơn vị',
    dataIndex: 'unit',
    key: 'unit',
    width: 100,
    align: 'center',
  },
  {
    title: 'Mô tả trong hợp đồng',
    dataIndex: 'description_in_contract',
    key: 'description_in_contract',
    width: 330,
  },
  {
    title: 'Thông tin tuỳ biến',
    dataIndex: 'data_json',
    key: 'data_json',
    width: 120,
    align: 'center',
  },
  {
    title: 'Thời gian tạo',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 130,
    align: 'center',
  },
  {
    title: 'Active',
    dataIndex: 'active',
    key: 'active',
    width: 100,
    align: 'center',
  }
]

const formatJsonData = (jsonString) => {
  if (!jsonString) return {}

  try {
    let data = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString
    return data
  } catch (error) {
    console.error('Error parsing JSON:', error)
    return {}
  }
}

const formatKey = (key) => {
  if (!key) return ''

  // Convert snake_case or camelCase to user-friendly format
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

const loadMerchandises = async () => {
  isLoading.value = true
  try {
    const response = await fetch(`${CONST_HOST}/api/products`)
    if (response.ok) {
      const data = await response.json()
      localMerchandises.value = data || []
    } else {
      message.error('Tải danh sách vật tư thất bại')
    }
  } catch (error) {
    console.error('Error loading merchandises:', error)
    message.error('Có lỗi xảy ra khi tải dữ liệu')
  } finally {
    isLoading.value = false
  }
}

// Watch for changes in props
watch(
  () => props.merchandises,
  (newMerchandises) => {
    if (newMerchandises && newMerchandises.length > 0) {
      localMerchandises.value = newMerchandises
    } else {
      // loadMerchandises()
    }
  },
  { immediate: true }
)

watch(
  () => props.defaultGroup,
  (newDefaultGroup) => {
    if (newDefaultGroup) {
      selectedGroup.value = newDefaultGroup
    }
  }
)

onMounted(() => {
  // if (!props.merchandises || props.merchandises.length === 0) {
  //   loadMerchandises()
  // }
})
</script>

<style>
.excel-table-container {
    overflow-x: auto;
    /* Cuộn ngang nếu nội dung quá rộng */
    overflow-y: auto;
    /* Cuộn dọc nếu nội dung quá cao */
    max-height: 600px;
    /* Giới hạn chiều cao của bảng (có thể tùy chỉnh) */
    width: 100%;
    max-width: 100%;
    /* Chiếm toàn bộ chiều rộng */
    margin-bottom: 20px;
    border: 1px solid #ccc;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    position: relative;
    /* Đảm bảo header cố định hoạt động đúng */
}

.excel-table {
    border-collapse: collapse;
    width: 100%;
    /* Đảm bảo bảng chiếm toàn bộ chiều rộng container */
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 14px;
    table-layout: fixed;
}

thead {
    position: sticky;
    /* Giữ cố định header khi cuộn */
    top: 0;
    /* Cố định header ở đầu container */
    z-index: 2;
    /* Đảm bảo header nằm trên các nội dung khác */
    background-color: #378a21;
    /* Màu nền của header */
    color: white;
    /* Màu chữ của header */
}

.excel-header {
    position: sticky;
    top: 0;
    background-color: #378a21;
    color: white;
    text-align: left;
    padding: 8px;
    border: 1px solid #bbb;
    font-weight: bold;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    height: 32px;
    box-sizing: border-box;
    /* min-width: 50px;
    max-width: 300px; */
}

.excel-header:hover {
    background-color: #d9d9d9;
    color: #333;
}

.excel-cell {
    padding: 6px 8px;
    border: 1px solid #ddd;
    max-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    background-color: #fff;
    height: 28px;
    color: #333;
    box-sizing: border-box;
}

tr:nth-child(even) .excel-cell {
    background-color: #f9f9f9;
}

tr:hover .excel-cell {
    background-color: #f0f5fc;
}

.cell-content {
    overflow-x: hidden;
    white-space: nowrap;
    max-width: 100%;
    text-overflow: ellipsis;
}

.excel-resizer {
    position: absolute;
    top: 0;
    right: 0;
    width: 5px;
    height: 100%;
    cursor: col-resize;
    z-index: 1;
}

.excel-resizer:hover,
.resizing .excel-resizer {
    background-color: #0078d7;
}

.resizing {
    background-color: #e6f2ff !important;
    user-select: none;
}

.excel-table-container::-webkit-scrollbar {
    width: 8px;
    /* Độ rộng của scrollbar */
    height: 8px;
    /* Độ cao của scrollbar ngang */
}

.excel-table thead {
    border-bottom: 2px solid #a9a9a9;
}

/* Add freezing header */
thead {
    position: sticky;
    top: 0;
    z-index: 2;
}

/* Add scrollbar styling */
.excel-table-container::-webkit-scrollbar {
    height: 10px;
    width: 10px;
    background: #f1f1f1;
}

.excel-table-container::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.excel-table-container::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 5px;
}

.excel-table-container::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

/* Add Excel-like selected state */
.excel-cell.selected {
    background-color: #e0ecff !important;
    border: 1px solid #0078d7;
}
</style>

<style scoped>
.merchandise-filter-container {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.merchandise-table-container {
  width: 100%;
  overflow-x: auto;
}

.responsive-table {
  min-width: 800px;
}

.filter-group {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-section {
  background-color: #fff;
  padding: 12px 16px;
  margin-bottom: 16px;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  width: 100% !important;
  max-width: 100% !important;
}

:deep(.ant-row) {
  width: 100% !important;
  max-width: 100% !important;
}

:deep(.ant-col) {
  width: 100% !important;
  max-width: 100% !important;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
  width: 100%;
}

.filter-item {
  flex: 1;
  min-width: 180px;
}

.table-section {
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  width: 100%;
}

/* Table styles */
:deep(.ant-table-thead > tr > th) {
  background-color: #f0f0f0;
  font-weight: 600;
  padding: 10px 16px;
  text-align: center;
}

:deep(.ant-table-tbody > tr > td) {
  padding: 10px 16px;
}

:deep(.ant-table-tbody > tr:hover > td) {
  background-color: #f5f5f5;
}

/* Modal styles */
.json-modal {
  width: 80%;
  max-width: 1000px;
}

.json-content {
  max-height: 70vh;
  overflow-y: auto;
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

/* Data cell content can wrap */
:deep(.ant-table-cell) {
  white-space: normal;
  word-break: break-word;
}

/* Force full width on the table header */
:deep(.ant-table-header) {
  width: 100% !important;
}

:deep(.ant-table-body) {
  width: 100% !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .filter-item {
    min-width: 100%;
  }

  .filter-row {
    gap: 8px;
    margin-bottom: 8px;
  }

  .json-modal {
    width: 95%;
  }
}

.group-title {
  margin: 0;
  padding: 8px 0;
  color: #1890ff;
  font-size: 18px;
  font-weight: 500;
  border-bottom: 1px solid #f0f0f0;
}

.empty-data {
  padding: 24px;
  text-align: center;
  color: rgba(0, 0, 0, 0.45);
}

.text-right {
  text-align: right;
}

@media (max-width: 768px) {
  .text-right {
    text-align: left;
  }
}

/* Centered pagination */
:deep(.centered-pagination) {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 16px 0;
}

:deep(.ant-pagination) {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 16px;
}

:deep(.ant-pagination-options) {
  margin-left: 16px;
}
</style>
