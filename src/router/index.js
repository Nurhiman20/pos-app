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
        component: () => import('@/views/Dashboard'),
        meta: {
          title: 'Dashboard | POS App',
          // requireAuth: true
        }
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
        component: () => import('@/views/Produk/views/DaftarProduk.vue'),
        meta: {
          title: 'Daftar Produk | POS App'
        }
      },
      {
        path: '/produk/daftar-kategori',
        name: 'Daftar Kategori',
        component: () => import('@/views/Produk/views/DaftarKategori.vue'),
        meta: {
          title: 'Daftar Kategori | POS App',
          requireAuth: true
        }
      }
    ]
  },
  {
    path: '/inventaris',
    name: 'Inventaris',
    redirect: '/inventaris/kelola-stok',
    component: () => import('@/layouts/Home'),
    children: [
      {
        path: '/inventaris/kelola-stok',
        name: 'Kelola Stok',
        component: () => import('@/views/Inventaris/views/KelolaStok.vue'),
        meta: {
          title: 'Kelola Stok | POS App'
        }
      }
    ]
  },
  {
    path: '/outlet',
    name: 'Outlet',
    redirect: '/outlet/manajemen-meja',
    component: () => import('@/layouts/Home'),
    children: [
      {
        path: '/outlet/manajemen-meja',
        name: 'Manajemen Meja',
        component: () => import('@/views/Outlet/views/ManajemenMeja.vue'),
        meta: {
          title: 'Manajemen Meja | POS App'
        }
      }
    ]
  },
  {
    path: '/pelanggan',
    name: 'Pelanggan',
    redirect: '/pelanggan/list',
    component: () => import('@/layouts/Home'),
    children: [
      {
        path: '/pelanggan/list',
        name: 'Data Pelanggan',
        component: () => import('@/views/Pelanggan/views/DataPelanggan.vue'),
        meta: {
          title: 'Data Pelanggan | POS App'
        }
      }
    ]
  },
  {
    path: '/laporan',
    name: 'Laporan',
    redirect: '/laporan/laporan-penjualan',
    component: () => import('@/layouts/Home'),
    children: [
      {
        path: '/laporan/laporan-penjualan',
        name: 'Laporan Penjualan',
        component: () => import('@/views/Laporan/views/LaporanPenjualan.vue'),
        meta: {
          title: 'Laporan Penjualan | POS App'
        }
      }
    ]
  },
  {
    path: '/pengaturan',
    name: 'Pengaturan',
    redirect: '/pengaturan/tampilan',
    component: () => import('@/layouts/Home'),
    children: [
      {
        path: '/pengaturan/tampilan',
        name: 'Tampilan',
        component: () => import('@/views/Pengaturan/Tampilan.vue'),
        meta: {
          title: 'Tampilan | POS App'
        }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // if (to.matched.some(record => record.meta.requireAuth)) {
  //   if (checkToken()) {
  //     next()
  //   } else {
  //     next('/explore')
  //     return
  //   }
  // }

  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);
  if(nearestWithTitle) document.title = nearestWithTitle.meta.title;

  next()
})

export default router
