<template>
  <a-layout-content class="add-grounding-system">
    <a-row :gutter="[16, 16]">
      <a-col :span="24">
        <a-card>
          <template #title>
            <div class="card-title-container">
              <span>Danh sách hệ tiếp địa</span>
              <a-button type="primary" @click="showDrawer">
                <template #icon><PlusOutlined /></template>
                Tạo hệ tiếp địa mới
              </a-button>
            </div>
          </template>
          <TableMerchandise :merchandises="merchandises" defaultGroup="GROUNDING_SYSTEM" />
        </a-card>
      </a-col>
    </a-row>

    <a-drawer
      title="Tạo hệ tiếp địa mới"
      placement="right"
      :closable="false"
      :visible="visible"
      @close="onClose"
      width="520"
      class="compact-drawer"
    >
      <a-form :model="formState" layout="vertical">
        <a-form-item label="Chọn thương hiệu">
          <a-select
            v-model:value="choseBrand"
            placeholder="Chọn thương hiệu"
          >
            <a-select-option
              v-for="brand in brands"
              :key="brand.id"
              :value="brand.id"
            >
              {{ brand.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="Mã" required>
          <a-input v-model:value="code" placeholder="Mã" />
        </a-form-item>

        <a-form-item label="Tên" required>
          <a-input v-model:value="name" placeholder="Tên" />
        </a-form-item>

        <a-form-item label="Link data sheet" required>
          <a-input v-model:value="data_sheet_link" placeholder="Data sheet link" />
        </a-form-item>

        <a-form-item label="Đơn vị" required>
          <a-input v-model:value="unit" placeholder="Đơn vị" />
        </a-form-item>

        <a-form-item label="Mô tả trong hợp đồng">
          <a-textarea
            v-model:value="description_in_contract"
            :rows="4"
            placeholder="Mô tả trong hợp đồng"
          />
        </a-form-item>

        <a-form-item label="Mô tả trong báo giá">
          <a-textarea
            v-model:value="description_in_quotation"
            :rows="4"
            placeholder="Mô tả trong báo giá"
          />
        </a-form-item>

        <a-form-item label="Ảnh">
          <div v-for="(image, index) in images" :key="index" class="image-input">
            <a-input
              v-model:value="images[index]"
              :placeholder="'Ảnh ' + (index + 1)"
              style="margin-bottom: 8px"
            />
            <a-button type="link" danger @click="removeImage(index)">Xóa</a-button>
          </div>
          <a-button type="dashed" @click="addImageInput" block>
            <template #icon><PlusOutlined /></template>
            Thêm ảnh
          </a-button>
        </a-form-item>

        <a-form-item label="Đường kính dây">
          <a-select v-model:value="wire_diameter_mm" style="width: 100%">
            <a-select-option value="4">4</a-select-option>
            <a-select-option value="6">6</a-select-option>
            <a-select-option value="10">10</a-select-option>
            <a-select-option value="16">16</a-select-option>
            <a-select-option value="25">25</a-select-option>
            <a-select-option value="35">35</a-select-option>
            <a-select-option value="50">50</a-select-option>
            <a-select-option value="70">70</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="Bảo hành">
          <a-input-number
            v-model:value="warranty_years"
            placeholder="Bảo hành"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item label="Khởi tạo giá">
          <a-input-number
            v-model:value="begin_price"
            placeholder="Khởi tạo GM"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" @click="createMerchandise" block>Tạo</a-button>
        </a-form-item>
      </a-form>
    </a-drawer>
  </a-layout-content>
</template>

<script setup>
import TableMerchandise from '@/components/TableMerchandise.vue'
import { ref, onMounted } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const CONST_HOST = "https://api.slmglobal.vn"
const visible = ref(false)
const showDrawer = () => {
  visible.value = true
}
const onClose = () => {
  visible.value = false
}

const brands = ref([])
const choseBrand = ref(0)
const code = ref('')
const name = ref('')
const data_sheet_link = ref('')
const unit = ref('')
const description_in_contract = ref('')
const images = ref([])
const warranty_years = ref('')
const begin_price = ref(0)
const merchandises = ref([])
const wire_diameter_mm = ref(6)
const description_in_quotation = ref('')

const loadBrands = async () => {
  try {
    const response = await fetch(`${CONST_HOST}/api/brands`)
    if (response.ok) {
      const data = await response.json()
      brands.value = data
      if (brands.value.length > 0) {
        choseBrand.value = brands.value[0].id
      }
    } else {
      message.error('Tải danh sách thương hiệu thất bại')
    }
  } catch (error) {
    message.error('Có lỗi xảy ra')
    console.error('Error:', error)
  }
}

const loadMerchandises = async () => {
  try {
    const response = await fetch(CONST_HOST + '/api/products')
    if (response.ok) {
      const data = await response.json()
      merchandises.value = data
    } else {
      message.error('Tải danh sách vật tư thất bại')
    }
  } catch (error) {
    message.error('Có lỗi xảy ra')
    console.error('Error:', error)
  }
}

onMounted(async () => {
  loadBrands()
  loadMerchandises()
})

const createMerchandise = async () => {
  const payload = {
    template_code: 'GROUNDING_SYSTEM',
    supplier_id: null,
    brand_id: choseBrand.value,
    code: code.value,
    name: name.value,
    data_sheet_link: data_sheet_link.value,
    unit: unit.value,
    description_in_contract: description_in_contract.value,
    description_in_quotation: description_in_quotation.value,
    images: images.value,
    data_json: {
      wire_diameter_mm: wire_diameter_mm.value,
      warranty_years: warranty_years.value
    },
    begin_price: begin_price.value,
  }

  try {
    const response = await fetch(`${CONST_HOST}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      await response.json()
      message.success('Tạo thành công!')
      loadMerchandises()
      onClose()
    } else {
      message.error('Tạo thất bại!')
    }
  } catch (error) {
    message.error('Có lỗi xảy ra!')
    console.error('Error:', error)
  }
}

const addImageInput = () => {
  images.value.push('')
}

const removeImage = (index) => {
  images.value.splice(index, 1)
}
</script>

<style scoped>
.add-grounding-system {
  padding: 24px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.card-title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.card-title-container span {
  font-size: 16px;
  font-weight: 500;
}

:deep(.ant-card) {
  width: 100% !important;
  max-width: 100% !important;
}

:deep(.ant-card-body) {
  width: 100% !important;
  max-width: 100% !important;
}

:deep(.ant-col) {
  width: 100%;
}

:deep(.ant-row) {
  width: 100%;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.image-input {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}
</style>
