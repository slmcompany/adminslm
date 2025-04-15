<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo">
        <img src="/src/assets/logo.svg" alt="SLM Solar Logo" />
        <h1>SLM Solar Admin</h1>
      </div>

      <a-form
        :model="loginForm"
        @finish="handleSubmit"
        layout="vertical"
      >
        <a-form-item
          name="phone"
          label="Số điện thoại"
          :rules="[{ required: true, message: 'Vui lòng nhập số điện thoại' }]"
        >
          <a-input
            v-model:value="loginForm.phone"
            placeholder="Nhập số điện thoại"
            size="large"
          />
        </a-form-item>

        <a-form-item
          name="password"
          label="Mật khẩu"
          :rules="[{ required: true, message: 'Vui lòng nhập mật khẩu' }]"
        >
          <a-input-password
            v-model:value="loginForm.password"
            placeholder="Nhập mật khẩu"
            size="large"
          />
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :loading="loading"
            size="large"
            block
          >
            Đăng nhập
          </a-button>
        </a-form-item>
      </a-form>

      <a-alert
        v-if="error"
        type="error"
        :message="error"
        showIcon
        style="margin-top: 16px"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const error = ref('')

const loginForm = reactive({
  phone: '',
  password: ''
})

onMounted(() => {
  // Kiểm tra xem người dùng đã đăng nhập chưa
  authStore.initAuth()
  if (authStore.isAuthenticated && authStore.isAdmin) {
    router.push('/')
  }
})

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''

    await authStore.login(loginForm.phone, loginForm.password)
    router.push('/')
  } catch (err) {
    error.value = err.message || 'Đã xảy ra lỗi khi đăng nhập'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
}

.login-card {
  width: 400px;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: white;
}

.logo {
  text-align: center;
  margin-bottom: 32px;
}

.logo img {
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
}

.logo h1 {
  font-size: 24px;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 0;
}
</style>
