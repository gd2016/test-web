import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
const routes: AppRouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    redirect: {
      name: 'Index'
    }
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import('@/views/index.vue'),
    meta: { fullscreen: true, hideNav: true }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue')
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/not-found.vue') }
]

const baseUrl = import.meta.env.VITE_BASE_URL
const router = createRouter({
  history: createWebHistory(baseUrl),
  routes: routes as RouteRecordRaw[],
  scrollBehavior() {
    return { top: 0, left: 0 }
  }
})

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
