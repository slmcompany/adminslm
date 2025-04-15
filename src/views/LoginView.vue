<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo">
        <div class="logo-wrapper">
          <img src="@/assets/slm-logo-white.png" alt="SLM Solar Logo" />
        </div>
        <h1>Đăng nhập</h1>
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
            danger
            type="primary"
            html-type="submit"
            :loading="loading"
            size="large"
            block
            class="login-button"
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

<style>
html, body, #app {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  height: 100% !important;
  overflow: hidden !important;
}
</style>

<style scoped>
.login-container {
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('@/assets/login-bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.login-card {
  width: 400px;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.95);
}

.logo {
  text-align: center;
  margin-bottom: 32px;
}

.logo-wrapper {
  width: 100px;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 16px;
  padding: 0;
}

.logo img {
  width: 100%;
  height: auto;
}

.logo h1 {
  font-size: 24px;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 0;
}

.login-button {
  background-color: #ff4d4f;
  border-color: #ff4d4f;
}

.login-button:hover, .login-button:focus {
  background-color: #ff7875;
  border-color: #ff7875;
}
</style>
