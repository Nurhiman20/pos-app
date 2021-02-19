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
          title: 'Dashboard | 21FACTORY',
          // requireAuth: true
        }
      },
      {
        path: '/pos',
        name: 'POS',
        component: () => import('@/views/POS'),
        meta: {
          title: 'POS | 21FACTORY',
          // requireAuth: true
        }
      }
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
          title: 'Daftar Produk | 21FACTORY'
        }
      },
      {
        path: '/produk/kategori',
        name: 'Daftar Kategori',
        component: () => import('@/views/Produk/views/DaftarKategori.vue'),
        meta: {
          title: 'Kategori | 21FACTORY',
          requireAuth: true
        }
      },
      {
        path: '/produk/bahan',
        name: 'Bahan',
        component: () => import('@/views/Produk/views/DaftarBahan.vue'),
        meta: {
          title: 'Bahan | 21FACTORY',
          requireAuth: true
        }
      },
      {
        path: '/produk/resep',
        name: 'Resep',
        component: () => import('@/views/Produk/views/Resep.vue'),
        meta: {
          title: 'Resep | 21FACTORY',
          requireAuth: true
        }
      }
    ]
  },
  {
    path: '/inventaris',
    name: 'Inventaris',
    redirect: '/inventaris/ringkasan',
    component: () => import('@/layouts/Home'),
    children: [
      {
        path: '/inventaris/ringkasan',
        name: 'Ringkasan',
        component: () => import('@/views/Inventaris/views/Ringkasan.vue'),
        meta: {
          title: 'Ringkasan | Inventaris | 21FACTORY'
        }
      },
      {
        path: '/inventaris/supplier',
        name: 'Supplier',
        component: () => import('@/views/Inventaris/views/Supplier.vue'),
        meta: {
          title: 'Supplier | Inventaris | 21FACTORY'
        }
      },
      {
        path: '/inventaris/order',
        name: 'Order',
        component: () => import('@/views/Inventaris/views/Order.vue'),
        meta: {
          title: 'Order | Inventaris | 21FACTORY'
        }
      },
      {
        path: '/inventaris/transfer',
        name: 'Transfer',
        component: () => import('@/views/Inventaris/views/Transfer.vue'),
        meta: {
          title: 'Transfer | Inventaris | 21FACTORY'
        }
      },
      {
        path: '/inventaris/adjustment',
        name: 'Adjustment',
        component: () => import('@/views/Inventaris/views/Adjustment.vue'),
        meta: {
          title: 'Adjustment | Inventaris | 21FACTORY'
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
          title: 'Manajemen Meja | Outlet | 21FACTORY'
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
          title: 'Data Pelanggan | 21FACTORY'
        }
      }
    ]
  },
  {
    path: '/laporan',
    name: 'Laporan',
    redirect: '/laporan/transaksi',
    component: () => import('@/layouts/Home'),
    children: [
      {
        path: '/laporan/transaksi',
        name: 'Transaksi',
        component: () => import('@/views/Laporan/views/Transaksi.vue'),
        meta: {
          title: 'Transaksi | 21FACTORY'
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
          title: 'Tampilan | 21FACTORY'
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
