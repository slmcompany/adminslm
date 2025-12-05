<template>
  <PrivacyLayout>
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
  </PrivacyLayout>
</template>

<script setup>
import { ref } from 'vue';
import PrivacyLayout from '@/components/layouts/PrivacyLayout.vue';

const title = ref('Chính Sách Quyền Riêng Tư');
const lastUpdated = ref('Cập nhật lần cuối: Ngày 20 tháng 11 năm 2025');
const appName = ref('SLM Solar Max');
const contactEmail = ref('sale@slmsolar.com');

const sections = ref([
  {
    title: 'Thông tin chúng tôi thu thập',
    content: `
        <p>Để cung cấp dịch vụ tốt nhất cho người dùng, chúng tôi thu thập các thông tin sau:</p>
        
        <h3 style="font-size: 18px; color: #34495e; margin-top: 15px; margin-bottom: 10px;">Thông tin thiết bị và bảo hành:</h3>
        <ul>
            <li>Tên thiết bị (ví dụ: pin năng lượng mặt trời, bộ điều khiển, inverter)</li>
            <li>Ngày mua, ngày bắt đầu bảo hành, thời gian hết hạn bảo hành</li>
            <li>Thông tin đơn vị cung cấp (tùy chọn)</li>
            <li>Thông số kỹ thuật và lịch sử bảo trì thiết bị</li>
        </ul>

        <h3 style="font-size: 18px; color: #34495e; margin-top: 15px; margin-bottom: 10px;">Thông tin vị trí:</h3>
        <ul>
            <li><span class="highlight">Vị trí địa lý của bạn</span> để xác định vị trí lắp đặt hệ thống năng lượng mặt trời</li>
            <li>Giúp chúng tôi cung cấp dịch vụ hỗ trợ kỹ thuật tại chỗ khi cần thiết</li>
            <li>Tối ưu hóa hiệu suất hệ thống dựa trên điều kiện thời tiết và bức xạ mặt trời tại khu vực của bạn</li>
        </ul>

        <h3 style="font-size: 18px; color: #34495e; margin-top: 15px; margin-bottom: 10px;">Quyền truy cập bộ sưu tập ảnh:</h3>
        <ul>
            <li><span class="highlight">Truy cập thư viện ảnh</span> để bạn có thể tải lên hình ảnh thiết bị, hệ thống lắp đặt</li>
            <li>Lưu trữ ảnh chứng từ bảo hành, hóa đơn mua hàng</li>
            <li>Hỗ trợ khắc phục sự cố kỹ thuật thông qua hình ảnh</li>
            <li>Ghi lại tình trạng thiết bị trước và sau bảo trì</li>
        </ul>

        <h3 style="font-size: 18px; color: #34495e; margin-top: 15px; margin-bottom: 10px;">Thông tin cá nhân:</h3>
        <ul>
            <li>Tên, địa chỉ email, số điện thoại liên hệ</li>
            <li>Địa chỉ lắp đặt hệ thống năng lượng mặt trời</li>
            <li>Thông tin tài khoản và lịch sử sử dụng dịch vụ</li>
        </ul>

        <p style="margin-top: 15px;">Tất cả dữ liệu này được <span class="highlight">đồng bộ và lưu trữ an toàn trên máy chủ của chúng tôi</span>, không được chia sẻ với bất kỳ bên thứ ba nào mà không có sự đồng ý của bạn, ngoại trừ các trường hợp được quy định trong chính sách này.</p>
    `
  },
  {
    title: 'Mục đích sử dụng thông tin',
    content: `
        <p>Chúng tôi sử dụng thông tin thu thập được cho các mục đích sau:</p>
        <ul>
            <li>Quản lý và theo dõi thông tin bảo hành thiết bị của bạn</li>
            <li>Cung cấp dịch vụ hỗ trợ kỹ thuật và bảo trì định kỳ</li>
            <li>Thông báo về tình trạng bảo hành, lịch bảo trì và các cập nhật quan trọng</li>
            <li>Xác định vị trí để hỗ trợ kỹ thuật tại chỗ khi cần thiết</li>
            <li>Phân tích hiệu suất hệ thống dựa trên điều kiện địa lý</li>
            <li>Cải thiện chất lượng dịch vụ và trải nghiệm người dùng</li>
            <li>Lưu trữ hồ sơ hình ảnh phục vụ cho việc bảo hành và khắc phục sự cố</li>
        </ul>
    `
  },
  {
    title: 'Quyền truy cập của ứng dụng',
    content: `
        <p>Để hoạt động hiệu quả, ứng dụng yêu cầu các quyền truy cập sau:</p>
        <ul>
            <li><span class="highlight">Vị trí (GPS):</span> Xác định vị trí lắp đặt hệ thống và hỗ trợ dịch vụ tại chỗ</li>
            <li><span class="highlight">Thư viện ảnh:</span> Cho phép bạn tải lên hình ảnh thiết bị, chứng từ bảo hành và tài liệu liên quan</li>
            <li><span class="highlight">Camera:</span> Chụp ảnh trực tiếp các thiết bị, hệ thống lắp đặt khi cần thiết</li>
            <li><span class="highlight">Kết nối Internet:</span> Đồng bộ dữ liệu và nhận thông báo từ hệ thống</li>
            <li><span class="highlight">Thông báo đẩy:</span> Gửi cảnh báo về bảo hành, lịch bảo trì và cập nhật quan trọng</li>
        </ul>
        <p style="margin-top: 15px;">Bạn có thể quản lý các quyền truy cập này trong cài đặt thiết bị của mình. Tuy nhiên, việc từ chối một số quyền có thể ảnh hưởng đến chức năng của ứng dụng.</p>
    `
  },
  {
    title: 'Chia sẻ dữ liệu',
    content: `
        <p>Chúng tôi cam kết bảo vệ thông tin của bạn và <span class="highlight">không bán hoặc cho thuê dữ liệu cá nhân</span> của người dùng cho bất kỳ bên thứ ba nào.</p>
        
        <p style="margin-top: 15px;">Chúng tôi chỉ chia sẻ thông tin trong các trường hợp sau:</p>
        <ul>
            <li><span class="highlight">Với các đối tác kỹ thuật:</span> Khi cần hỗ trợ bảo trì hoặc sửa chữa thiết bị tại chỗ</li>
            <li><span class="highlight">Theo yêu cầu pháp lý:</span> Khi bắt buộc phải cung cấp theo quy định của pháp luật</li>
            <li><span class="highlight">Với sự đồng ý của bạn:</span> Trong các trường hợp khác, chúng tôi sẽ xin phép trước khi chia sẻ thông tin</li>
        </ul>
    `
  },
  {
    title: 'Bảo mật dữ liệu',
    content: `
        <p>Chúng tôi áp dụng các biện pháp bảo mật tiên tiến để bảo vệ thông tin của bạn:</p>
        <ul>
            <li>Mã hóa dữ liệu khi truyền tải và lưu trữ</li>
            <li>Kiểm soát truy cập nghiêm ngặt đối với dữ liệu người dùng</li>
            <li>Sao lưu dữ liệu định kỳ để tránh mất mát thông tin</li>
            <li>Giám sát và phát hiện các mối đe dọa bảo mật</li>
            <li>Đào tạo nhân viên về bảo mật thông tin và quyền riêng tư</li>
        </ul>
        <p style="margin-top: 15px;">Tuy nhiên, không có phương thức truyền dữ liệu qua Internet hoặc lưu trữ điện tử nào là an toàn tuyệt đối 100%. Chúng tôi khuyến nghị bạn bảo vệ thông tin đăng nhập của mình và không chia sẻ với người khác.</p>
    `
  },
  {
    title: 'Quyền của người dùng',
    content: `
        <p>Bạn có các quyền sau đối với thông tin cá nhân của mình:</p>
        <ul>
            <li><span class="highlight">Quyền truy cập:</span> Yêu cầu xem thông tin cá nhân mà chúng tôi lưu trữ về bạn</li>
            <li><span class="highlight">Quyền chỉnh sửa:</span> Cập nhật hoặc sửa đổi thông tin không chính xác</li>
            <li><span class="highlight">Quyền xóa:</span> Yêu cầu xóa thông tin cá nhân (với một số ngoại lệ theo quy định pháp luật)</li>
            <li><span class="highlight">Quyền rút lại sự đồng ý:</span> Hủy các quyền truy cập đã cấp cho ứng dụng</li>
            <li><span class="highlight">Quyền phản đối:</span> Phản đối việc xử lý dữ liệu của bạn trong một số trường hợp nhất định</li>
            <li><span class="highlight">Quyền di chuyển dữ liệu:</span> Yêu cầu chuyển dữ liệu của bạn sang nhà cung cấp dịch vụ khác</li>
        </ul>
        <p style="margin-top: 15px;">Để thực hiện các quyền này, vui lòng liên hệ với chúng tôi qua email <span class="highlight">{{ contactEmail }}</span> hoặc số điện thoại <span class="highlight">039 4307569</span>. Chúng tôi sẽ xử lý yêu cầu của bạn trong vòng 30 ngày.</p>
    `
  },
  {
    title: 'Lưu trữ dữ liệu',
    content: `
        <p>Chúng tôi lưu trữ thông tin cá nhân của bạn trong thời gian cần thiết để:</p>
        <ul>
            <li>Cung cấp các dịch vụ mà bạn yêu cầu</li>
            <li>Tuân thủ các nghĩa vụ pháp lý (ví dụ: lưu trữ hồ sơ bảo hành)</li>
            <li>Giải quyết tranh chấp và thực thi các thỏa thuận</li>
        </ul>
        <p style="margin-top: 15px;">Sau khi không còn cần thiết, chúng tôi sẽ xóa hoặc ẩn danh hóa thông tin của bạn một cách an toàn.</p>
    `
  },
  {
    title: 'Cookie và công nghệ theo dõi',
    content: `
        <p>Ứng dụng của chúng tôi có thể sử dụng cookie và các công nghệ theo dõi tương tự để:</p>
        <ul>
            <li>Ghi nhớ tùy chọn và cài đặt của bạn</li>
            <li>Phân tích cách người dùng sử dụng ứng dụng</li>
            <li>Cải thiện hiệu suất và trải nghiệm người dùng</li>
            <li>Cung cấp nội dung được cá nhân hóa</li>
        </ul>
        <p style="margin-top: 15px;">Bạn có thể quản lý cookie thông qua cài đặt trình duyệt hoặc thiết bị của mình.</p>
    `
  },
  {
    title: 'Dành cho trẻ em',
    content: `
        <p>Ứng dụng <span class="highlight">không dành cho trẻ em dưới 13 tuổi</span> và chúng tôi không cố ý thu thập thông tin cá nhân từ trẻ em dưới 13 tuổi.</p>
        <p style="margin-top: 10px;">Nếu chúng tôi phát hiện đã vô tình thu thập thông tin từ trẻ em dưới 13 tuổi, chúng tôi sẽ xóa thông tin đó trong thời gian sớm nhất có thể. Nếu bạn tin rằng chúng tôi có thông tin về trẻ em dưới 13 tuổi, vui lòng liên hệ với chúng tôi ngay lập tức.</p>
    `
  },
  {
    title: 'Thay đổi chính sách',
    content: `
        <p>Chúng tôi có thể cập nhật Chính sách quyền riêng tư này theo thời gian để phản ánh các thay đổi trong thực tiễn của chúng tôi hoặc vì các lý do pháp lý, vận hành hoặc theo quy định khác.</p>
        <p style="margin-top: 10px;">Khi có thay đổi quan trọng, chúng tôi sẽ:</p>
        <ul>
            <li>Thông báo cho bạn qua email hoặc thông báo trong ứng dụng</li>
            <li>Cập nhật ngày "Cập nhật lần cuối" ở đầu chính sách này</li>
            <li>Yêu cầu sự đồng ý của bạn nếu cần thiết theo quy định pháp luật</li>
        </ul>
        <p style="margin-top: 10px;">Chúng tôi khuyến khích bạn xem lại chính sách này định kỳ để nắm được cách chúng tôi bảo vệ thông tin của bạn.</p>
    `
  }
]);

const contactSection = ref({
  title: 'Liên hệ',
  content: `
    <p>Nếu bạn có bất kỳ câu hỏi, thắc mắc hoặc yêu cầu nào về Chính sách quyền riêng tư này, vui lòng liên hệ với chúng tôi qua:</p>
    <ul style="margin-top: 10px;">
      <li><span class="highlight">Email:</span> ${contactEmail.value}</li>
      <li><span class="highlight">Số điện thoại:</span> 039 4307569</li>
      <li><span class="highlight">Địa chỉ:</span> [Địa chỉ văn phòng SLM Solar]</li>
    </ul>
    <p style="margin-top: 15px;">Chúng tôi sẽ phản hồi yêu cầu của bạn trong vòng 7-30 ngày làm việc.</p>
    `
});
</script>

<style lang="css" scoped>
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

h3 {
  font-size: 18px;
  color: #34495e;
  margin-top: 15px;
  margin-bottom: 10px;
}

ul {
  padding-left: 20px;
}

li {
  margin-bottom: 8px;
  line-height: 1.6;
}

.highlight {
  font-weight: bold;
  color: #2c3e50;
}

.section-number {
  font-weight: bold;
  margin-right: 8px;
}
</style>