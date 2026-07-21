import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/orders' },
  {
    path: '/orders',
    name: 'orders',
    // Lazy loading — route-level code splitting
    component: () => import('@/views/OrdersView.vue'),
    meta: { title: 'Приходы' },
  },
  {
    path: '/products',
    name: 'products',
    component: () => import('@/views/ProductsView.vue'),
    meta: { title: 'Продукты' },
  },
  { path: '/:pathMatch(.*)*', redirect: '/orders' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

export default router
