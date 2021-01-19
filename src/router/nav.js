export const sidebar = [
  { 
    icon: 'mdi-view-dashboard', 
    text: 'Dashboard',
    to: '/dashboard'
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
        text: 'Daftar Kategori',
        to: '/produk/daftar-kategori'
      }
    ]
  },
  { 
    icon: 'mdi-package-variant-closed', 
    text: 'Inventaris',
    children: [
      {
        text: 'Kelola Stok',
        to: '/inventaris/kelola-stok'
      }
    ]
  },
  { 
    icon: 'mdi-store', 
    text: 'Outlet',
    children: [
      {
        text: 'Daftar Meja',
        to: '/not-found'
      }
    ]
  },
  { 
    icon: 'mdi-account-check-outline', 
    text: 'Pelanggan',
    children: [
      {
        text: 'Data Pelanggan',
        to: '/not-found'
      },
      {
        text: 'Grup Pelanggan',
        to: '/not-found'
      }
    ]
  },
  {
    icon: 'mdi-file-document-outline',
    text: 'Laporan',
    children: [
      {
        text: 'Laporan Penjualan',
        to: '/not-found'
      },
      {
        text: 'Laporan Piutang',
        to: '/not-found'
      },
      {
        text: 'Laporan Pengeluaran',
        to: '/not-found'
      }
    ]
  },
  { 
    icon: 'mdi-alert-octagram-outline', 
    text: 'Promosi',
    children: [
      {
        text: 'Per Total Pembelian',
        to: '/not-found'
      },
      {
        text: 'Per Produk',
        to: '/not-found'
      },
      {
        text: 'Kupon',
        to: '/not-found'
      }
    ]
  },
  { 
    icon: 'mdi-cog-outline', 
    text: 'Pengaturan',
    children: [
      {
        text: 'Tampilan',
        to: '/pengaturan/tampilan'
      }
    ]
  }
]
