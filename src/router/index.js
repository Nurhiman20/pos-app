import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/dashboard',
    component: () => import('@/layouts/Home'),
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard')
      },
    ]
  },
  {
    path: '/produk',
    name: 'Produk',
    redirect: '/produk/daftar-produk',
    component: () => import('@/layouts/Home'),
    children: [
      {
        path: '/produk/daftar-produk',
        name: 'Daftar Produk',
        component: () => import('@/views/Produk/views/DaftarProduk.vue')
      },
      {
        path: '/produk/daftar-kategori',
        name: 'Daftar Kategori',
        component: () => import('@/views/Produk/views/DaftarKategori.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
