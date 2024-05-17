import axios, { AxiosRequestConfig } from 'axios'
import notification from 'ant-design-vue/es/notification'
import Qs from 'qs'
import router from '@/router'

function jumpLogin() {
  router.push({ name: 'login' })
}
//创建axios实例
const service = axios.create({
  // baseURL: 'https://dev.ezoodb.com',
  withCredentials: true,
  timeout: 600000,
  paramsSerializer: function (params) {
    return Qs.stringify(params, { arrayFormat: 'comma' })
  }
})

service.interceptors.response.use(
  (response) => {
    const res = response.data

    if (res.code == 200) {
      return res
    } else {
      if (res.code === 401) {
        jumpLogin()
      } else {
        return Promise.reject(res)
      }
    }
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    try {
      if (error.code === 'ERR_NETWORK') return Promise.reject('network')
      if (error.code === 'ERR_CANCELED') return Promise.reject('cancel')
      if (error.response.status === 402) return Promise.reject('cancel')
      if (error.response.status === 401) {
        return jumpLogin()
      }
      notification.error(error?.response.data.error || '服务器错误')
    } catch (error) {
      console.log(error)
    }
    return Promise.reject(error?.response)
  }
)

const request = async <T = any>(config: AxiosRequestConfig, hideMsg?: boolean): Promise<ApiCommonRes<T>> => {
  try {
    const res = await service.request<T, ApiCommonRes<T>>(config)
    return res
  } catch (error: any) {
    if (error === 'cancel') throw error
    if (error === 'network') throw error
    if (error.status === 401) {
      jumpLogin()
    }
    if (!hideMsg) {
      notification.error(error?.msg || '服务器错误')
    }
    throw error
  }
}

export default request
