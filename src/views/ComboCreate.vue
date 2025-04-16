<template>
  <div class="contract-page">
    <a-card title="Tạo Combo" :bordered="false">
      <a-form :model="formState" layout="vertical" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">

        <!-- Thông tin Combo -->
        <a-divider orientation="left">
          <h2>Thông tin Combo</h2>
        </a-divider>

        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="Mã combo" name="code">
              <a-input v-model:value="formState.code" placeholder="Nhập mã combo" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Tên combo" name="name">
              <a-input v-model:value="formState.name" placeholder="Nhập tên combo" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Ảnh combo" name="image">
              <a-input v-model:value="formState.image" placeholder="URL ảnh combo" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- Thông tin khách hàng -->
        <a-divider orientation="left">
          <h2>Thông tin khách hàng</h2>
        </a-divider>

        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="Tên khách hàng" name="customer_name">
              <a-input v-model:value="formState.customer_name" placeholder="Nhập tên khách hàng" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="SĐT khách hàng" name="customer_phone">
              <a-input v-model:value="formState.customer_phone" placeholder="Nhập SĐT khách hàng" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Email khách hàng" name="customer_email">
              <a-input v-model:value="formState.customer_email" placeholder="Nhập email khách hàng" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="Tỉnh/Thành phố" name="customer_province">
              <a-select
                v-model:value="formState.customer_province"
                placeholder="Chọn tỉnh/thành phố"
                show-search
              >
                <a-select-option v-for="province in provinces" :key="province" :value="province">
                  {{ province }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Quận/Huyện" name="customer_district">
              <a-select
                v-model:value="formState.customer_district"
                placeholder="Chọn quận/huyện"
                show-search
              >
                <a-select-option v-for="district in districts" :key="district" :value="district">
                  {{ district }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Phường/Xã" name="customer_ward">
              <a-select
                v-model:value="formState.customer_ward"
                placeholder="Chọn phường/xã"
                show-search
              >
                <a-select-option v-for="ward in wards" :key="ward" :value="ward">
                  {{ ward }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="Địa chỉ cụ thể" name="customer_address">
              <a-textarea
                v-model:value="formState.customer_address"
                placeholder="Nhập địa chỉ cụ thể"
                :auto-size="{ minRows: 2, maxRows: 6 }"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- Thông tin lắp đặt -->
        <a-divider orientation="left">
          <h2>Thông tin lắp đặt</h2>
        </a-divider>

        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="Thời gian bắt đầu bảo hành" name="created_at">
              <a-date-picker
                v-model:value="formState.created_at"
                style="width: 100%"
                @change="onDateChange"
                format="DD/MM/YYYY"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Chọn hệ lắp đặt" name="installation_type">
              <a-select
                v-model:value="formState.installation_type"
                placeholder="Chọn hệ lắp đặt"
                @change="filterMerchandise"
              >
                <a-select-option value="Ongrid">Ongrid</a-select-option>
                <a-select-option value="Hybrid">Hybrid</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Chọn pha" name="phase_type">
              <a-select
                v-model:value="formState.phase_type"
                placeholder="Chọn pha"
                @change="filterMerchandise"
              >
                <a-select-option value="1-phase">1 pha</a-select-option>
                <a-select-option value="3-phase high voltage">3 pha tần cao</a-select-option>
                <a-select-option value="3-phase low voltage">3 pha tần thấp</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="Loại báo giá" name="kind">
              <a-select v-model:value="formState.kind" placeholder="Chọn loại báo giá">
                <a-select-option value="combo">Tạo báo giá combo</a-select-option>
                <a-select-option value="contract_quote">Báo giá chi tiết</a-select-option>
                <a-select-option value="survey_quote">Báo giá khảo sát</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Công suất (kWp)" name="power">
              <a-input-number
                v-model:value="formState.power"
                min="0"
                style="width: 100%"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Diện tích mái (m²)" name="roof_area">
              <a-input-number
                v-model:value="formState.roof_area"
                min="0"
                style="width: 100%"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- Cấu hình Combo -->
        <a-divider orientation="left">
          <h2>Cấu hình Combo</h2>
        </a-divider>

        <!-- Chọn Combo -->
        <a-card title="Combo sản phẩm" class="equipment-card" size="small">
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item label="Chọn Combo" name="combo_type">
                <a-select
                  v-model:value="formState.combo_type"
                  placeholder="Chọn loại combo"
                  @change="onComboChange"
                >
                  <a-select-option value="eco">Eco - Tiết kiệm</a-select-option>
                  <a-select-option value="standard">Standard - Tiêu chuẩn</a-select-option>
                  <a-select-option value="premium">Premium - Cao cấp</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="Giá combo (VNĐ)" name="combo_price">
                <a-input-number
                  v-model:value="formState.combo_price"
                  min="0"
                  style="width: 100%"
                  :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                  disabled
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="Tổng công suất (kWp)" name="total_power">
                <a-input-number
                  v-model:value="formState.total_power"
                  min="0"
                  style="width: 100%"
                  :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                  disabled
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

        <!-- Chi tiết sản phẩm -->
        <a-card title="Chi tiết sản phẩm" class="equipment-card" style="margin-top: 16px" size="small">
          <a-descriptions bordered :column="1" size="small">
            <a-descriptions-item label="Tấm pin mặt trời">
              {{ formState.details.panel || 'Chưa chọn' }}
            </a-descriptions-item>
            <a-descriptions-item label="Biến tần">
              {{ formState.details.inverter || 'Chưa chọn' }}
            </a-descriptions-item>
            <a-descriptions-item label="Phụ kiện lắp đặt">
              {{ formState.details.accessories || 'Chưa chọn' }}
            </a-descriptions-item>
            <a-descriptions-item label="Thời gian bảo hành">
              {{ formState.details.warranty || 'Chưa có thông tin' }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>

        <!-- Thanh điều khiển và nút bấm -->
        <div class="action-buttons" style="margin-top: 24px; text-align: center;">
          <a-space>
            <a-button type="primary" size="large" @click="createCombo">
              <save-outlined />
              Tạo Combo
            </a-button>
            <a-button size="large">
              <reload-outlined />
              Làm mới
            </a-button>
          </a-space>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  SaveOutlined,
  ReloadOutlined
} from '@ant-design/icons-vue'

// Dữ liệu ban đầu
const formState = reactive({
  // Thông tin combo
  code: '',
  name: '',
  image: '',

  // Thông tin khách hàng
  customer_name: '',
  customer_phone: '',
  customer_email: '',
  customer_province: '',
  customer_district: '',
  customer_ward: '',
  customer_address: '',

  // Thông tin lắp đặt
  created_at: null,
  installation_type: 'Ongrid',
  phase_type: '1-phase',
  kind: 'combo',
  power: 5,
  roof_area: 40,

  // Cấu hình combo
  combo_type: '',
  combo_price: 0,
  total_power: 0,

  // Chi tiết sản phẩm
  details: {
    panel: '',
    inverter: '',
    accessories: '',
    warranty: ''
  }
})

// Dữ liệu mẫu
const provinces = ref(['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng'])
const districts = ref(['Quận 1', 'Quận 2', 'Quận 3'])
const wards = ref(['Phường 1', 'Phường 2', 'Phường 3'])

// Khởi tạo
onMounted(async () => {
  try {
    // Có thể tải dữ liệu ban đầu ở đây
  } catch (error) {
    message.error('Có lỗi xảy ra khi tải dữ liệu')
    console.error(error)
  }
})

// Các hàm xử lý
const filterMerchandise = () => {
  // Lọc sản phẩm dựa trên loại lắp đặt và pha
  // Ví dụ các loại combo có thể thay đổi dựa trên các tham số này
}

const onDateChange = () => {
  // Xử lý khi ngày thay đổi
}

const onComboChange = (value) => {
  // Thiết lập giá trị dựa trên loại combo được chọn
  switch(value) {
    case 'eco':
      formState.combo_price = 100000000
      formState.total_power = 5
      formState.details = {
        panel: 'PV Panel Eco 450W x 12 tấm',
        inverter: 'Inverter Eco 5kW',
        accessories: 'Bộ khung cơ bản, dây cáp tiêu chuẩn',
        warranty: 'Pin: 10 năm, Inverter: 5 năm'
      }
      break
    case 'standard':
      formState.combo_price = 150000000
      formState.total_power = 6
      formState.details = {
        panel: 'PV Panel Standard 500W x 12 tấm',
        inverter: 'Inverter Standard 6kW',
        accessories: 'Bộ khung cơ bản, dây cáp cao cấp, hệ thống giám sát',
        warranty: 'Pin: 15 năm, Inverter: 7 năm'
      }
      break
    case 'premium':
      formState.combo_price = 200000000
      formState.total_power = 8
      formState.details = {
        panel: 'PV Panel Premium 550W x 15 tấm',
        inverter: 'Inverter Premium 8kW',
        accessories: 'Bộ khung nhôm cao cấp, dây cáp premium, hệ thống giám sát, app điều khiển',
        warranty: 'Pin: 20 năm, Inverter: 10 năm'
      }
      break
    default:
      formState.combo_price = 0
      formState.total_power = 0
      formState.details = {
        panel: '',
        inverter: '',
        accessories: '',
        warranty: ''
      }
  }
}

const createCombo = async () => {
  try {
    // Validate form
    const missingFields = []
    if (!formState.name) missingFields.push('Tên combo')
    if (!formState.customer_name) missingFields.push('Tên khách hàng')
    if (!formState.customer_phone) missingFields.push('SĐT khách hàng')
    if (!formState.combo_type) missingFields.push('Loại combo')

    if (missingFields.length > 0) {
      message.error(`Vui lòng điền đầy đủ thông tin: ${missingFields.join(', ')}`)
      return
    }

    // Gửi dữ liệu đi
    message.loading('Đang tạo combo...')

    // Thêm code gửi dữ liệu thực tế đến API
    // await fetch('API_URL', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formState)
    // })

    // Giả lập thành công
    setTimeout(() => {
      message.success('Tạo combo thành công!')
    }, 1500)

  } catch (error) {
    message.error('Có lỗi xảy ra khi tạo combo')
    console.error(error)
  }
}
</script>

<style scoped>
.contract-page {
  padding: 24px;
  background-color: #f0f2f5;
}

.equipment-card {
  background-color: #fafafa;
  border: 1px solid #f0f0f0;
  margin-bottom: 16px;
}

:deep(.ant-card-head) {
  background-color: #f5f5f5;
}

:deep(.ant-descriptions-bordered .ant-descriptions-item-label) {
  background-color: #f8f8f8;
  font-weight: 500;
}

:deep(.ant-input-number-handler-wrap) {
  opacity: 1;
}
</style>
