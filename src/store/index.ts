import api from '@/api'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import storage from 'store'
type StoreUserInfo = {
  role?: string
  role_id: number
  auths?: Array<{
    createTime: string
    id: number
    role: number
    updateTime: string
    userId: number
    userSolutionId: number
  }>
  parentId?: number
  type?: number
  userId?: number
  username?: string
}

export const userPinia = defineStore('user', () => {
  const userInfo = ref<Partial<StoreUserInfo>>({})

  function getUserInfo() {
    return api.user.getUserInfo().then((res) => {
      storage.set('userInfo', res.data)
      userInfo.value = res.data
      return res
    })
  }

  function logout() {
    return api.user.logout().then(() => {
      storage.remove('userInfo')
      userInfo.value = {}
    })
  }

  return { userInfo, getUserInfo, logout }
})
