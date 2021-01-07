export const sidebar = [
  { 
    icon: 'mdi-view-dashboard', 
    text: 'Dashboard',
    to: '/dashboard'
  }
]

export const mainMenu = [
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
    icon: 'mdi-package-variant', 
    text: 'Produk',
    children: [
      {
        text: 'Daftar Kategori',
        to: '/not-found'
      },
      {
        text: 'Daftar Produk',
        to: '/not-found'
      }
    ]
  },
  { 
    icon: 'mdi-package-variant-closed', 
    text: 'Inventory',
    children: [
      {
        text: 'Kelola Stock',
        to: '/not-found'
      },
      {
        text: 'Belanja',
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
    icon: 'mdi-format-list-checks', 
    text: 'Transaksi',
    children: [
      {
        text: 'Penjualan',
        to: '/transaksi/penjualan/tambah-transaksi'
      },
      {
        text: 'Pengeluaran',
        to: '/not-found'
      }
    ]
  },
  { 
    icon: 'mdi-swap-horizontal', 
    text: 'Arus Kas',
    children: [
      {
        text: 'Buku Kas',
        to: '/not-found'
      },
      {
        text: 'Daftar Penerimaan',
        to: '/not-found'
      },
      {
        text: 'Daftar Pengeluaran',
        to: '/not-found'
      },
      {
        text: 'Daftar Tagihan Rutin',
        to: '/not-found'
      },
      {
        text: 'Laporan Rugi Laba',
        to: '/not-found'
      },
      {
        text: 'Daftar Akun',
        to: '/not-found'
      }
    ]
  },
  { 
    icon: 'mdi-crosshairs', 
    text: 'Tracking'
  },
  { 
    icon: 'mdi-check-outline', 
    text: 'Absensi',
    children: [
      {
        text: 'Data Absensi',
        to: '/not-found'
      },
      {
        text: 'Shift Karyawan',
        to: '/not-found'
      }
    ]
  },
  { 
    icon: 'mdi-cog-outline', 
    text: 'Pengaturan',
    children: [
      {
        text: 'Kategori Usaha',
        to: '/not-found'
      },
      {
        text: 'Profile',
        to: '/not-found'
      },
      {
        text: 'Metode Pembayaran',
        to: '/not-found'
      },
      {
        text: 'Biaya',
        to: '/not-found'
      }
    ]
  }
]
