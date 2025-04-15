<template>
    <div>
        <form action="#">
            <table border="solid">
                <tbody>
                    <tr>
                        <td colspan="6" style="">
                            <h1 style="display: flex; flex-direction: column; align-items: center;">Bảng tạo combo trọn
                                gói lắp đặt</h1>
                        </td>
                    </tr>
                    <tr>
                        <td>Mã</td>
                        <td><input type="text" name="code" id="code" v-model="code"></td>
                    </tr>
                    <tr>
                        <td>Tên combo</td>
                        <td><input type="text" name="name" id="name" v-model="name"></td>
                    </tr>
                    <tr>
                        <td>Ảnh combo</td>
                        <td><input type="text" name="image" id="image" v-model="image"></td>
                    </tr>
                    <tr>
                        <td>Chọn hệ lắp đặt</td>
                        <td>
                            <select name="installation_type" id="installation_type" v-model="installation_type"
                                v-on:change="filterMerchandise()">
                                <option value="Ongrid">Ongrid</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>Chọn pha</td>
                        <td>
                            <select name="phase_type" id="phase_type" v-model="phase_type"
                                v-on:change="filterMerchandise()">
                                <option value="1-phase">1 pha</option>
                                <option value="3-phase high voltage">3 pha tần cao</option>
                                <option value="3-phase low voltage">3 pha tần thấp</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>Loại báo giá</td>
                        <td>
                            <select name="kind" id="kind" v-model="kind">
                                <option value="combo">Tạo báo giá combo</option>
                                <option value="contract_quote">Báo giá chi tiết</option>
                                <option value="survey_quote">Báo giá khảo sát</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>Tấm pin mặt trời</td>
                        <td>
                            <select name="pv" id="pv" v-model="pv"
                                v-on:change="reChangePower(), calculateW(), calcPvPrice(pv), calcOutput()">
                                <option v-for="merchandise in pvs" :value="merchandise.id">{{ merchandise.name }}
                                </option>
                            </select>

                        </td>
                        <td>
                            Số lượng:
                            <input type="number" name="" id="" v-model="pv_number" min="0"
                                v-on:change="calculateAL(), calculateW(), calcOutput()">
                        </td>
                        <td>
                            Công suất:
                            <input type="number" name="" id="" v-model="pv_power" min="0" v-on:change="calculateAL()">
                        </td>
                        <td>
                            Giá:
                            <input type="number" name="" id="" v-model="pv_price" min="0" v-on:change="">
                        </td>
                        <td>
                            GM:
                            <input type="number" name="" id="" v-model="pv_gm" min="0" v-on:change="">
                        </td>
                    </tr>
                    <tr>
                        <td>Sản lượng</td>
                        <td>
                            Min: <input type="number" name="output_min" id="output_min" v-model="output_min"
                                placeholder="Sản lượng tối thiểu"><br>
                            Max: <input type="number" name="output_max" id="output_max" v-model="output_max"
                                placeholder="Sản lượng tối đa"><br>
                        </td>
                    </tr>

                    <tr>
                        <td>Biến tần</td>
                        <td>
                            <div v-for="(inverter, index) in inverters_list" :key="index" style="margin-bottom: 10px;">
                                Loại:
                                <select v-model="inverter.selected" v-on:change="calcInvPrice(inverter.selected)">
                                    <option v-for="merchandise in inverters_show" :value="merchandise.id">
                                        {{ merchandise.name }}
                                    </option>
                                </select><br>
                                Số lượng:
                                <input type="number" v-model="inverter.quantity" placeholder="Số lượng" min="0"><br>
                                Giá/đơn vị:
                                <input type="number" v-model="inverter.price" placeholder="Giá" min="0"><br>
                                GM:
                                <input type="number" v-model="inverter.gm" placeholder="GM" min="0"><br>
                                <button type="button" @click="removeInverter(index)">Xóa</button>
                            </div>
                            <button type="button" @click="addInverter">Thêm Biến tần</button>
                        </td>
                    </tr>
                    <tr>
                        <td>Pin lưu trữ</td>
                        <td>
                            <div v-for="(battery, index) in batteries_list" :key="index" style="margin-bottom: 10px;">
                                Loại:
                                <select v-model="battery.selected" v-on:change="calcBaPrice(battery.selected)">
                                    <option v-for="merchandise in batteries_show" :value="merchandise.id">
                                        {{ merchandise.name }}
                                    </option>
                                </select><br>
                                Số lượng:
                                <input type="number" v-model="battery.quantity" placeholder="Số lượng" min="0"><br>
                                Giá/đơn vị:
                                <input type="number" v-model="battery.price" placeholder="Giá" min="0"><br>
                                GM:
                                <input type="number" v-model="battery.gm" placeholder="GM" min="0"><br>
                                <button type="button" @click="removeBattery(index)">Xóa</button>
                            </div>
                            <button type="button" @click="addBattery">Thêm Pin lưu trữ</button>
                        </td>
                    </tr>
                    <tr>
                        <td>Loại mái</td>
                        <td>
                            <select v-model="aluminums_frame_installation_type" v-on:change="filterMerchandise()">
                                <option :value="'All'">Tất cả các loại mái</option>
                                <option :value="'Áp mái tôn'">Áp mái tôn</option>
                                <option :value="'Mái ngói'">Áp mái ngói</option>
                                <option :value="'Khung sắt'">Khung sắt</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>Hệ khung nhôm</td>
                        <td>
                            <div v-for="(frame, index) in aluminums_frames_list" :key="index"
                                style="margin-bottom: 10px;">
                                Loại: <select v-model="frame.selected" v-on:change="calculateAL(), calcFramePrice()">
                                    <option v-for="merchandise in aluminums_frames_show" :value="merchandise.id">
                                        {{ merchandise.name }}
                                    </option>
                                </select><br>
                                Số lương(Cái): <input type="number" v-model="frame.quantity" placeholder="Số lượng"><br>
                                Giá/đơn vị: <input type="number" v-model="frame.price" placeholder="Giá"><br>
                                GM: <input type="number" name="" id="" v-model="frame.gm" min="0" v-on:change="">
                                <button type="button" @click="removeAluminumFrame(index)">Xóa</button>
                            </div>
                            <button type="button" @click="addAluminumFrame">Thêm Hệ khung nhôm</button>
                        </td>
                    </tr>
                    <tr>
                        <td>Dây cáp DC/AC</td>
                        <td>
                            <div v-for="(cable, index) in dc_ac_cables_list" :key="index" style="margin-bottom: 10px;">
                                Loại: <select v-model="cable.selected" v-on:change="calculateW(), calcCablePrice()">
                                    <option v-for="merchandise in dc_ac_cables_show" :value="merchandise.id">
                                        {{ merchandise.name }}
                                    </option>
                                </select><br>
                                Số lượng: <input type="number" v-model="cable.quantity" placeholder="Số lượng"><br>
                                Giá/đơn vị: <input type="number" v-model="cable.price" placeholder="Giá"><br>
                                GM: <input type="number" name="" id="" v-model="cable.gm" min="0" v-on:change="">
                                <button type="button" @click="removeDcAcCable(index)">Xóa</button>
                            </div>
                            <button type="button" @click="addDcAcCable">Thêm Dây cáp DC/AC</button>
                        </td>
                    </tr>
                    <tr>
                        <td>Tủ Điện NLMT</td>
                        <td>

                            <select v-model="solar_panel_cabinet" v-on:change="calcCabinetPrice(solar_panel_cabinet)">
                                <option v-for="merchandise in solar_panel_cabinets_show" :value="merchandise.id">{{
                                    merchandise.name }}</option>
                            </select>
                        </td>
                        <td>
                            Số lượng:
                            <input type="number" name="" id="" v-model="solar_panel_cabinet_number">
                        </td>
                        <td>
                            Giá:
                            <input type="number" name="" id="" v-model="solar_panel_cabinet_price">
                        </td>
                        <td>
                            GM:
                            <input type="number" name="" id="" v-model="solar_panel_cabinet_gm">
                        </td>
                    </tr>
                    <tr>
                        <td>Hệ tiếp địa</td>
                        <td>
                            <div v-for="(grounding, index) in grounding_systems_list" :key="index"
                                style="margin-bottom: 10px;">
                                Loại:
                                <select v-model="grounding.selected"
                                    v-on:change="calcGroundSystemPrice(grounding.selected)">
                                    <option v-for="merchandise in grounding_systems" :value="merchandise.id">
                                        {{ merchandise.name }}
                                    </option>
                                </select><br>
                                Số lượng: <input type="number" v-model="grounding.quantity" placeholder="Số lượng"><br>
                                Giá/đơn vị: <input type="number" v-model="grounding.price" placeholder="Giá"><br>
                                GM: <input type="number" v-model="grounding.gm" min="0"><br>
                                <button type="button" @click="removeGroundingSystem(index)">Xóa</button>
                            </div>
                            <button type="button" @click="addGroundingSystem">Thêm Hệ tiếp địa</button>
                        </td>
                    </tr>
                    <tr>
                        <td>Trọn gói lắp đặt</td>
                        <td>
                            <div v-for="(installation, index) in installation_packages_list" :key="index"
                                style="margin-bottom: 10px;">
                                Loại:
                                <select v-model="installation.selected"
                                    v-on:change="calcInstallationPrice(installation.selected)">
                                    <option v-for="merchandise in installation_packages" :value="merchandise.id">
                                        {{ merchandise.name }}
                                    </option>
                                </select><br>
                                Số lượng: <input type="number" v-model="installation.quantity"
                                    placeholder="Số lượng"><br>
                                Giá/đơn vị: <input type="number" v-model="installation.price" placeholder="Giá"><br>
                                GM: <input type="number" v-model="installation.gm" min="0"><br>
                                <button type="button" @click="removeInstallationPackage(index)">Xóa</button>
                            </div>
                            <button type="button" @click="addInstallationPackage()">Thêm Trọn gói lắp đặt</button>
                        </td>
                    </tr>
                    <tr>
                        <td>Tổng tiền</td>
                        <td><input type="text" name="total_price" id="total_price" v-model="total_price"></td>
                    </tr>
                    <tr>
                        <td>GM trung bình</td>
                        <td><input type="text" name="total_price" id="total_price" v-model="total_gm"></td>
                    </tr>
                    <tr>
                        <td>
                            <button type="button" v-on:click="calculateTotalPrice()">Tính tổng tiền</button>
                            <button type="button" v-on:click="calculateTotalGM()">Tính GM trung bình</button>
                            <button type="button" v-on:click="roundUpTotalPrice()">Làm tròn tổng giá trị</button>
                        </td>
                        <td>
                            <button type="button" @click="createCombo()">Tạo combo</button>
                        </td>
                        <!-- <td>
                            <button type="button" @click="calculateAL()">Tính số lượng nhôm</button>
                        </td> -->
                    </tr>
                </tbody>
            </table>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { toRaw } from 'vue';
// const CONST_HOST = "http://localhost:8080"
const CONST_HOST = "https://id.slmsolar.com"

const code = ref('')
const name = ref('')

const total_price = ref(0)
const total_gm = ref(0)
const kind = ref('combo')
const pv = ref(0)
const output_min = ref(0)
const output_max = ref(0)
const calcOutput = () => {
    for (let i = 0; i < pvs.value.length; i++) {
        // sản lượng tối đa bằng bằng số tấm pin nhân với công suất một tấm rồi nhân với 3.5
        if (pv.value === pvs.value[i].id) {
            if (installation_type.value === 'Hybrid') {
                output_max.value = pvs.value[i].data_json.power_watt * pv_number.value * 4 * 30 / 1000
                output_min.value = pvs.value[i].data_json.power_watt * pv_number.value * 3.5 * 30 / 1000
                break
            }
            output_max.value = pvs.value[i].data_json.power_watt * pv_number.value * 3.5 * 30 / 1000
            output_min.value = pvs.value[i].data_json.power_watt * pv_number.value * 3 * 30 / 1000
            // làm tròn đến hàng chục max thì làm tròn lên còn min thì làm tròn xuống
            output_max.value = Math.ceil(output_max.value / 10) * 10
            output_min.value = Math.floor(output_min.value / 10) * 10
            break
        }
    }
}
const solar_panel_cabinet = ref(0)

const installation_type = ref('Ongrid')
const phase_type = ref('1-phase')
const aluminums_frame_installation_type = ref('All')
const image = ref('')

const pv_price = ref(0)
const solar_panel_cabinet_price = ref(0)

const pv_gm = ref(0)
const solar_panel_cabinet_gm = ref(0)
const grounding_system_gm = ref(0)
const installation_package_gm = ref(0)

const pv_power = ref(0)
const getMerchandiseById = (id) => {
    for (let merchandise of merchandises.value) {
        if (merchandise.id === id) {
            console.log('đi qua đây')
            return merchandise;
        }
    }
    return null
}

const calcPvPrice = (id) => {
    let merchandise = getMerchandiseById(id)
    if (merchandise != null) {
        pv_gm.value = merchandise.template.gm
        if (merchandise.price_infos.length != 0) {
            pv_price.value = merchandise.price_infos[0].import_price_include_vat
        }

    }
}

const calcInvPrice = (id) => {
    let merchandise = getMerchandiseById(id);
    if (merchandise != null) {
        const warranty = merchandise.data_json?.warranty_years || 0; // Lấy thời gian bảo hành mặc định
        inverters_list.value.forEach((inverter) => {
            if (inverter.selected === id) {
                inverter.warranty_years = warranty; // Gán thời gian bảo hành mặc định
                if (merchandise.price_infos.length != 0) {
                    inverter.price = merchandise.price_infos[0].import_price_include_vat;
                }
            }
        });
    }
};
const calcBaPrice = (id) => {
    let merchandise = getMerchandiseById(id);
    if (merchandise != null) {
        const warranty = merchandise.data_json?.warranty_years || 0; // Lấy thời gian bảo hành mặc định
        batteries_list.value.forEach((battery) => {
            if (battery.selected === id) {
                battery.warranty_years = warranty; // Gán thời gian bảo hành mặc định
                if (merchandise.price_infos.length != 0) {
                    battery.price = merchandise.price_infos[0].import_price_include_vat;
                }
            }
        });
    }
};

const calcFramePrice = () => {
    for (let j = 0; j < aluminums_frames_list.value.length; j++) {
        let selectedId = aluminums_frames_list.value[j].selected; // ID của vật tư được chọn
        for (let i = 0; i < aluminums_frames.value.length; i++) {
            if (selectedId === aluminums_frames.value[i].id) {
                // Lấy giá từ danh sách `aluminums_frames`
                let priceInfo = aluminums_frames.value[i].price_infos;
                let gm = aluminums_frames.value[i].template.gm
                if (priceInfo && priceInfo.length > 0) {
                    if (aluminums_frames_list.value[j].price === 0) {
                        aluminums_frames_list.value[j].price = priceInfo[0].import_price_include_vat;
                    }
                } else {
                    if (aluminums_frames_list.value[j].price === 0) {
                        aluminums_frames_list.value[j].price = 0;
                    }
                }
                aluminums_frames_list.value[j].gm = gm
                break;
            }
        }
    }
};

const calcCablePrice = () => {
    for (let j = 0; j < dc_ac_cables_list.value.length; j++) {
        let selectedId = dc_ac_cables_list.value[j].selected; // ID của vật tư được chọn
        for (let i = 0; i < dc_ac_cables.value.length; i++) {
            if (selectedId === dc_ac_cables.value[i].id) {
                // Lấy giá từ danh sách `dc_ac_cables`
                let priceInfo = dc_ac_cables.value[i].price_infos;
                let gm = dc_ac_cables.value[i].template.gm
                if (priceInfo && priceInfo.length > 0) {
                    if (dc_ac_cables_list.value[j].price === 0) {
                        dc_ac_cables_list.value[j].price = priceInfo[0].import_price_include_vat;
                    }
                } else {
                    if (dc_ac_cables_list.value[j].price === 0) {
                        dc_ac_cables_list.value[j].price = 0; // Nếu không có giá, đặt về 0
                    }
                }
                dc_ac_cables_list.value[j].gm = gm
                break;
            }
        }
    }
};

const calcCabinetPrice = (id) => {
    let merchandise = getMerchandiseById(id)
    if (merchandise != null) {
        solar_panel_cabinet_gm.value = merchandise.template.gm
        if (merchandise.price_infos.length != 0) {
            solar_panel_cabinet_price.value = merchandise.price_infos[0].import_price_include_vat
        }

    }
}
const calcGroundSystemPrice = (id) => {
    let merchandise = getMerchandiseById(id)
    if (merchandise != null) {
        grounding_system_gm.value = merchandise.template.gm
        if (merchandise.price_infos.length != 0) {
            grounding_systems_list.value.forEach(
                (grounding) => {
                    if (grounding.selected === id) {
                        console.log('có giá')
                        grounding.warranty_years = merchandise.data_json.warranty_years
                        if (merchandise.price_infos.length != 0) {
                            grounding.price = merchandise.price_infos[0].import_price_include_vat;
                        }
                    }
                }
            );
        }

    }
}

const calcInstallationPrice = (id) => {
    let merchandise = getMerchandiseById(id)
    if (merchandise != null) {
        installation_package_gm.value = merchandise.template.gm
        // Thêm phần bảo hành mặc định cho cho gói lắp đặt
        installation_package_gm.value = merchandise.template.gm;
        installation_packages_list.value.forEach((installation) => {
            if (installation.selected === id) {
                if (merchandise.price_infos.length != 0) {
                    installation.price = merchandise.price_infos[0].import_price_include_vat
                }
            }

        });
    }
}
const reChangePower = () => {
    for (let i = 0; i < pvs.value.length; i++) {
        if (pv.value === pvs.value[i].id) {
            pv_power.value = pvs.value[i].data_json.power_watt
            break
        }
    }
}

const merchandises = ref([])
const pvs = ref([])
const inverters = ref([])
const inverters_show = ref([])
const batteries = ref([])
const batteries_show = ref([])
const aluminums_frames = ref([])
const aluminums_frames_show = ref([])

const pv_number = ref(0)
const inverter_number = ref(0)
const battery_number = ref(0)
const solar_panel_cabinet_number = ref(0)


// Mảng lưu danh sách các "Hệ khung nhôm"
const aluminums_frames_list = ref([])
// Mảng lưu danh sách các "Dây cáp DC/AC"
const dc_ac_cables_list = ref([])
// Mảng lưu danh sách các "Hệ tiếp địa"
const grounding_systems_list = ref([]);
// Mảng lưu danh sách các "Trọn gói lắp đặt"
const installation_packages_list = ref([]);

const inverters_list = ref([]); // Mảng lưu danh sách các biến tần
const batteries_list = ref([]); // Mảng lưu danh sách các pin lưu trữ

const dc_ac_cables = ref([])
const dc_ac_cables_show = ref([])
const solar_panel_cabinets = ref([])
const solar_panel_cabinets_show = ref([])
const grounding_systems = ref([])
const installation_packages = ref([])

const calculateTotalPrice = () => {
    let total = 0;

    // Tính giá cho tấm pin mặt trời
    total += pv_number.value * pv_price.value / (1 - pv_gm.value / 100);

    // Tính giá cho từng biến tần
    for (let i = 0; i < inverters_list.value.length; i++) {
        const inverter = inverters_list.value[i];
        total += inverter.quantity * inverter.price / (1 - inverter.gm / 100);
    }

    // Tính giá cho từng pin lưu trữ
    for (let i = 0; i < batteries_list.value.length; i++) {
        const battery = batteries_list.value[i];
        total += battery.quantity * battery.price / (1 - battery.gm / 100);
    }

    // Tính giá cho tủ điện NLMT
    total += solar_panel_cabinet_number.value * solar_panel_cabinet_price.value / (1 - solar_panel_cabinet_gm.value / 100);

    // Tính giá cho từng vật tư trong Hệ khung nhôm
    for (let i = 0; i < aluminums_frames_list.value.length; i++) {
        const frame = aluminums_frames_list.value[i];
        total += frame.quantity * frame.price / (1 - frame.gm / 100);
    }

    // Tính giá cho từng vật tư trong Dây cáp DC/AC
    for (let i = 0; i < dc_ac_cables_list.value.length; i++) {
        const cable = dc_ac_cables_list.value[i];
        total += cable.quantity * cable.price / (1 - cable.gm / 100);
    }
    // Tính giá cho từng vật tư trong Hệ tiếp địa
    for (let i = 0; i < grounding_systems_list.value.length; i++) {
        const grounding = grounding_systems_list.value[i];
        total += grounding.quantity * grounding.price / (1 - grounding.gm / 100);
    }

    // Tính giá cho từng vật tư trong Trọn gói lắp đặt
    for (let i = 0; i < installation_packages_list.value.length; i++) {
        const installation = installation_packages_list.value[i];
        total += installation.quantity * installation.price / (1 - installation.gm / 100);
    }

    // Gán tổng tiền vào biến `total_price`
    total_price.value = total.toFixed(2); // Làm tròn đến 2 chữ số thập phân
};

const calculateTotalGM = () => {
    let totalGMValue = 0; // Tổng GM * Giá trị
    let totalValue = 0;   // Tổng giá trị của toàn bộ combo

    // Tính GM và giá trị cho tấm pin mặt trời
    totalGMValue += pv_number.value * pv_price.value * ((pv_gm.value / 100) / (1 - pv_gm.value / 100));
    totalValue += pv_number.value * pv_price.value;

    // Tính GM và giá trị cho từng biến tần
    for (let i = 0; i < inverters_list.value.length; i++) {
        const inverter = inverters_list.value[i];
        totalGMValue += inverter.quantity * inverter.price * (inverter.gm / 100) / (1 - inverter.gm / 100);
        totalValue += inverter.quantity * inverter.price;
    }

    // Tính GM và giá trị cho từng pin lưu trữ
    for (let i = 0; i < batteries_list.value.length; i++) {
        const battery = batteries_list.value[i];
        totalGMValue += battery.quantity * battery.price * (battery.gm / 100) / (1 - battery.gm / 100);
        totalValue += battery.quantity * battery.price;
    }

    // Tính GM và giá trị cho tủ điện NLMT
    totalGMValue += solar_panel_cabinet_number.value * solar_panel_cabinet_price.value * (solar_panel_cabinet_gm.value / 100) / (1 - solar_panel_cabinet_gm.value / 100);
    totalValue += solar_panel_cabinet_number.value * solar_panel_cabinet_price.value;

    // Tính GM và giá trị cho từng vật tư trong Hệ khung nhôm
    for (let i = 0; i < aluminums_frames_list.value.length; i++) {
        const frame = aluminums_frames_list.value[i];
        totalGMValue += frame.quantity * frame.price * (frame.gm / 100) / (1 - frame.gm / 100);
        totalValue += frame.quantity * frame.price;
    }

    // Tính GM và giá trị cho từng vật tư trong Dây cáp DC/AC
    for (let i = 0; i < dc_ac_cables_list.value.length; i++) {
        const cable = dc_ac_cables_list.value[i];
        totalGMValue += cable.quantity * cable.price * (cable.gm / 100) / (1 - cable.gm / 100);
        totalValue += cable.quantity * cable.price;
    }
    // Tính GM và giá trị cho từng vật tư trong Hệ tiếp địa
    for (let i = 0; i < grounding_systems_list.value.length; i++) {
        const grounding = grounding_systems_list.value[i];
        totalGMValue += grounding.quantity * grounding.price * (grounding.gm / 100) / (1 - grounding.gm / 100);
        totalValue += grounding.quantity * grounding.price;
    }

    // Tính GM và giá trị cho từng vật tư trong Trọn gói lắp đặt
    for (let i = 0; i < installation_packages_list.value.length; i++) {
        const installation = installation_packages_list.value[i];
        totalGMValue += installation.quantity * installation.price * (installation.gm / 100) / (1 - installation.gm / 100);
        totalValue += installation.quantity * installation.price;
    }

    // Tính GM trung bình
    if (totalValue > 0) {
        total_gm.value = 100 - (totalValue / (totalValue + totalGMValue) * 100).toFixed(2); // Làm tròn đến 2 chữ số thập phân
    } else {
        total_gm.value = 0; // Nếu không có giá trị, GM trung bình là 0
    }
};

const roundUpTotalPrice = () => {
    const roundedValue = Math.ceil(total_price.value / 10000) * 10000;
    total_price.value = roundedValue.toFixed(2); // Làm tròn đến 2 chữ số thập phân
};

const createCombo = async () => {
    const sendingArray = [
        {
            merchandise_id: pv.value,
            quantity: pv_number.value,
            price: pv_price.value,
            gm: pv_gm.value
        },
        {
            merchandise_id: solar_panel_cabinet.value,
            quantity: solar_panel_cabinet_number.value,
            price: solar_panel_cabinet_price.value,
            gm: solar_panel_cabinet_gm.value
        }
    ];
    for (let i = 0; i < inverters_list.value.length; i++) {
        const item = toRaw(inverters_list.value[i]);
        sendingArray.push({
            merchandise_id: item.selected,
            quantity: item.quantity,
            price: item.price,
            gm: item.gm
        });
    }
    if (installation_type.value === 'Hybrid') {
        for (let i = 0; i < batteries_list.value.length; i++) {
            const item = toRaw(batteries_list.value[i]);
            sendingArray.push({
                merchandise_id: item.selected,
                quantity: item.quantity,
                price: item.price,
                gm: item.gm
            });
        }
    }
    for (let i = 0; i < aluminums_frames_list.value.length; i++) {
        const item = toRaw(aluminums_frames_list.value[i]);
        sendingArray.push({
            merchandise_id: item.selected,
            quantity: item.quantity,
            price: item.price,
            gm: item.gm
        });
    }
    for (let i = 0; i < dc_ac_cables_list.value.length; i++) {
        const item = toRaw(dc_ac_cables_list.value[i]);
        sendingArray.push({
            merchandise_id: item.selected,
            quantity: item.quantity,
            price: item.price,
            gm: item.gm
        })
    }
    for (let i = 0; i < grounding_systems_list.value.length; i++) {
        const item = toRaw(grounding_systems_list.value[i]);
        sendingArray.push({
            merchandise_id: item.selected,
            quantity: item.quantity,
            price: item.price,
            gm: item.gm
        });
    }

    for (let i = 0; i < installation_packages_list.value.length; i++) {
        const item = toRaw(installation_packages_list.value[i]);
        sendingArray.push({
            merchandise_id: item.selected,
            quantity: item.quantity,
            price: item.price,
            gm: item.gm
        });
    }
    const sendingData = {
        description: null,
        code: code.value,
        name: name.value,
        status: 'accepted',
        installation_type: installation_type.value,
        total_price: total_price.value,
        kind: 'combo',
        image: image.value,
        phase_type: phase_type.value,
        output_min: output_min.value,
        output_max: output_max.value,
        list_pre_quote_merchandise: sendingArray
    }
    console.log(JSON.stringify(sendingData))
    const response = await fetch(CONST_HOST + '/api/pre_quote/combo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendingData)
    })
    if (response.ok) {
        const data = await response.json()
        console.log(data)
    } else {
        // Lấy thông tin lỗi từ phản hồi
        const errorData = await response.json();
        console.error('Failed to create combo:', errorData);
        window.alert(`Tạo không thành công: ${errorData.message || 'Lỗi không xác định'}`);
    }
}
const getAllMerchandises = async () => {
    const response = await fetch(CONST_HOST + '/api/products', {
        method: 'GET',
    }
    )
    if (response.ok) {
        const data = await response.json()
        merchandises.value = data
        console.log(data)
    } else {
        console.error('Failed to create merchandise')
    }
    sortData()
    filterMerchandise()
}
// Hàm thêm một mục "Dây cáp DC/AC"
const addDcAcCable = () => {
    dc_ac_cables_list.value.push({ selected: null, quantity: 1, price: 0, gm: 10 })
}

// Hàm xóa một mục "Dây cáp DC/AC"
const removeDcAcCable = (index) => {
    dc_ac_cables_list.value.splice(index, 1)
}
// Hàm thêm một mục "Hệ khung nhôm"
const addAluminumFrame = () => {
    aluminums_frames_list.value.push({ selected: null, quantity: 1, price: 0, gm: 10 })
}

// Hàm xóa một mục "Hệ khung nhôm"
const removeAluminumFrame = (index) => {
    aluminums_frames_list.value.splice(index, 1)
}
const addGroundingSystem = () => {
    grounding_systems_list.value.push({ selected: null, quantity: 1, price: 0, gm: 10 });
};

const removeGroundingSystem = (index) => {
    grounding_systems_list.value.splice(index, 1);
};

const addInstallationPackage = () => {
    installation_packages_list.value.push({ selected: null, quantity: 1, price: 0, gm: 10 });
};

const removeInstallationPackage = (index) => {
    installation_packages_list.value.splice(index, 1);
};
// Hàm thêm một mục "Pin lưu trữ"
const addBattery = () => {
    batteries_list.value.push({ selected: null, quantity: 1, price: 0, gm: 10 });
};

// Hàm xóa một mục "Pin lưu trữ"
const removeBattery = (index) => {
    batteries_list.value.splice(index, 1);
};

// Hàm thêm một mục "Biến tần"
const addInverter = () => {
    inverters_list.value.push({ selected: null, quantity: 1, price: 0, gm: 10 });
};

// Hàm xóa một mục "Biến tần"
const removeInverter = (index) => {
    inverters_list.value.splice(index, 1);
};
for (let i = 0; i < grounding_systems_list.value.length; i++) {
    const item = toRaw(grounding_systems_list.value[i]);
    sendingArray.push({
        merchandise_id: item.selected,
        quantity: item.quantity,
        price: item.price,
        gm: item.gm
    });
}

for (let i = 0; i < installation_packages_list.value.length; i++) {
    const item = toRaw(installation_packages_list.value[i]);
    sendingArray.push({
        merchandise_id: item.selected,
        quantity: item.quantity,
        price: item.price,
        gm: item.gm
    });
}

const calculateAL = () => {
    for (let j = 0; j < aluminums_frames_list.value.length; j++) {
        let al_id = aluminums_frames_list.value[j].selected
        for (let i = 0; i < aluminums_frames.value.length; i++) {
            if (al_id === aluminums_frames.value[i].id) {
                let al_code = aluminums_frames.value[i].code
                if (al_code.includes('HE_KHUNG_GIA_DO_NHOM_KEP_BIEN')) {
                    // aluminums_frames_list.value[j].quantity = (pv_number.value / 5 + (pv_number.value % 5 === 0 ? 0 : 1)) * 4 + 4
                    aluminums_frames_list.value[j].quantity = Math.ceil(pv_number.value / 5) * 4 + 4
                }
                if (al_code === 'HE_KHUNG_GIA_DO_NHOM_KEP_GIUA') {
                    aluminums_frames_list.value[j].quantity = Math.ceil(pv_number.value / 5) * 8 + 4
                }
                if (al_code === 'HE_KHUNG_GIA_DO_NHOM_THANH_FULL_RAIL') {
                    aluminums_frames_list.value[j].quantity = Math.ceil(pv_number.value * 1.2 * 2 / 4)
                }
                if (al_code === 'HE_KHUNG_GIA_DO_NHOM_THANH_NOI_NHOM') {
                    aluminums_frames_list.value[j].quantity = Math.ceil(pv_number.value * 1.2 * 2 / 4) * 2 + 4
                }
                if (al_code === 'HE_KHUNG_GIA_DO_NHOM_CHAN_L') {
                    aluminums_frames_list.value[j].quantity = Math.ceil(pv_number.value * 1.2 * 2 / 4) * 4
                }
                if (al_code === 'HE_KHUNG_GIA_DO_NHOM_KEP_TIEP_DIA') {
                    aluminums_frames_list.value[j].quantity = Math.ceil(pv_number.value / 5)
                }
                if (al_code === 'HE_KHUNG_GIA_DO_NHOM_LA_TIEP_DIA') {
                    aluminums_frames_list.value[j].quantity = Math.ceil(pv_number.value / 5) * 8 + 4 / 2
                }
            }
        }
    }
}
const calculateW = () => {
    for (let j = 0; j < dc_ac_cables_list.value.length; j++) {
        let cable_id = dc_ac_cables_list.value[j].selected
        for (let i = 0; i < dc_ac_cables.value.length; i++) {
            if (cable_id === dc_ac_cables.value[i].id) {
                let cable_code = dc_ac_cables.value[i].code
                let power = pv_number.value * pv_power.value / 1000

                if (cable_code.includes('HE_DAY_DIEN_DAY_DC_DEN_4_0')) {
                    if (power >= 5 && power <= 7) {
                        dc_ac_cables_list.value[j].quantity = 60
                    }
                    if (power >= 7 && power <= 9) {
                        dc_ac_cables_list.value[j].quantity = 80
                    }
                    if (power >= 9 && power <= 15) {
                        dc_ac_cables_list.value[j].quantity = 120
                    }
                    if (power >= 15 && power <= 20) {
                        dc_ac_cables_list.value[j].quantity = 150
                    }
                    if (power >= 20 && power <= 30) {
                        dc_ac_cables_list.value[j].quantity = 180
                    }
                }
                if (cable_code.includes('HE_DAY_DIEN_DAY_DC_DO_4_0')) {
                    if (power >= 5 && power <= 7) {
                        dc_ac_cables_list.value[j].quantity = 60
                    }
                    if (power >= 7 && power <= 9) {
                        dc_ac_cables_list.value[j].quantity = 80
                    }
                    if (power >= 9 && power <= 15) {
                        dc_ac_cables_list.value[j].quantity = 120
                    }
                    if (power >= 15 && power <= 20) {
                        dc_ac_cables_list.value[j].quantity = 150
                    }
                    if (power >= 20 && power <= 30) {
                        dc_ac_cables_list.value[j].quantity = 180
                    }
                }
                if (cable_code.includes('HE_DAY_DIEN_DAY_AC')) {
                    dc_ac_cables_list.value[j].quantity = 20
                }
                if (cable_code.includes('HE_DAY_DIEN_DAY_TIN_HIEU')) {
                    dc_ac_cables_list.value[j].quantity = 1
                }
                if (cable_code.includes('HE_DAY_DIEN_JACK_MC4')) {
                    if (power >= 5 && power <= 7) {
                        dc_ac_cables_list.value[j].quantity = 4
                    }
                    if (power >= 7 && power <= 9) {
                        dc_ac_cables_list.value[j].quantity = 4
                    }
                    if (power >= 9 && power <= 15) {
                        dc_ac_cables_list.value[j].quantity = 6
                    }
                    if (power >= 15 && power <= 20) {
                        dc_ac_cables_list.value[j].quantity = 8
                    }
                    if (power >= 20 && power <= 30) {
                        dc_ac_cables_list.value[j].quantity = 10
                    }
                }
            }
        }
    }
}
const filterMerchandise = () => {
    inverters_show.value = inverters.value.filter(item => (item.data_json.phase_type.includes(phase_type.value) &&
        item.data_json.installation_type.includes(installation_type.value)))
    batteries_show.value = batteries.value.filter(item => item.data_json.phase_type.includes(phase_type.value) && installation_type.value === 'Hybrid')
    aluminums_frames_show.value = aluminums_frames.value.filter(item => {
        if (aluminums_frame_installation_type.value === 'All') return true;
        return item.data_json.installation_type.includes(aluminums_frame_installation_type.value);
    });
    dc_ac_cables_show.value = dc_ac_cables.value.filter(item => item.data_json.phase_type.includes(phase_type.value))
    solar_panel_cabinets_show.value = solar_panel_cabinets.value.filter(item => item.data_json.phase_type.includes(phase_type.value))
}
const sortData = () => {
    pvs.value = merchandises.value.filter(item => item.template.code === 'PIN_PV')
    inverters.value = merchandises.value.filter(item => item.template.code === 'INVERTER_DC_AC')
    batteries.value = merchandises.value.filter(item => item.template.code === 'BATTERY_STORAGE')
    aluminums_frames.value = merchandises.value.filter(item => item.template.code === 'ALUMINUM_FRAME')
    dc_ac_cables.value = merchandises.value.filter(item => item.template.code === 'DC_AC_CABLE')
    solar_panel_cabinets.value = merchandises.value.filter(item => item.template.code === 'SOLAR_PANEL_CABINET')
    grounding_systems.value = merchandises.value.filter(item => item.template.code === 'GROUNDING_SYSTEM')
    installation_packages.value = merchandises.value.filter(item => item.template.code === 'INSTALLATION_PACKAGE')
}

onMounted(() => {
    getAllMerchandises()
})
</script>

<style lang="css" scoped>
td {
    white-space: nowrap;
    /* Không cho xuống dòng */
    width: 150px;
    /* Đặt độ rộng tùy chỉnh */
}
</style>