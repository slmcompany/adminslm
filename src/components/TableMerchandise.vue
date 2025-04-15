<template>
  <a-table
    :columns="columns"
    :data-source="localMerchandises"
    :scroll="{ x: 1500, y: 600 }"
    :pagination="false"
    bordered
    size="middle"
  >
    <template #bodyCell="{ column, text }">
      <template v-if="column.key === 'data_sheet_link'">
        <a :href="text" target="_blank" v-if="text && text.trim() !== ''">Click để xem</a>
        <span v-else>-</span>
      </template>
      <template v-else-if="column.key === 'data_json'">
        <a-button type="link" size="small" @click="showJsonModal(text)">Xem chi tiết</a-button>
      </template>
      <template v-else-if="column.key === 'created_at'">
        {{ formatDate(text) }}
      </template>
      <template v-else>
        {{ text }}
      </template>
    </template>
  </a-table>

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
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { message } from 'ant-design-vue'
// const CONST_HOST = "http://localhost:8080"
const CONST_HOST = "https://id.slmsolar.com"
const props = defineProps({
    merchandises: {
        type: Array,
        required: false,
        default: () => []
    }
})

const localMerchandises = ref([])
const jsonModalVisible = ref(false)
const jsonTableData = ref([])

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

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: 'Nhóm vật tư',
    dataIndex: ['template', 'name'],
    key: 'template',
    width: 150,
  },
  {
    title: 'Thương hiệu',
    dataIndex: ['brand', 'name'],
    key: 'brand',
    width: 150,
  },
  {
    title: 'Nhà cung cấp',
    dataIndex: ['supplier', 'name'],
    key: 'supplier',
    width: 150,
  },
  {
    title: 'Mã sản phẩm',
    dataIndex: 'code',
    key: 'code',
    width: 150,
  },
  {
    title: 'Tên sản phẩm',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: 'Link thông tin',
    dataIndex: 'data_sheet_link',
    key: 'data_sheet_link',
    width: 120,
    align: 'center',
  },
  {
    title: 'Đơn vị',
    dataIndex: 'unit',
    key: 'unit',
    width: 100,
  },
  {
    title: 'Mô tả trong hợp đồng',
    dataIndex: 'description_in_contract',
    key: 'description_in_contract',
    width: 250,
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
    try {
        const response = await fetch(`${CONST_HOST}/api/json/merchandises`, {
            method: 'GET',
            credentials: 'include',
        })
        if (response.ok) {
            const data = await response.json()
            localMerchandises.value = data.items || []
            console.log('Merchandises loaded successfully:', data)
        } else {
            message.error('Failed to load merchandises')
        }
    } catch (error) {
        console.error('Error loading merchandises:', error)
        message.error('Error loading merchandises')
    }
}

watch(
    () => props.merchandises,
    (newMerchandises) => {
        if (newMerchandises && newMerchandises.length > 0) {
            localMerchandises.value = newMerchandises
        } else {
            loadMerchandises()
        }
    },
    { immediate: true }
)

onMounted(() => {
    if (!props.merchandises || props.merchandises.length === 0) {
        loadMerchandises()
    }
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
