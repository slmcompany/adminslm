<template>
  <a-layout-content class="add-installation">
    <a-row :gutter="[16, 16]">
      <a-col :span="24">
        <a-card title="Tạo gói lắp đặt">
          <a-button type="primary" @click="showDrawer">
            <template #icon><PlusOutlined /></template>
            Tạo gói lắp đặt mới
          </a-button>
        </a-card>
      </a-col>
    </a-row>

    <a-drawer
      title="Tạo gói lắp đặt mới"
      placement="right"
      :closable="false"
      :visible="visible"
      @close="onClose"
      width="720"
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
          <a-space direction="vertical" style="width: 100%">
            <div v-for="(image, index) in images" :key="index" style="margin-bottom: 8px">
              <a-space>
                <a-input
                  v-model:value="images[index]"
                  :placeholder="'Ảnh ' + (index + 1)"
                  style="width: 300px"
                />
                <a-button type="link" danger @click="removeImage(index)">Xóa</a-button>
              </a-space>
            </div>
            <a-button type="dashed" @click="addImageInput" block>
              <template #icon><PlusOutlined /></template>
              Thêm ảnh
            </a-button>
          </a-space>
        </a-form-item>

        <a-form-item label="Công suất áp dụng">
          <a-space direction="vertical" style="width: 100%">
            <a-space>
              <span>Từ:</span>
              <a-input-number
                v-model:value="from_power_kwp"
                :min="0"
                placeholder="Từ"
                style="width: 120px"
              />
              <span>kWp</span>
            </a-space>
            <a-space>
              <span>Đến:</span>
              <a-input-number
                v-model:value="to_power_kwp"
                :min="0"
                placeholder="Đến"
                style="width: 120px"
              />
              <span>kWp</span>
              <a-button type="link" @click="getMaxToPower">Lấy tối đa</a-button>
            </a-space>
          </a-space>
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

    <a-row :gutter="[16, 16]" style="margin-top: 24px">
      <a-col :span="24">
        <a-card title="Danh sách vật tư">
          <TableMerchandise :merchandises="merchandises" defaultGroup="INSTALLATION_PACKAGE" />
        </a-card>
      </a-col>
    </a-row>
  </a-layout-content>
</template>

<script setup>
import TableMerchandise from '@/components/TableMerchandise.vue'
import { ref, onMounted } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const CONST_HOST = "https://id.slmsolar.com"
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
const unit = ref('')
const description_in_contract = ref('')
const images = ref([])
const begin_price = ref(0)
const from_power_kwp = ref(0)
const to_power_kwp = ref(0)
const merchandises = ref([])
const description_in_quotation = ref('')

const getMaxToPower = () => {
  to_power_kwp.value = 10000000
}

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
    template_code: 'INSTALLATION_PACKAGE',
    supplier_id: null,
    brand_id: choseBrand.value,
    code: code.value,
    name: name.value,
    data_sheet_link: '',
    unit: unit.value,
    description_in_contract: description_in_contract.value,
    description_in_quotation: description_in_quotation.value,
    images: images.value,
    data_json: {
      from_power_kwp: from_power_kwp.value,
      to_power_kwp: to_power_kwp.value
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
.add-installation {
  padding: 24px;
}
</style>
