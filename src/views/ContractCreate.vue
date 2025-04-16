<template>
  <div class="contract-page">
    <a-card title="Tạo hợp đồng trọn gói lắp đặt" :bordered="false">
      <a-form :model="formState" layout="vertical" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">

        <!-- Thông tin hợp đồng -->
        <a-divider orientation="left">
          <h2>Tiêu đề hợp đồng</h2>
        </a-divider>

        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="Mã hợp đồng" name="code">
              <a-input v-model:value="formState.code" placeholder="Nhập mã hợp đồng" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Tên hợp đồng" name="name">
              <a-input v-model:value="formState.name" placeholder="Nhập tên hợp đồng" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Ảnh hợp đồng" name="image">
              <a-input v-model:value="formState.image" placeholder="URL ảnh hợp đồng" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- Thông tin người bán -->
        <a-divider orientation="left">
          <h2>Thông tin người bán</h2>
        </a-divider>

        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="Tìm kiếm" name="sale_search">
              <a-auto-complete
                v-model:value="formState.sale_search"
                :options="autoCompleteOptions"
                @select="selectSale"
                @search="handleSaleSearch"
                placeholder="Nhập tên hoặc số điện thoại"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Thông tin sale" name="sale_info">
              <a-input v-model:value="formState.sale_info" readonly />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="ID của sale" name="sale_id">
              <a-input v-model:value="formState.sale_id" readonly />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- Thông tin khách hàng -->
        <a-divider orientation="left">
          <h2>Thông tin khách hàng</h2>
        </a-divider>

        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="Mã khách hàng" name="customer_code">
              <a-input v-model:value="formState.customer_code" placeholder="Nhập mã khách hàng" />
            </a-form-item>
          </a-col>
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
        </a-row>

        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="Email khách hàng" name="customer_email">
              <a-input v-model:value="formState.customer_email" placeholder="Nhập email khách hàng" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Mã số thuế khách hàng" name="customer_tax_code">
              <a-input v-model:value="formState.customer_tax_code" placeholder="Nhập mã số thuế" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Giới tính" name="customer_gender">
              <a-select v-model:value="formState.customer_gender" placeholder="Chọn giới tính">
                <a-select-option value="true">Nam</a-select-option>
                <a-select-option value="false">Nữ</a-select-option>
              </a-select>
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
        </a-row>

        <!-- Danh sách thiết bị -->
        <a-divider orientation="left">
          <h2>Danh sách thiết bị</h2>
        </a-divider>

        <!-- Tấm pin mặt trời -->
        <a-card title="Tấm pin mặt trời" class="equipment-card" size="small">
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item label="Loại tấm pin" name="pv">
                <a-select
                  v-model:value="formState.pv"
                  placeholder="Chọn loại tấm pin"
                  @change="onPvChange"
                >
                  <a-select-option v-for="merchandise in pvs" :key="merchandise.id" :value="merchandise.id">
                    {{ merchandise.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item label="Số lượng" name="pv_number">
                <a-input-number
                  v-model:value="formState.pv_number"
                  min="0"
                  style="width: 100%"
                  @change="calculateAL"
                />
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item label="Công suất (W)" name="pv_power">
                <a-input-number
                  v-model:value="formState.pv_power"
                  min="0"
                  style="width: 100%"
                  @change="calculateAL"
                />
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item label="Giá (VNĐ)" name="pv_price">
                <a-input-number
                  v-model:value="formState.pv_price"
                  min="0"
                  style="width: 100%"
                  :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                />
              </a-form-item>
            </a-col>
            <a-col :span="2">
              <a-form-item label="GM (%)" name="pv_gm">
                <a-input-number
                  v-model:value="formState.pv_gm"
                  min="0"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :span="2">
              <a-form-item label="Bảo hành" name="pv_warranty">
                <a-input-number
                  v-model:value="formState.pv_warranty"
                  min="0"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

        <!-- Biến tần -->
        <a-card title="Biến tần" class="equipment-card" style="margin-top: 16px" size="small">
          <div v-for="(inverter, index) in formState.inverters_list" :key="index" class="inverter-item">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item label="Loại biến tần" :name="['inverters_list', index, 'selected']">
                  <a-select
                    v-model:value="inverter.selected"
                    placeholder="Chọn loại biến tần"
                    @change="val => calcInvPrice(val, index)"
                  >
                    <a-select-option v-for="merchandise in inverters_show" :key="merchandise.id" :value="merchandise.id">
                      {{ merchandise.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item label="Số lượng" :name="['inverters_list', index, 'quantity']">
                  <a-input-number
                    v-model:value="inverter.quantity"
                    min="0"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="Giá/đơn vị" :name="['inverters_list', index, 'price']">
                  <a-input-number
                    v-model:value="inverter.price"
                    min="0"
                    style="width: 100%"
                    :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item label=" ">
                  <a-button
                    v-if="index === formState.inverters_list.length - 1"
                    type="primary"
                    @click="addInverter"
                    style="margin-right: 8px"
                  >
                    <plus-outlined />
                  </a-button>
                  <a-button
                    v-if="formState.inverters_list.length > 1"
                    danger
                    @click="removeInverter(index)"
                  >
                    <delete-outlined />
                  </a-button>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
        </a-card>

        <!-- Thanh điều khiển và nút bấm -->
        <div class="action-buttons" style="margin-top: 24px; text-align: center;">
          <a-space>
            <a-button type="primary" size="large" @click="createContract">
              <save-outlined />
              Tạo hợp đồng
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
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  ReloadOutlined
} from '@ant-design/icons-vue'

// Dữ liệu ban đầu
const formState = reactive({
  // Thông tin hợp đồng
  code: '',
  name: '',
  image: '',

  // Thông tin người bán
  sale_search: '',
  sale_info: '',
  sale_id: '',

  // Thông tin khách hàng
  customer_code: '',
  customer_name: '',
  customer_phone: '',
  customer_email: '',
  customer_tax_code: '',
  customer_gender: 'true',
  customer_province: '',
  customer_district: '',
  customer_ward: '',
  customer_address: '',

  // Thông tin lắp đặt
  created_at: null,
  installation_type: 'Ongrid',
  phase_type: '1-phase',
  kind: 'contract_quote',

  // Tấm pin
  pv: '',
  pv_number: 0,
  pv_power: 0,
  pv_price: 0,
  pv_gm: 0,
  pv_warranty: 0,

  // Biến tần
  inverters_list: [
    {
      selected: '',
      quantity: 0,
      price: 0
    }
  ]
})

// Dữ liệu mẫu
const provinces = ref(['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng'])
const districts = ref(['Quận 1', 'Quận 2', 'Quận 3'])
const wards = ref(['Phường 1', 'Phường 2', 'Phường 3'])
const pvs = ref([])
const inverters_show = ref([])
const sales = ref([])
const filtered_sales = ref([])
const autoCompleteOptions = computed(() => {
  return filtered_sales.value.map(sale => ({
    value: `${sale.name} (${sale.phone})`,
    sale
  }))
})

// Khởi tạo
onMounted(async () => {
  try {
    await fetchSales()
    await fetchMerchandise()
  } catch (error) {
    message.error('Có lỗi xảy ra khi tải dữ liệu')
    console.error(error)
  }
})

// Các hàm xử lý
const fetchSales = async () => {
  // Thêm code lấy dữ liệu thực tế từ API
  sales.value = [
    { id: 1, name: 'Nguyễn Văn A', phone: '0123456789' },
    { id: 2, name: 'Trần Thị B', phone: '0987654321' }
  ]
}

const fetchMerchandise = async () => {
  // Thêm code lấy dữ liệu thực tế từ API
  pvs.value = [
    { id: 1, name: 'PV Panel 450W', power: 450, price: 2000000 },
    { id: 2, name: 'PV Panel 550W', power: 550, price: 2500000 }
  ]

  inverters_show.value = [
    { id: 1, name: 'Inverter 5kW', price: 15000000 },
    { id: 2, name: 'Inverter 10kW', price: 25000000 }
  ]

  filterMerchandise()
}

const handleSaleSearch = (searchText) => {
  if (!searchText) {
    filtered_sales.value = []
    return
  }

  filtered_sales.value = sales.value.filter(sale =>
    sale.name.toLowerCase().includes(searchText.toLowerCase()) ||
    sale.phone.includes(searchText)
  )
}

const selectSale = (value, option) => {
  const sale = option.sale
  formState.sale_id = sale.id
  formState.sale_info = `${sale.name} (${sale.phone})`
  formState.sale_search = formState.sale_info
  filtered_sales.value = []
}

const filterMerchandise = () => {
  // Đây sẽ là nơi để lọc thiết bị dựa trên loại lắp đặt và pha
  // Ví dụ: inverters_show.value = allInverters.filter(inv => inv.installationType === formState.installation_type)
}

const onPvChange = (value) => {
  const selectedPv = pvs.value.find(pv => pv.id === value)
  if (selectedPv) {
    formState.pv_power = selectedPv.power
    formState.pv_price = selectedPv.price
    calculateAL()
    calculateW()
  }
}

const calculateAL = () => {
  // Thêm code tính toán
}

const calculateW = () => {
  // Thêm code tính toán
}

const calcInvPrice = (value, index) => {
  const selectedInv = inverters_show.value.find(inv => inv.id === value)
  if (selectedInv && index !== undefined) {
    formState.inverters_list[index].price = selectedInv.price
  }
}

const addInverter = () => {
  formState.inverters_list.push({
    selected: '',
    quantity: 0,
    price: 0
  })
}

const removeInverter = (index) => {
  formState.inverters_list.splice(index, 1)
}

const onDateChange = () => {
  // Xử lý khi ngày thay đổi (có thể thêm logic ở đây sau này)
}

const createContract = async () => {
  try {
    // Validate form
    const missingFields = []
    if (!formState.name) missingFields.push('Tên hợp đồng')
    if (!formState.customer_name) missingFields.push('Tên khách hàng')
    if (!formState.customer_phone) missingFields.push('SĐT khách hàng')

    if (missingFields.length > 0) {
      message.error(`Vui lòng điền đầy đủ thông tin: ${missingFields.join(', ')}`)
      return
    }

    // Gửi dữ liệu đi
    message.loading('Đang tạo hợp đồng...')

    // Thêm code gửi dữ liệu thực tế đến API
    // const response = await fetch('API_URL', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formState)
    // })

    // Giả lập thành công
    setTimeout(() => {
      message.success('Tạo hợp đồng thành công!')
    }, 1500)

  } catch (error) {
    message.error('Có lỗi xảy ra khi tạo hợp đồng')
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
}

.inverter-item {
  padding: 8px 0;
  border-bottom: 1px dashed #f0f0f0;
}

.inverter-item:last-child {
  border-bottom: none;
}

:deep(.ant-card-head) {
  background-color: #f5f5f5;
}

:deep(.ant-input-number-handler-wrap) {
  opacity: 1;
}
</style>
