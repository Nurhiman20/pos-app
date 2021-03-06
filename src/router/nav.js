export const sidebar = [
  { 
    icon: 'mdi-view-dashboard', 
    text: 'Dashboard',
    to: '/dashboard'
  },
  { 
    icon: 'mdi-calculator', 
    text: 'POS',
    to: '/pos'
  }
]

export const mainMenu = [
  { 
    icon: 'mdi-package-variant', 
    text: 'Produk',
    children: [
      {
        text: 'Daftar Produk',
        to: '/produk/daftar-produk'
      },
      {
        text: 'Kategori',
        to: '/produk/kategori'
      },
      {
        text: 'Bahan',
        to: '/produk/bahan'
      },
      {
        text: 'Resep',
        to: '/produk/resep'
      }
    ]
  },
  { 
    icon: 'mdi-warehouse', 
    text: 'Inventaris',
    children: [
      {
        text: 'Ringkasan',
        to: '/inventaris/ringkasan'
      },
      {
        text: 'Supplier',
        to: '/inventaris/supplier'
      },
      {
        text: 'Pemesanan',
        to: '/inventaris/pemesanan'
      },
      {
        text: 'Penerimaan',
        to: '/inventaris/penerimaan'
      },
      {
        text: 'Transfer',
        to: '/inventaris/transfer'
      },
      {
        text: 'Adjustment',
        to: '/inventaris/adjustment'
      }
    ]
  },
  // { 
  //   icon: 'mdi-store', 
  //   text: 'Outlet',
  //   children: [
  //     // {
  //     //   text: 'Daftar Outlet',
  //     //   to: '/outlet/daftar-outlet'
  //     // },
  //     // {
  //     //   text: 'Kasir',
  //     //   to: '/outlet/kasir'
  //     // },
  //     {
  //       text: 'Manajemen Meja',
  //       to: '/outlet/manajemen-meja'
  //     }
  //   ]
  // },
  { 
    icon: 'mdi-account-check-outline', 
    text: 'Pelanggan',
    children: [
      {
        text: 'Data Pelanggan',
        to: '/pelanggan/list'
      }
    ]
  },
  {
    icon: 'mdi-file-document-outline',
    text: 'Laporan',
    children: [
      {
        text: 'Transaksi',
        to: '/laporan/transaksi'
      },
      // {
      //   text: 'Laporan Piutang',
      //   to: '/not-found'
      // },
      // {
      //   text: 'Laporan Pengeluaran',
      //   to: '/not-found'
      // }
    ]
  },
  // { 
  //   icon: 'mdi-alert-octagram-outline', 
  //   text: 'Promosi',
  //   children: [
  //     {
  //       text: 'Per Total Pembelian',
  //       to: '/not-found'
  //     },
  //     {
  //       text: 'Per Produk',
  //       to: '/not-found'
  //     },
  //     {
  //       text: 'Kupon',
  //       to: '/not-found'
  //     }
  //   ]
  // },
  { 
    icon: 'mdi-cog-outline', 
    text: 'Pengaturan',
    children: [
      {
        text: 'Cabang',
        to: '/pengaturan/cabang/daftar-cabang'
      },
      {
        text: 'Pegawai',
        to: '/pengaturan/pegawai'
      },
      {
        text: 'Meja',
        to: '/pengaturan/meja'
      },
      {
        text: 'Akun',
        to: '/pengaturan/akun'
      },
      {
        text: 'Tampilan',
        to: '/pengaturan/tampilan'
      }
    ]
  }
]
