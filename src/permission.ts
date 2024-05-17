import router from './router'
import storage from 'store'
import NProgress from 'nprogress' // progress bar
import notification from 'ant-design-vue/es/notification'
import { userPinia } from './store'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const allowList = ['login', 'register', 'registerResult'] // no redirect allowList
const loginRoutePath = '/login'
const defaultRoutePath = '/index'

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  // to.meta && typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`)
  /* has token */
  console.log(1)

  const userStore = userPinia()
  const token = storage.get('userInfo')
  if (token) {
    if (to.path === loginRoutePath) {
      next({ path: defaultRoutePath })
      NProgress.done()
    } else {
      if (!userStore.userInfo.userId) {
        userStore
          .getUserInfo()
          .then(() => {
            const redirect = decodeURIComponent((from.query.redirect || to.path) as string)
            if (to.path === redirect) {
              next({ ...to, replace: true })
            } else {
              // 跳转到目的路由
              next({ path: redirect })
            }
          })
          .catch(() => {
            notification.error({
              message: '错误',
              description: '请求用户信息失败，请重试'
            })
            // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
            userStore.logout().then(() => {
              next({ path: loginRoutePath, query: { redirect: to.fullPath } })
            })
          })
      } else {
        next()
      }
    }
  } else {
    if (allowList.includes(to.name as string)) {
      // 在免登录名单，直接进入
      next()
    } else {
      next({ path: loginRoutePath, query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
