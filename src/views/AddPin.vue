<template>
  <a-layout-content class="add-pin">
    <a-row :gutter="[16, 16]">
      <a-col :span="24">
        <a-card>
          <template #title>
            <div class="card-title-container">
              <span>Danh sách loại pin</span>
              <a-button type="primary" @click="showDrawer">
                <template #icon><PlusOutlined /></template>
                Tạo loại pin mới
              </a-button>
            </div>
          </template>
          <TableMerchandise :merchandises="merchandises" defaultGroup="PIN" />
        </a-card>
      </a-col>
    </a-row>

    <a-drawer
      title="Tạo loại pin mới"
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
            <a-select-option v-for="brand in brands" :key="brand.id" :value="brand.id">
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
            placeholder="Khởi tạo giá"
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
const warranty_years = ref(0)
const begin_price = ref(0)
const merchandises = ref([])
const description_in_quotation = ref('')

const loadBrands = async () => {
  try {
    const response = await fetch(`${CONST_HOST}/api/json/brands`, {
      method: 'GET',
      credentials: 'include',
    })

    if (response.ok) {
      const data = await response.json()
      brands.value = data.items
    }
  } catch (error) {
    console.error('Error loading brands:', error)
    message.error('Có lỗi xảy ra khi tải danh sách thương hiệu')
  }
}

const loadMerchandises = async () => {
  try {
    const response = await fetch(`${CONST_HOST}/api/json/merchandises/template-code/PIN`, {
      method: 'GET',
      credentials: 'include',
    })

    if (response.ok) {
      const data = await response.json()
      merchandises.value = data.items
    }
  } catch (error) {
    console.error('Error loading merchandises:', error)
    message.error('Có lỗi xảy ra khi tải danh sách vật tư')
  }
}

const createMerchandise = async () => {
  const payload = {
    template_code: 'PIN',
    brand_id: choseBrand.value,
    supplier_id: null,
    code: code.value,
    name: name.value,
    data_sheet_link: data_sheet_link.value,
    unit: unit.value,
    description_in_contract: description_in_contract.value,
    description_in_quotation: description_in_quotation.value,
    data_json: {
      images: images.value,
      warranty_years: warranty_years.value,
    },
    slug: name.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    begin_price: begin_price.value,
  }

  try {
    const response = await fetch(`${CONST_HOST}/api/json/merchandise`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      credentials: 'include',
    })

    if (response.ok) {
      await response.json()
      message.success('Tạo loại pin thành công')
      onClose()
      loadMerchandises()
    } else {
      message.error('Có lỗi xảy ra')
    }
  } catch (err) {
    message.error('Có lỗi xảy ra')
    console.error('Error:', err)
  }
}

const addImageInput = () => {
  images.value.push('')
}

const removeImage = (index) => {
  images.value.splice(index, 1)
}

onMounted(() => {
  loadBrands()
  loadMerchandises()
  addImageInput()
})
</script>

<style scoped>
.add-pin {
  padding: 16px;
  width: 100%;
  margin: 0;
}

.image-input {
  display: flex;
  margin-bottom: 8px;
  align-items: center;
}

.image-input a-input {
  flex: 1;
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

/* Full width styles */
:deep(.ant-card) {
  width: 100%;
  margin-bottom: 16px;
}

:deep(.ant-card-body) {
  width: 100%;
}

:deep(.ant-table-wrapper) {
  width: 100%;
  overflow-x: auto;
}

:deep(.ant-table) {
  width: 100%;
}

:deep(.ant-row) {
  margin-left: 0 !important;
  margin-right: 0 !important;
  width: 100%;
}

:deep(.ant-col) {
  padding-left: 0;
  padding-right: 0;
}
</style>
