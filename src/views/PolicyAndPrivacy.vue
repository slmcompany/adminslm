<template>
  <div class="privacy-container"
    style="max-width: 900px; margin: 0 auto; padding: 40px 20px; background: #fff; min-height: 100vh;">
    <h1 style="color: #2c3e50; font-size: 28px; margin-bottom: 10px;">{{ title }}</h1>
    <p style="font-style: italic; color: #7f8c8d; margin-bottom: 25px;">{{ lastUpdated }}</p>

    <div style="margin-bottom: 25px;">
      <p>Ứng dụng <span style="font-weight: bold;">{{ appName }}</span> (gọi tắt là "chúng tôi", "ứng dụng") cam
        kết bảo vệ quyền riêng tư và dữ liệu cá nhân của người dùng. Chính sách này giải thích cách chúng tôi
        thu thập, sử dụng và bảo vệ thông tin khi bạn sử dụng ứng dụng.</p>
    </div>

    <div v-for="(section, index) in sections" :key="index" style="margin-bottom: 25px;">
      <h2 style="font-size: 22px; color: #2c3e50; margin-top: 25px; margin-bottom: 15px;">
        <span style="font-weight: bold; margin-right: 8px;">{{ index + 1 }}.</span> {{ section.title }}
      </h2>
      <div v-html="section.content"></div>
    </div>

    <div style="background-color: #f2f7ff; padding: 15px; border-radius: 6px; margin-top: 30px;">
      <h2 style="font-size: 22px; color: #2c3e50; margin-top: 5px; margin-bottom: 15px;">
        <span style="font-weight: bold; margin-right: 8px;">{{ sections.length + 1 }}.</span> {{
          contactSection.title }}
      </h2>
      <div v-html="contactSection.content"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const title = ref('Chính Sách Quyền Riêng Tư');
const lastUpdated = ref('Cập nhật lần cuối: Ngày 09 tháng 12 năm 2025');
const appName = ref('SolarMax');
const contactEmail = ref('sale@slmsolar.com');

const sections = ref([
  {
    title: 'Thông tin chúng tôi thu thập',
    content: `
        <p>Ứng dụng thu thập và lưu trữ các thông tin sau:</p>
        <ul>
            <li>Tên thiết bị (ví dụ: pin năng lượng mặt trời, bộ điều khiển)</li>
            <li>Ngày mua, ngày bắt đầu bảo hành, thời gian hết hạn bảo hành</li>
            <li>Thông tin đơn vị cung cấp (tùy chọn)</li>
            <li><span style="font-weight: bold;">Vị trí địa lý</span> - để xác định vị trí lắp đặt thiết bị và vị trí người dùng để có trải nghiệm sản phẩm tốt nhất</li>
            <li><span style="font-weight: bold;">Hình ảnh</span> - ảnh chụp thiết bị, biên nhận, hóa đơn từ máy ảnh hoặc bộ sưu tập ảnh của bạn</li>
        </ul>
        <p>Tất cả dữ liệu này được <span style="font-weight: bold;">đồng bộ với máy chủ của chúng tôi để lưu trữ thông tin bảo hành</span>, không được chia sẻ cho bất kỳ bên thứ ba nào.</p>
    `
  },
  {
    title: 'Cách chúng tôi sử dụng thông tin',
    content: `
        <p>Chúng tôi sử dụng thông tin thu thập được để:</p>
        <ul>
            <li>Quản lý và theo dõi bảo hành thiết bị của bạn</li>
            <li>Cung cấp dịch vụ hỗ trợ khách hàng hiệu quả</li>
            <li>Cải thiện trải nghiệm người dùng và phát triển ứng dụng</li>
            <li>Gửi thông báo quan trọng liên quan đến bảo hành hoặc cập nhật ứng dụng</li>
        </ul>
    `
  },
  {
    title: 'Chia sẻ dữ liệu',
    content: `
        <p>Chúng tôi <span style="font-weight: bold;">không chia sẻ bất kỳ dữ liệu nào</span> của người dùng cho bên thứ ba.</p>
    `
  },
  {
    title: 'Bảo mật dữ liệu',
    content: `
        <p>Chúng tôi sử dụng các biện pháp bảo mật hợp lý để bảo vệ thông tin của bạn khỏi truy cập trái phép, sử dụng hoặc tiết lộ.</p>
    `
  },
  {
    title: 'Quyền của người dùng',
    content: `
        <p>Bạn có quyền yêu cầu truy cập, chỉnh sửa hoặc xóa thông tin cá nhân của mình. Để thực hiện điều này, vui lòng liên hệ với chúng tôi qua email sale@slmsolar.com.</p>
    `
  },
  {
    title: 'Dành cho trẻ em',
    content: `
        <p>Ứng dụng <span style="font-weight: bold;">không dành cho trẻ em dưới 13 tuổi</span> và không thu thập thông tin cá nhân từ trẻ em.</p>
    `
  },
  {
    title: 'Thay đổi chính sách',
    content: `
        <p>Chính sách này có thể được cập nhật trong tương lai. Người dùng sẽ được thông báo trong ứng dụng nếu có thay đổi lớn liên quan đến quyền riêng tư.</p>
    `
  },
  {
    title: 'Điều khoản xóa tài khoản',
    content: `
        <p style="margin-bottom: 15px;">Ứng dụng SolarMax tôn trọng quyền riêng tư và dữ liệu cá nhân của người dùng. Chúng tôi cung cấp quyền yêu cầu xóa tài khoản theo quy định pháp luật hiện hành, bao gồm Quy định Bảo vệ Dữ liệu (GDPR) và Chính sách Bảo mật của Apple (App Store Guidelines 5.1.1).</p>
        
        <h3 style="font-size: 18px; color: #2c3e50; margin-top: 20px; margin-bottom: 10px; font-weight: bold;">8.1. Nội dung xóa tài khoản</h3>
        <p>Khi người dùng yêu cầu xóa tài khoản, các thông tin sau sẽ bị xóa hoặc ẩn danh khỏi hệ thống:</p>
        <ul>
            <li>Thông tin đăng ký: số điện thoại, email (nếu có), tên</li>
            <li>Thông tin hồ sơ cá nhân</li>
            <li>Lịch sử tương tác trong ứng dụng</li>
            <li>Dữ liệu thống kê không định danh</li>
        </ul>
        
        <h3 style="font-size: 18px; color: #2c3e50; margin-top: 20px; margin-bottom: 10px; font-weight: bold;">8.2. Các dữ liệu được giữ lại</h3>
        <p>Một số dữ liệu có thể cần được giữ lại theo quy định pháp luật, gồm:</p>
        <ul>
            <li>Dữ liệu liên quan đến hóa đơn, bảo hành thiết bị</li>
            <li>Thông tin hợp đồng lắp đặt (nếu có giao dịch với SolarMax hoặc đối tác)</li>
            <li>Dữ liệu cần thiết nhằm ngăn chặn gian lận hoặc lạm dụng hệ thống</li>
        </ul>
        <p>Các dữ liệu này sẽ chỉ được lưu trữ trong khoảng thời gian tối thiểu cần thiết và sẽ không được sử dụng cho mục đích tiếp thị hoặc liên hệ nếu không có sự đồng ý của bạn.</p>
        
        <h3 style="font-size: 18px; color: #2c3e50; margin-top: 20px; margin-bottom: 10px; font-weight: bold;">8.3. Thời gian xử lý</h3>
        <p>Yêu cầu xóa tài khoản sẽ được xử lý trong vòng <span style="font-weight: bold;">5–30 ngày làm việc</span> tùy theo mức độ liên quan tới hợp đồng, dịch vụ và nghĩa vụ pháp lý.</p>
        
        <h3 style="font-size: 18px; color: #2c3e50; margin-top: 20px; margin-bottom: 10px; font-weight: bold;">8.4. Hủy quyền truy cập dịch vụ</h3>
        <p>Sau khi tài khoản được xóa:</p>
        <ul>
            <li>Bạn sẽ không thể đăng nhập bằng thông tin cũ</li>
            <li>Các quyền truy cập lịch sử bảo hành, báo giá, hợp đồng trong ứng dụng sẽ bị hủy</li>
            <li><span style="font-weight: bold;">Hành động này không thể hoàn tác</span></li>
        </ul>
        
        <h3 style="font-size: 18px; color: #2c3e50; margin-top: 20px; margin-bottom: 10px; font-weight: bold;">8.5. Cách gửi yêu cầu xóa tài khoản</h3>
        <p>Người dùng có thể yêu cầu xóa tài khoản thông qua một trong các phương thức sau:</p>
        
        <p style="margin-top: 15px; margin-bottom: 8px;"><span style="font-weight: bold;">Trong ứng dụng SolarMax:</span></p>
        <p style="margin-left: 20px;">Mở: <span style="font-style: italic;">Tài khoản → Bảo mật & Quyền riêng tư → Xóa tài khoản</span></p>
        
        <p style="margin-top: 15px; margin-bottom: 8px;"><span style="font-weight: bold;">Qua email hỗ trợ:</span></p>
        <p style="margin-left: 20px;">Gửi yêu cầu với tiêu đề: <span style="font-style: italic;">"Yêu cầu xóa tài khoản SolarMax"</span></p>
        <p style="margin-left: 20px;">Email: <span style="font-weight: bold;">support@slmsolar.com</span> hoặc <span style="font-weight: bold;">sale@slmsolar.com</span></p>
        
        <p style="margin-top: 15px; margin-bottom: 8px;"><span style="font-weight: bold;">Thông tin cần cung cấp:</span></p>
        <ul>
            <li>Số điện thoại đăng ký</li>
            <li>Họ và tên</li>
            <li>Lý do yêu cầu (không bắt buộc)</li>
        </ul>
        
        <h3 style="font-size: 18px; color: #2c3e50; margin-top: 20px; margin-bottom: 10px; font-weight: bold;">8.6. Thông tin công ty</h3>
        <p><span style="font-weight: bold;">SLM Investment Joint Stock Company</span></p>
        <p>Website: <a href="https://slmsolar.com" target="_blank" style="color: #3498db;">https://slmsolar.com</a></p>
        <p>Email: support@slmsolar.com</p>
        <p>Số điện thoại hỗ trợ: 0394 307 569</p>
        
        <div style="background-color: #fff3cd; padding: 12px; border-radius: 6px; margin-top: 15px; border-left: 4px solid #ffc107;">
            <p style="margin: 0;"><span style="font-weight: bold;">Lưu ý:</span> Bằng việc sử dụng dịch vụ của SolarMax, bạn xác nhận rằng bạn đã đọc và đồng ý với Điều khoản Xóa Tài Khoản này.</p>
        </div>
    `
  }
]);

const contactSection = ref({
  title: 'Liên hệ',
  content: `
    <p>Nếu bạn có bất kỳ câu hỏi nào về chính sách này, vui lòng liên hệ chúng tôi qua email: <span style="font-weight: bold;">${contactEmail.value}</span> hoặc số điện thoại: <span style="font-weight: bold;">0394 307 569</span></p>
    `
});
</script>

<style scoped>
.privacy-container ul {
  padding-left: 20px;
  list-style-type: disc;
}

.privacy-container li {
  margin-bottom: 8px;
}

.privacy-container a {
  text-decoration: none;
}

.privacy-container a:hover {
  text-decoration: underline;
}
</style>