<template>
  <a-layout-content class="add-pin-pv">
    <a-row :gutter="[16, 16]">
      <a-col :span="24">
        <a-card title="Tạo tấm pin">
          <a-button type="primary" @click="showDrawer">
            <template #icon><PlusOutlined /></template>
            Tạo tấm pin mới
          </a-button>
        </a-card>
      </a-col>

      <a-col :span="24">
        <a-card title="Danh sách vật tư">
          <TableMerchandise :merchandises="merchandises" />
        </a-card>
      </a-col>
    </a-row>

    <a-drawer
      title="Tạo tấm pin mới"
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
            @change="printBrand"
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

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Công suất(Watt)">
              <a-input-number
                v-model:value="power_watt"
                placeholder="Công suất"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Chiều ngang(mm)">
              <a-input-number
                v-model:value="width_mm"
                placeholder="Chiều ngang"
                style="width: 100%"
                @change="calculateArea"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Chiều cao(mm)">
              <a-input-number
                v-model:value="height_mm"
                placeholder="Chiều cao"
                style="width: 100%"
                @change="calculateArea"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Độ dày(mm)">
              <a-input-number
                v-model:value="thickness_mm"
                placeholder="Độ dày"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Diện tích(m2)">
              <a-input-number
                v-model:value="area_m2"
                placeholder="Diện tích"
                style="width: 100%"
                disabled
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Khối lượng(kg)">
              <a-input-number
                v-model:value="weight_kg"
                placeholder="Khối lượng"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Công nghệ">
              <a-input v-model:value="technology" placeholder="Công nghệ" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Bảo hành">
              <a-input-number
                v-model:value="warranty_years"
                placeholder="Bảo hành"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
        </a-row>

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

const CONST_HOST = "https://id.slmsolar.com"
const brands = ref([])
const choseBrand = ref(0)
const code = ref('')
const name = ref('')
const data_sheet_link = ref('')
const unit = ref('')
const description_in_contract = ref('')
const images = ref([])
const power_watt = ref(0)
const width_mm = ref(0)
const height_mm = ref(0)
const thickness_mm = ref(0)
const area_m2 = ref(0)
const weight_kg = ref(0)
const technology = ref('')
const warranty_years = ref(0)
const begin_price = ref(0)
const description_in_quotation = ref('')
const merchandises = ref([])
const visible = ref(false)

const showDrawer = () => {
  visible.value = true
}
const onClose = () => {
  visible.value = false
}

const createMerchandise = async () => {
  const sendingData = {
    template_code: 'PIN_PV',
    brand_id: choseBrand.value,
    supplier_id: null,
    code: code.value,
    name: name.value,
    data_sheet_link: data_sheet_link.value,
    unit: unit.value,
    description_in_contract: description_in_contract.value,
    description_in_quotation: description_in_quotation.value,
    images: images.value,
    begin_price: begin_price.value,
    data_json: {
      power_watt: power_watt.value,
      width_mm: width_mm.value,
      height_mm: height_mm.value,
      thickness_mm: thickness_mm.value,
      area_m2: area_m2.value,
      weight_kg: weight_kg.value,
      technology: technology.value,
      warranty_years: warranty_years.value,
    }
  }

  try {
    const response = await fetch(CONST_HOST + '/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sendingData)
    })

    if (response.ok) {
      await response.json()
      message.success('Tạo thành công')
      loadMerchandises()
    } else {
      message.error('Tạo thất bại')
    }
  } catch (error) {
    message.error('Có lỗi xảy ra')
    console.error('Error:', error)
  }
}

const calculateArea = () => {
  area_m2.value = (width_mm.value * height_mm.value) / 1000000
}

const loadBrands = async () => {
  try {
    const response = await fetch(CONST_HOST + '/api/brands')
    if (response.ok) {
      const data = await response.json()
      brands.value = data
      choseBrand.value = data[0].id
    } else {
      message.error('Tải danh sách thương hiệu thất bại')
    }
  } catch (error) {
    message.error('Có lỗi xảy ra')
    console.error('Error:', error)
  }
}

const addImageInput = () => {
  images.value.push('')
}

const removeImage = (index) => {
  images.value.splice(index, 1)
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
</script>

<style scoped>
.add-pin-pv {
  padding: 24px;
}

.image-input {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
