<template>
  <a-layout-content class="add-inverter">
    <a-row :gutter="[16, 16]">
      <a-col :span="24">
        <a-card>
          <template #title>
            <div class="card-title-container">
              <span>Danh sách biến tần</span>
              <a-button type="primary" @click="showDrawer">
                <template #icon><PlusOutlined /></template>
                Tạo biến tần mới
              </a-button>
            </div>
          </template>
          <TableMerchandise :merchandises="merchandises" defaultGroup="INVERTER_DC_AC" />
        </a-card>
      </a-col>
    </a-row>

    <a-drawer
      title="Tạo biến tần mới"
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

        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="Chiều ngang(mm)">
              <a-input-number
                v-model:value="width_mm"
                placeholder="Chiều ngang"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Chiều cao(mm)">
              <a-input-number
                v-model:value="height_mm"
                placeholder="Chiều cao"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Độ dày(mm)">
              <a-input-number
                v-model:value="thickness_mm"
                placeholder="Độ dày"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="Khối lượng(kg)">
          <a-input-number
            v-model:value="weight_kg"
            placeholder="Khối lượng"
            style="width: 100%"
          />
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

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Công suất AC(KW)">
              <a-input-number
                v-model:value="ac_power_kw"
                placeholder="Công suất AC"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Công suất max DC(KW)">
              <a-input-number
                v-model:value="dc_max_power_kw"
                placeholder="Công suất max DC"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="Chọn hệ lắp đặt">
          <a-select v-model:value="installation_type">
            <a-select-option value="Ongrid">Ongrid</a-select-option>
            <a-select-option value="Hybrid">Hybrid</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="Chọn pha">
          <a-checkbox-group v-model:value="phase_type">
            <template v-if="installation_type === 'Hybrid'">
              <a-checkbox value="1-phase">1 pha</a-checkbox>
              <a-checkbox value="3-phase high voltage">3 pha áp cao</a-checkbox>
              <a-checkbox value="3-phase low voltage">3 pha áp thấp</a-checkbox>
            </template>
            <template v-else>
              <a-checkbox value="1-phase">1 pha</a-checkbox>
              <a-checkbox value="3-phase">3 pha</a-checkbox>
            </template>
          </a-checkbox-group>
        </a-form-item>

        <a-form-item label="Xếp hạng biến tần">
          <a-input v-model:value="inverter_rating" placeholder="Xếp hạng biến tần" />
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
const width_mm = ref(0)
const height_mm = ref(0)
const thickness_mm = ref(0)
const weight_kg = ref(0)
const images = ref([])
const ac_power_kw = ref(0)
const dc_max_power_kw = ref(0)
const installation_type = ref('Ongrid')
const phase_type = ref([])
const inverter_rating = ref('')
const warranty_years = ref(0)
const begin_price = ref(0)
const description_in_quotation = ref('')
const merchandises = ref([])

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
    template_code: 'INVERTER_DC_AC',
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
      width_mm: width_mm.value,
      height_mm: height_mm.value,
      thickness_mm: thickness_mm.value,
      weight_kg: weight_kg.value,
      ac_power_kw: ac_power_kw.value,
      dc_max_power_kw: dc_max_power_kw.value,
      installation_type: installation_type.value,
      phase_type: phase_type.value,
      inverter_rating: inverter_rating.value,
      warranty_years: warranty_years.value
    }
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
.add-inverter {
  padding: 24px;
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
</style>
