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
        path: '/inventaris/index',
        name: 'Ringkasan',
        redirect: '/inventaris/ringkasan',
        component: () => import('@/views/Inventaris/index.vue'),
        children: [
          {
            path: '/inventaris/ringkasan',
            name: 'Daftar Ringkasan',
            component: () => import('@/views/Inventaris/views/Ringkasan.vue'),
            meta: {
              title: 'Ringkasan | Inventaris | 21FACTORY'
            }
          },
          {
            path: '/inventaris/ringkasan/detail/:id',
            name: 'Detail Ringkasan',
            component: () => import('@/views/Inventaris/views/DetailRingkasan.vue'),
            meta: {
              title: 'Detail Ringkasan | Inventaris | 21FACTORY'
            }
          }
        ]
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
        path: '/inventaris/pemesanan',
        name: 'Pemesanan',
        component: () => import('@/views/Inventaris/views/Order.vue'),
        meta: {
          title: 'Pemesanan | Inventaris | 21FACTORY'
        }
      },
      {
        path: '/inventaris/penerimaan',
        name: 'Penerimaan',
        component: () => import('@/views/Inventaris/views/Penerimaan.vue'),
        meta: {
          title: 'Penerimaan | Inventaris | 21FACTORY'
        }
      },
      {
        path: '/inventaris/transfer',
        name: 'Transfer',
        component: () => import('@/views/Inventaris/views/Transfer'),
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
    path: '/pelanggan',
    name: 'Pelanggan',
    redirect: '/pelanggan/list',
    component: () => import('@/layouts/Home'),
    children: [
      {
        path: '/pelanggan/index',
        name: 'Pelanggan',
        redirect: '/pelanggan/list',
        component: () => import('@/views/Pelanggan/index.vue'),
        children: [
          {
            path: '/pelanggan/list',
            name: 'Daftar Pelanggan',
            component: () => import('@/views/Pelanggan/views/DataPelanggan.vue'),
            meta: {
              title: 'Daftar Pelanggan | Pelanggan | 21FACTORY'
            }
          },
          {
            path: '/pelanggan/list/detail/:id',
            name: 'Detail Pelanggan',
            component: () => import('@/views/Pelanggan/views/DetailPelanggan.vue'),
            meta: {
              title: 'Detail Pelanggan | Pelanggan | 21FACTORY'
            }
          }
        ]
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
    redirect: '/pengaturan/cabang',
    component: () => import('@/layouts/Home'),
    children: [
      {
        path: '/pengaturan/cabang',
        name: 'Cabang',
        redirect: '/pengaturan/cabang/daftar-cabang',
        component: () => import('@/views/Pengaturan'),
        children: [
          {
            path: '/pengaturan/cabang/daftar-cabang',
            name: 'Daftar Cabang',
            component: () => import('@/views/Pengaturan/views/DaftarCabang.vue'),
            meta: {
              title: 'Daftar Cabang | Cabang | 21FACTORY'
            }
          },
          {
            path: '/pengaturan/cabang/daftar-cabang/:id',
            name: 'Detail Cabang',
            component: () => import('@/views/Pengaturan/views/DetailCabang.vue'),
            meta: {
              title: 'Detail Cabang | Cabang | 21FACTORY'
            }
          }
        ]
      },
      {
        path: '/pengaturan/akun',
        name: 'Akun',
        component: () => import('@/views/Pengaturan/views/Akun.vue'),
        meta: {
          title: 'Akun | Pengaturan | 21FACTORY'
        }
      },
      {
        path: '/pengaturan/pegawai',
        name: 'Pegawai',
        component: () => import('@/views/Pengaturan/views/Pegawai.vue'),
        meta: {
          title: 'Pegawai | Outlet | 21FACTORY'
        }
      },
      {
        path: '/pengaturan/meja',
        name: 'Meja',
        component: () => import('@/views/Pengaturan/views/ManajemenMeja.vue'),
        meta: {
          title: 'Meja | Outlet | 21FACTORY'
        }
      },
      {
        path: '/pengaturan/tampilan',
        name: 'Tampilan',
        component: () => import('@/views/Pengaturan/views/Tampilan.vue'),
        meta: {
          title: 'Tampilan | Pengaturan | 21FACTORY'
        }
      },
      // {
      //   path: '/pengaturan/receipt',
      //   name: 'Receipt',
      //   component: () => import('@/views/Pengaturan/Receipt.vue'),
      //   meta: {
      //     title: 'Receipt | 21FACTORY'
      //   }
      // }
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
