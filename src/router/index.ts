import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/monaco-customizer',
      name: 'monaco-customizer',
      component: () => import('@/views/MonacoCustomizerView.vue'),
    },
  ],
})

export default router
