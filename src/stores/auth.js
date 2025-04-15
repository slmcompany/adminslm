import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null
  }),

  getters: {
    isAdmin: (state) => state.user && state.user.role_id === 1,
    isAuthenticated: (state) => !!state.user
  },

  actions: {
    async login(phone, password) {
      this.loading = true
      this.error = null

      try {
        const response = await axios.get('https://id.slmsolar.com/api/users')
        const users = response.data

        // Tìm người dùng với số điện thoại và mật khẩu phù hợp
        const user = users.find(u => u.phone === phone && u.password === password)

        if (!user) {
          throw new Error('Thông tin đăng nhập không chính xác')
        }

        // Kiểm tra xem người dùng có phải là admin (role_id = 1) không
        if (user.role_id !== 1) {
          throw new Error('Bạn không có quyền truy cập vào hệ thống này')
        }

        this.user = user
        localStorage.setItem('user', JSON.stringify(user))
        return user
      } catch (error) {
        this.error = error.message || 'Đã xảy ra lỗi khi đăng nhập'
        throw error
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      localStorage.removeItem('user')
    },

    initAuth() {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        try {
          this.user = JSON.parse(storedUser)
        } catch (e) {
          localStorage.removeItem('user')
        }
      }
    }
  }
})
