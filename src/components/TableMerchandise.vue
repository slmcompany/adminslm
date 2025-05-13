<template>
  <div class="merchandise-table-container">
    <!-- Filter controls -->
    <div class="filter-section mb-4">
      <a-row :gutter="[16, 16]" align="middle" class="mb-3">
        <a-col :span="12" :md="8" :lg="6">
          <a-select v-model:value="selectedBrand" style="width: 100%" placeholder="Chọn thương hiệu"
            @change="handleFiltersChange">
            <a-select-option value="all">Tất cả thương hiệu</a-select-option>
            <a-select-option v-for="brand in uniqueBrands" :key="brand.id" :value="brand.id">
              {{ brand.name }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :span="24" :md="8" :lg="6">
          <a-input-search v-model:value="searchKeyword" placeholder="Tìm kiếm theo tên, mã sản phẩm"
            @change="handleFiltersChange" @search="handleFiltersChange" allow-clear />
        </a-col>
        <a-col :span="24" :md="24" :lg="12" class="text-right">
          <a-tag v-if="filteredData.length">Hiển thị {{ filteredData.length }} mục</a-tag>
        </a-col>
      </a-row>
    </div>

    <!-- Table data -->
    <div class="merchandise-table-container">
      <a-table class="responsive-table" :columns="columns" :data-source="filteredData" :rowKey="(record) => record.id"
        :scroll="{ x: '100%', y: 600 }" :pagination="tablePagination" bordered size="middle" :loading="isLoading"
        @change="handleTableChange">
        <template #bodyCell="{ column, text, record, index }">
          <!-- Name column -->
          <template v-if="column.key === 'name'">
            <div v-if="editingRow === record.id">
              <a-input v-model:value="editingData.name" />
            </div>
            <template v-else>{{ text }}</template>
          </template>

          <!-- Data sheet link column -->
          <template v-else-if="column.key === 'data_sheet_link'">
            <div v-if="editingRow === record.id">
              <a-input v-model:value="editingData.data_sheet_link" />
            </div>
            <template v-else>
              <a :href="text" target="_blank" v-if="text && text.trim() !== ''">
                <FilePdfOutlined style="font-size: 20px; color: #ff4d4f;" />
              </a>
              <span v-else>-</span>
            </template>
          </template>

          <!-- Unit column -->
          <template v-else-if="column.key === 'unit'">
            <div v-if="editingRow === record.id">
              <a-input v-model:value="editingData.unit" />
            </div>
            <template v-else>{{ text }}</template>
          </template>

          <!-- Description in contract column -->
          <template v-else-if="column.key === 'description_in_contract'">
            <div v-if="editingRow === record.id">
              <a-textarea v-model:value="editingData.description_in_contract" :auto-size="{ minRows: 2, maxRows: 6 }" />
            </div>
            <template v-else>{{ text }}</template>
          </template>

          <!-- Description in quotation column -->
          <template v-else-if="column.key === 'description_in_quotation'">
            <div v-if="editingRow === record.id">
              <a-textarea v-model:value="editingData.description_in_quotation"
                :auto-size="{ minRows: 2, maxRows: 6 }" />
            </div>
            <template v-else>{{ text }}</template>
          </template>

          <!-- Custom data column -->
          <template v-else-if="column.key === 'data_json'">
            <a-button type="link" size="small" @click="showJsonModal(record)">Xem chi tiết</a-button>
          </template>

          <!-- Created at column -->
          <template v-else-if="column.key === 'created_at'">
            {{ formatDate(text) }}
          </template>

          <!-- Active status column -->
          <template v-else-if="column.key === 'active'">
            <div v-if="editingRow === record.id">
              <a-switch v-model:checked="editingData.active" :checked-children="'Có'" :un-checked-children="'Không'" />
            </div>
            <template v-else>
              <a-tag :color="record.active ? 'green' : 'red'">
                {{ record.active ? 'Có' : 'Không' }}
              </a-tag>
            </template>
          </template>

          <!-- Actions column -->
          <template v-else-if="column.key === 'actions'">
            <template v-if="editingRow === record.id">
              <a-space>
                <a-button type="primary" size="small" @click="saveChanges(record.id)">
                  <SaveOutlined /> Lưu
                </a-button>
                <a-button size="small" @click="cancelEdit">
                  <CloseOutlined /> Huỷ
                </a-button>
              </a-space>
            </template>
            <template v-else>
              <a-space>
                <a-button type="primary" size="small" @click="startEdit(record)">
                  <EditOutlined /> Sửa
                </a-button>
                <a-dropdown>
                  <a-button size="small">
                    Giá
                  </a-button>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item key="2" @click="showPriceHistoryModal(record)">
                        Lịch sử giá
                      </a-menu-item>
                      <a-menu-item key="3" @click="addNewPrice(record.id)">
                        Thêm giá mới
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </a-space>
            </template>
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
    <a-modal v-model:visible="jsonModalVisible" title="Thông tin tuỳ biến" :footer="null" width="700px"
      :mask-closable="false" @cancel="cancelJsonEdit">
      <div class="mb-4">
        <a-alert v-if="jsonEditing" type="info" message="Đang chỉnh sửa thông tin tuỳ biến"
          description="Hãy chỉnh sửa giá trị và nhấn 'Lưu thay đổi' để cập nhật." show-icon class="mb-3" />
        <a-space class="mb-3">
          <a-button type="primary" v-if="jsonEditing" @click="saveJsonChanges">
            <SaveOutlined /> Lưu thay đổi
          </a-button>
          <a-button type="primary" v-else @click="enableJsonEdit">
            <EditOutlined /> Chỉnh sửa
          </a-button>
          <a-button @click="cancelJsonEdit">
            <CloseOutlined /> {{ jsonEditing ? 'Huỷ' : 'Đóng' }}
          </a-button>
        </a-space>
      </div>

      <a-table :dataSource="jsonTableData" :columns="jsonEditingColumns" :pagination="false" size="small" bordered>
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.key === 'value'">
            <a-input v-if="jsonEditing" v-model:value="record.value" />
            <span v-else>{{ text }}</span>
          </template>
          <template v-else-if="column.key === 'actions' && jsonEditing">
            <a-space>
              <a-button size="small" type="primary" @click="saveJsonRowChange(record)"
                :disabled="!isJsonRowChanged(record)">
                <SaveOutlined />
              </a-button>
              <a-button size="small" danger @click="resetJsonRow(record)" :disabled="!isJsonRowChanged(record)">
                <UndoOutlined />
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-modal>

    <!-- Modal lịch sử giá -->
    <a-modal v-model:visible="priceHistoryModalVisible" title="Lịch sử giá" :footer="null" width="700px"
      :mask-closable="false">
      <div class="mb-4">
        <a-space>
          <a-button type="primary" @click="addNewPrice(currentPriceRecord?.id)">
            <PlusOutlined /> Thêm giá mới
          </a-button>
        </a-space>
      </div>
      <a-table :dataSource="priceHistoryData" :columns="priceHistoryColumns" :pagination="{ pageSize: 5 }" size="small"
        bordered>
        <template #bodyCell="{ column, text }">
          <template v-if="column.key === 'import_price_include_vat'">
            {{ formatPrice(text) }} VNĐ
          </template>
          <template v-else-if="column.key === 'created_at'">
            {{ formatDate(text) }}
          </template>
        </template>
        <template #emptyText>
          <div class="empty-data">
            <p>Chưa có thông tin giá</p>
          </div>
        </template>
      </a-table>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, reactive, h } from 'vue'
import { message, Modal  } from 'ant-design-vue'
import {
  FilePdfOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  UndoOutlined,
  PlusOutlined
} from '@ant-design/icons-vue'
// const CONST_HOST = "http://localhost:8080"
const CONST_HOST = "https://api.slmglobal.vn"

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

// Editing state
const editingRow = ref(null)
const editingData = ref({})
const originalData = ref({})
const currentJsonRecord = ref(null)
const jsonEditing = ref(false)
const originalJsonData = ref({})
const originalJsonTableData = ref([])


// Thêm các biến trạng thái cho modal lịch sử giá
const priceHistoryModalVisible = ref(false)
const priceHistoryData = ref([])
const currentPriceRecord = ref(null)

// Pagination config
const tablePagination = {
  pageSize: 10,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50', '100'],
  showTotal: (total) => `Tổng số ${total} mục`,
  position: ['bottomCenter'],
  className: 'centered-pagination'
}
// Định nghĩa cột cho bảng lịch sử giá
const priceHistoryColumns = [
  {
    title: 'STT',
    key: 'index',
    width: '60px',
    align: 'center',
    customRender: ({ index }) => index + 1
  },
  {
    title: 'Giá nhập (bao gồm VAT)',
    dataIndex: 'import_price_include_vat',
    key: 'import_price_include_vat',
    width: '200px',
    align: 'right'
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'created_at',
    key: 'created_at',
    width: '150px',
    align: 'center'
  }
]

// Hàm định dạng giá tiền
const formatPrice = (price) => {
  if (price === null || price === undefined) return '-'
  return new Intl.NumberFormat('vi-VN').format(price)
}

// Hàm hiển thị modal lịch sử giá
const showPriceHistoryModal = (record) => {
  currentPriceRecord.value = record

  // Định dạng và sắp xếp dữ liệu lịch sử giá (mới nhất lên đầu)
  if (record.price_infos && record.price_infos.length > 0) {
    priceHistoryData.value = [...record.price_infos]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  } else {
    priceHistoryData.value = []
  }

  priceHistoryModalVisible.value = true
}

// Hàm thêm giá mới
const addNewPrice = async (merchandiseId) => {
  try {
    // Tạo biến để lưu giá trị và kiểm tra tính hợp lệ
    let inputValue = '';
    let isValidPrice = false;

    // Sử dụng Modal.confirm để hiển thị dialog
    Modal.confirm({
      title: 'Thêm giá mới',
      icon: h(PlusOutlined),
      width: 500,
      // Sử dụng template với render function thay vì content và input thường thay vì a-input-number
      content: h('div', [
        h('div', { style: 'margin-bottom: 16px;' }, [
          h('span', { style: 'display: block; margin-bottom: 8px;' }, 'Giá nhập (bao gồm VAT):'),
          h('div', { class: 'price-input-container', style: 'position: relative;' }, [
            h('input', {
              type: 'text',
              class: 'price-input',
              style: 'width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 2px; box-sizing: border-box;',
              placeholder: 'Nhập giá',
              value: inputValue,
              oninput: (e) => {
                // Lấy chỉ số ký tự và vị trí con trỏ trước khi thay đổi giá trị
                const cursorPos = e.target.selectionStart;
                const oldLength = e.target.value.length;
                
                // Chỉ giữ lại các ký tự số
                const numericValue = e.target.value.replace(/[^\d]/g, '');
                
                if (numericValue) {
                  // Format số với dấu phân cách hàng nghìn
                  const formattedValue = Number(numericValue).toLocaleString('vi-VN');
                  e.target.value = formattedValue;
                  
                  // Điều chỉnh vị trí con trỏ sau khi format
                  const newLength = formattedValue.length;
                  const newPosition = cursorPos + (newLength - oldLength);
                  
                  // Đặt lại vị trí con trỏ sau khi cập nhật giá trị
                  setTimeout(() => {
                    e.target.setSelectionRange(
                      Math.max(0, Math.min(newPosition, newLength)),
                      Math.max(0, Math.min(newPosition, newLength))
                    );
                  }, 0);
                  
                  // Cập nhật biến kiểm tra giá
                  inputValue = formattedValue;
                  isValidPrice = Number(numericValue) > 0;
                } else {
                  e.target.value = '';
                  inputValue = '';
                  isValidPrice = false;
                }
              }
            }),
            h('div', {
              class: 'price-validation-message',
              style: 'color: #ff4d4f; font-size: 12px; margin-top: 4px; min-height: 18px;'
            })
          ])
        ])
      ]),
      // Tuỳ chỉnh nút xác nhận và huỷ
      okText: 'Xác nhận',
      cancelText: 'Huỷ',
      async onOk() {
        const inputEl = document.querySelector('.ant-modal-body .price-input');
        const validationMsg = document.querySelector('.ant-modal-body .price-validation-message');
        
        // Lấy giá trị đã nhập (xóa dấu phẩy ngăn cách)
        const price = inputEl ? inputEl.value.replace(/\./g, '').trim() : null;
        
        // Kiểm tra giá trị hợp lệ
        if (!price || isNaN(price) || parseFloat(price) <= 0) {
          if (validationMsg) {
            validationMsg.textContent = 'Vui lòng nhập giá hợp lệ lớn hơn 0';
          } else {
            message.error('Vui lòng nhập giá hợp lệ lớn hơn 0');
          }
          return Promise.reject();
        }

        isLoading.value = true;
        try {
          // Gọi API để thêm giá mới
          const response = await fetch(`${CONST_HOST}/api/products/${merchandiseId}/price`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              merchandise_id: merchandiseId,
              import_price_include_vat: parseFloat(price)
            })
          });

          if (response.ok) {
            message.success('Thêm giá mới thành công');
            // Tải lại dữ liệu sản phẩm để có thông tin giá mới nhất
            await loadMerchandiseById(merchandiseId);
            // Nếu modal lịch sử giá đang mở, cập nhật lại dữ liệu
            if (priceHistoryModalVisible.value && currentPriceRecord.value && currentPriceRecord.value.id === merchandiseId) {
              showPriceHistoryModal(
                localMerchandises.value.find(item => item.id === merchandiseId)
              );
            }
            return Promise.resolve();
          } else {
            const errorData = await response.json();
            message.error(`Lỗi: ${errorData.detail || 'Không thể thêm giá mới'}`);
            return Promise.reject();
          }
        } catch (error) {
          console.error('Error adding new price:', error);
          message.error('Có lỗi xảy ra khi thêm giá mới');
          return Promise.reject();
        } finally {
          isLoading.value = false;
        }
      },
      onCancel() {
        return Promise.resolve();
      }
    });
  } catch (error) {
    console.error('Error showing price input dialog:', error);
    message.error('Có lỗi xảy ra');
  }
}
// Hàm tải lại thông tin một sản phẩm theo ID
const loadMerchandiseById = async (merchandiseId) => {
  try {
    isLoading.value = true
    const response = await fetch(`${CONST_HOST}/api/products/${merchandiseId}`)

    if (response.ok) {
      const updatedMerchandise = await response.json()

      // Cập nhật sản phẩm trong mảng dữ liệu local
      const index = localMerchandises.value.findIndex(item => item.id === merchandiseId)
      if (index !== -1) {
        localMerchandises.value[index] = updatedMerchandise
      }
    } else {
      message.error('Không thể tải thông tin sản phẩm')
    }
  } catch (error) {
    console.error('Error loading merchandise by ID:', error)
    message.error('Có lỗi xảy ra khi tải dữ liệu')
  } finally {
    isLoading.value = false
  }
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

// Columns for JSON data modal with row actions
const jsonEditingColumns = computed(() => {
  const baseColumns = [
    {
      title: 'Thuộc tính',
      dataIndex: 'key',
      key: 'key',
      width: '35%',
    },
    {
      title: 'Giá trị',
      dataIndex: 'value',
      key: 'value',
      width: '50%',
    }
  ]

  // Add actions column when in edit mode
  if (jsonEditing.value) {
    baseColumns.push({
      title: 'Thao tác',
      key: 'actions',
      width: '15%',
      align: 'center'
    })
  }

  return baseColumns
})

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

// Start editing a row
const startEdit = (record) => {
  // Deep clone the record to preserve original data
  originalData.value = JSON.parse(JSON.stringify(record))

  editingData.value = {
    name: record.name,
    data_sheet_link: record.data_sheet_link || '',
    unit: record.unit || '',
    description_in_contract: record.description_in_contract || '',
    description_in_quotation: record.description_in_quotation || '',
    data_json: record.data_json || '{}',
    active: !!record.active // Add active state to editingData
  }

  editingRow.value = record.id
}

// Cancel editing
const cancelEdit = () => {
  editingRow.value = null
  editingData.value = {}
  originalData.value = {}
}

// Save changes to a row
const saveChanges = async (recordId) => {
  try {
    isLoading.value = true

    // Prepare data for API
    const updatedData = {
      name: editingData.value.name,
      data_sheet_link: editingData.value.data_sheet_link,
      unit: editingData.value.unit,
      description_in_contract: editingData.value.description_in_contract,
      description_in_quotation: editingData.value.description_in_quotation,
      // Keep the data_json intact unless it was explicitly changed in the JSON editor
      data_json: typeof editingData.value.data_json === 'string'
        ? JSON.parse(editingData.value.data_json)
        : editingData.value.data_json,
      active: editingData.value.active // Include active status in the update
    }

    // Call API to update merchandise
    const response = await fetch(`${CONST_HOST}/api/products/${recordId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    })

    if (response.ok) {
      message.success('Cập nhật sản phẩm thành công')

      // Update local data
      const index = localMerchandises.value.findIndex(item => item.id === recordId)
      if (index !== -1) {
        const updatedRecord = {
          ...localMerchandises.value[index],
          ...updatedData
        }
        localMerchandises.value[index] = updatedRecord
      }

      // Exit edit mode
      editingRow.value = null
    } else {
      const errorData = await response.json()
      message.error(`Lỗi: ${errorData.detail || 'Không thể cập nhật sản phẩm'}`)
    }
  } catch (error) {
    console.error('Error saving changes:', error)
    message.error('Có lỗi xảy ra khi cập nhật sản phẩm')
  } finally {
    isLoading.value = false
  }
}

// Show JSON modal
const showJsonModal = (record) => {
  currentJsonRecord.value = record
  jsonEditing.value = false

  // Parse and display JSON data
  const parsedData = formatJsonData(record.data_json)
  originalJsonData.value = { ...parsedData }

  // Create table data with original values for each row
  const tableData = Object.entries(parsedData).map(([key, value]) => {
    const formattedValue = Array.isArray(value) ? value.join(', ') : String(value || '-')
    return {
      key: formatKey(key),
      original_key: key, // Keep original key for updating
      value: formattedValue,
      original_value: formattedValue // Store original value for reset functionality
    }
  })

  jsonTableData.value = tableData
  originalJsonTableData.value = JSON.parse(JSON.stringify(tableData)) // Deep clone for reset
  jsonModalVisible.value = true
}

// Check if a JSON row has been changed
const isJsonRowChanged = (record) => {
  const originalRow = originalJsonTableData.value.find(item => item.original_key === record.original_key)
  return originalRow && originalRow.value !== record.value
}

// Reset a single JSON row to its original value
const resetJsonRow = (record) => {
  const originalRow = originalJsonTableData.value.find(item => item.original_key === record.original_key)
  if (originalRow) {
    record.value = originalRow.value
  }
}

// Save changes for a single JSON row
const saveJsonRowChange = async (record) => {
  try {
    if (!currentJsonRecord.value) return

    isLoading.value = true

    // Create updated JSON data from the current state of the table data
    const updatedJsonData = {}
    jsonTableData.value.forEach(item => {
      updatedJsonData[item.original_key] = item.value
    })

    // Prepare data for API
    const updatedData = {
      name: currentJsonRecord.value.name,
      data_sheet_link: currentJsonRecord.value.data_sheet_link,
      unit: currentJsonRecord.value.unit,
      description_in_contract: currentJsonRecord.value.description_in_contract,
      description_in_quotation: currentJsonRecord.value.description_in_quotation,
      data_json: updatedJsonData,
      active: currentJsonRecord.value.active // Include active status in the update
    }

    // Call API to update merchandise
    const response = await fetch(`${CONST_HOST}/api/products/${currentJsonRecord.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    })

    if (response.ok) {
      message.success(`Cập nhật thành công thuộc tính: ${record.key}`)

      // Update local data
      const index = localMerchandises.value.findIndex(item => item.id === currentJsonRecord.value.id)
      if (index !== -1) {
        localMerchandises.value[index].data_json = JSON.stringify(updatedJsonData)
      }

      // Update original data for this row
      const originalIndex = originalJsonTableData.value.findIndex(item =>
        item.original_key === record.original_key
      )
      if (originalIndex !== -1) {
        originalJsonTableData.value[originalIndex].value = record.value
      }

      // Update originalJsonData for future reference
      originalJsonData.value = { ...updatedJsonData }
    } else {
      const errorData = await response.json()
      message.error(`Lỗi: ${errorData.detail || 'Không thể cập nhật thuộc tính'}`)
    }
  } catch (error) {
    console.error('Error saving JSON row change:', error)
    message.error('Có lỗi xảy ra khi cập nhật thuộc tính')
  } finally {
    isLoading.value = false
  }
}

// Enable JSON editing
const enableJsonEdit = () => {
  jsonEditing.value = true
}

// Cancel JSON edit
const cancelJsonEdit = () => {
  if (jsonEditing.value) {
    // Reset to original data
    jsonTableData.value = JSON.parse(JSON.stringify(originalJsonTableData.value))
    jsonEditing.value = false
  } else {
    jsonModalVisible.value = false
    currentJsonRecord.value = null
  }
}

// Save all JSON changes
const saveJsonChanges = async () => {
  try {
    if (!currentJsonRecord.value) return

    isLoading.value = true

    // Convert table data back to JSON object
    const updatedJsonData = {}
    jsonTableData.value.forEach(item => {
      updatedJsonData[item.original_key] = item.value
    })

    // Prepare data for API
    const updatedData = {
      name: currentJsonRecord.value.name,
      data_sheet_link: currentJsonRecord.value.data_sheet_link,
      unit: currentJsonRecord.value.unit,
      description_in_contract: currentJsonRecord.value.description_in_contract,
      description_in_quotation: currentJsonRecord.value.description_in_quotation,
      data_json: updatedJsonData,
      active: currentJsonRecord.value.active // Include active status in the update
    }

    // Call API to update merchandise
    const response = await fetch(`${CONST_HOST}/api/products/${currentJsonRecord.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    })

    if (response.ok) {
      message.success('Cập nhật thông tin tuỳ biến thành công')

      // Update local data
      const index = localMerchandises.value.findIndex(item => item.id === currentJsonRecord.value.id)
      if (index !== -1) {
        localMerchandises.value[index].data_json = JSON.stringify(updatedJsonData)
      }

      // Update original data for all rows
      originalJsonTableData.value = JSON.parse(JSON.stringify(jsonTableData.value))
      originalJsonData.value = { ...updatedJsonData }

      // Exit edit mode but keep modal open
      jsonEditing.value = false
    } else {
      const errorData = await response.json()
      message.error(`Lỗi: ${errorData.detail || 'Không thể cập nhật thông tin tuỳ biến'}`)
    }
  } catch (error) {
    console.error('Error saving JSON changes:', error)
    message.error('Có lỗi xảy ra khi cập nhật thông tin tuỳ biến')
  } finally {
    isLoading.value = false
  }
}

// Event handlers
const handleFiltersChange = () => {
  // This is a placeholder for any additional actions needed when filters change
  // Currently the computed property handles the filtering automatically
}

const handleTableChange = (pagination, filters, sorter) => {
  // Handle table change events if needed
}

// Table columns
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
    width: 250,
  },
  {
    title: 'Mô tả trong báo giá',
    dataIndex: 'description_in_quotation',
    key: 'description_in_quotation',
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
    width: 80,
    align: 'center',
  },
  {
    title: 'Thao tác',
    key: 'actions',
    width: 150,
    align: 'center',
    fixed: 'right'
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
