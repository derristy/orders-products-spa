import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { TOKEN_KEY } from '@/api'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { public: true },
  },
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

// JWT auth guard: protected routes require a token; /login is public.
router.beforeEach((to) => {
  const authed = !!localStorage.getItem(TOKEN_KEY)
  if (to.meta.public) {
    if (authed && to.name === 'login') return { name: 'orders' }
    return true
  }
  if (!authed) return { name: 'login', query: { redirect: to.fullPath } }
  return true
})

export default router
