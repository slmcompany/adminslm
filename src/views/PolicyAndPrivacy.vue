<template style="align-items: center;">
  <div
    style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); width: 1024px; margin: 20px auto;">
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
const lastUpdated = ref('Cập nhật lần cuối: Ngày 7 tháng 4 năm 2024');
const appName = ref('SLM App');
const contactEmail = ref('sale@slmsolar.com');

const sections = ref([
  {
    title: 'Thông tin chúng tôi thu thập',
    content: `
        <p>Chúng tôi <span class="highlight">không thu thập dữ liệu cá nhân nhạy cảm</span> như danh tính, vị trí, danh bạ hoặc hình ảnh của người dùng.</p>
        <p>Ứng dụng chỉ lưu trữ các thông tin sau:</p>
        <ul>
            <li>Tên thiết bị (ví dụ: pin năng lượng mặt trời, bộ điều khiển)</li>
            <li>Ngày mua, ngày bắt đầu bảo hành, thời gian hết hạn bảo hành</li>
        <li>Thông tin đơn vị cung cấp (tùy chọn)</li>
        </ul>
        <p>Tất cả dữ liệu này được <span class="highlight">đồng bộ với máy chủ của chúng tôi chứa thông tin bảo hành bạn</span>, không được gửi đi bất kỳ máy chủ nào khác bên thứ ba.</p>
    `
  },
  {
    title: 'Quyền truy cập của ứng dụng',
    content: `
        <p>Ứng dụng không yêu cầu quyền truy cập vào vị trí, camera, micro, bộ nhớ ngoài hoặc bất kỳ dữ liệu nào khác trên thiết bị của bạn.</p>
    `
  },
  {
    title: 'Chia sẻ dữ liệu',
    content: `
        <p>Chúng tôi <span class="highlight">không chia sẻ bất kỳ dữ liệu nào</span> của người dùng cho bên thứ ba.</p>
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
        <p>Ứng dụng <span class="highlight">không dành cho trẻ em dưới 13 tuổi</span> và không thu thập thông tin cá nhân từ trẻ em.</p>
    `
  },
  {
    title: 'Thay đổi chính sách',
    content: `
        <p>Chính sách này có thể được cập nhật trong tương lai. Người dùng sẽ được thông báo trong ứng dụng nếu có thay đổi lớn liên quan đến quyền riêng tư.</p>
    `
  }
]);

const contactSection = ref({
  title: 'Liên hệ',
  content: `
    <p>Nếu bạn có bất kỳ câu hỏi nào về chính sách này, vui lòng liên hệ chúng tôi qua email: <span class="highlight">${contactEmail.value} hoặc số điện thoại: 039 4307569</span></p>
    `
});
</script>

<style lang="css" scoped>
/* src/views/PolicyAndPrivacy.vue */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f9f9f9;
}

.privacy-container {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 20px auto;
}

h1 {
  color: #2c3e50;
  font-size: 28px;
  margin-bottom: 10px;
}

h2 {
  font-size: 22px;
  color: #2c3e50;
  margin-top: 25px;
  margin-bottom: 15px;
}

.last-updated {
  font-style: italic;
  color: #7f8c8d;
  margin-bottom: 25px;
}

.section {
  margin-bottom: 25px;
}

ul {
  padding-left: 20px;
}

li {
  margin-bottom: 8px;
}

.highlight {
  font-weight: bold;
}

.section-number {
  font-weight: bold;
  margin-right: 8px;
}

.contact-section {
  background-color: #f2f7ff;
  padding: 15px;
  border-radius: 6px;
  margin-top: 30px;
}

@media (max-width: 600px) {
  .privacy-container {
    padding: 20px;
    margin: 10px;
  }
}
</style>
