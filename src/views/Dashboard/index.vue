<template>
  <div class="app-content">
    <v-container>
      <v-row>
        <v-col cols="7" md="7" lg="7">
          <v-card
            outlined
            flat
            class="pa-4"
            min-height="90vh"
          >
            <v-btn color="#2B81D6" dark :outlined="activeView === 'minuman' ? false : true"  @click="changeView('minuman')">Minuman</v-btn>
            <v-btn color="#2B81D6" dark class="ml-1" :outlined="activeView === 'makanan' ? false : true" @click="changeView('makanan')">Makanan</v-btn>
            <v-btn color="#2B81D6" dark class="ml-1" :outlined="activeView === 'coffee' ? false : true" @click="changeView('coffee')">Coffee</v-btn>
            <v-btn color="#2B81D6" dark class="ml-1" :outlined="activeView === 'jus' ? false : true" @click="changeView('jus')">Jus</v-btn>
            <v-btn color="#2B81D6" dark class="ml-1" :outlined="activeView === 'ayam' ? false : true" @click="changeView('ayam')">Ayam</v-btn>
            <v-btn color="#2B81D6" dark class="ml-1" :outlined="activeView === 'dessert' ? false : true" @click="changeView('dessert')">Dessert</v-btn>
            <v-text-field
              v-model="search"
              outlined
              dense
              label="Cari..."
              class="mb-0 mt-4"
            ></v-text-field>
            <div class="mt-2">
              <p v-if="resultSearch.length === 0">Mohon maaf.. Menu tersebut tidak tersedia</p>
              <v-row v-else>
                <v-col cols="4" md="4" lg="4" v-for="(item, i) in resultSearch" :key="i">
                  <v-card class="cursor-pointer" @click="addMenu(item)">
                    <div class="d-flex flex-column">
                      <v-img src="https://picsum.photos/400/300?random" :aspect-ratio="4/3"></v-img>
                      <div class="ml-4 mt-3">
                        <p>{{ item.nama }}</p>
                        <p class="mt-n3 text-bold">Rp. {{ item.harga }}</p>
                      </div>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </v-card>
        </v-col>
        <v-col cols="5" md="5" lg="5">
          <v-card
            outlined
            flat
            min-height="90vh"
            class="d-flex align-start flex-column pb-8"
          >
            <div class="table mb-auto w-full">
              <v-data-table
                :headers="headers"
                :items="selectedMenu"
                class="elevation-1 scrollbar-custom"
                hide-default-footer
              >
                <template v-slot:item.actions="{item}">
                  <div class="d-flex flex-row align-center justify-end">
                    <v-btn icon color="success" @click="goToEdit(item)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon color="error" @click="deleteMenu(item)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </template>
              </v-data-table>
            </div>
            <div class="w-full px-3 mt-4">
              <v-row>
                <v-col cols="6" md="6" lg="6" class="py-0">
                  Diskon
                </v-col>
                <v-col cols="6" md="6" lg="6" class="py-0">
                  <div class="d-flex flex-row justify-end">
                    <p class="text-bold mr-2">Rp. 0</p>
                  </div>
                </v-col>
                <v-col cols="12" md="12" lg="12" class="py-0">
                  <div class="d-flex flex-row justify-space-between pa-2 pb-0 total">
                    <p>Total</p>
                    <p class="text-bold">Rp. {{ total }}</p>
                  </div>
                </v-col>
                <v-col cols="12" md="6" lg="6" class="py-0">
                  <p class="mt-2">Tunai</p>
                </v-col>
                <v-col cols="12" md="6" lg="6" class="py-0">
                  <v-text-field
                    v-model="tunai"
                    outlined
                    dense
                    class="mb-0 mt-2"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="12" lg="12" class="py-0">
                  <div class="d-flex flex-row justify-space-between pa-2 pb-0 kembali">
                    <p>Kembali</p>
                    <p class="text-bold">Rp. {{ kembali }}</p>
                  </div>
                </v-col>
                <v-col cols="12" md="12" lg="12" class="py-0">
                  <v-btn class="mt-3" block color="primary" dark @click="submitTransaksi">Transaksi</v-btn>
                </v-col>
              </v-row>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- dialog edit -->
    <v-dialog v-model="dialogEdit" persistent max-width="290">
      <v-card class="pa-3 pt-0">
        <v-card-title>Edit Qty {{ selectedItem.nama }}</v-card-title>
        <v-text-field
          v-model="selectedItem.qty"
          outlined
          dense
          class="mb-0 mt-2"
        ></v-text-field>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error darken-1" text @click="dialogEdit = false">Cancel</v-btn>
          <v-btn color="success" dark @click="editQty">Edit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- dialog sukses -->
    <v-dialog persistent v-model="dialogSuccess" max-width="400px">
      <v-card class="pt-8 pb-6 px-4">
        <v-card-text>
          <div class='dialog'>
            <v-icon size="140" color="success" class="mb-4">mdi-checkbox-marked-circle</v-icon>
            <p class="paragraph-3">Sukses!</p>
            <p class="paragraph-4">Transaksi berhasil disimpan</p>
            <v-btn color="primary" block @click="closeDialogSuccess">
              Tutup
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { openDB } from 'idb';

export default {
  data() {
    return {
      dialogEdit: false,
      dialogSuccess: false,
      search: null,
      nomorMeja: 0,
      potonganHarga: 0,
      tunai: 0,
      selectedItem: {
        nama: null,
        qty: 1
      },
      activeView: 'minuman',
      listView: [
        {
          nama: 'Jus Jeruk',
          harga: 15000,
          qty: 1,
          diskon: 0,
          total: 15000
        },
        {
          nama: 'Thai Tea',
          harga: 70000,
          qty: 1,
          diskon: 0,
          total: 70000
        },
        {
          nama: 'Es Teh Manis',
          harga: 5000,
          qty: 1,
          diskon: 0,
          total: 5000
        }
      ],
      minuman: [
        {
          nama: 'Jus Jeruk',
          harga: 15000,
          qty: 1,
          diskon: 0,
          total: 15000
        },
        {
          nama: 'Thai Tea',
          harga: 70000,
          qty: 1,
          diskon: 0,
          total: 70000
        },
        {
          nama: 'Es Teh Manis',
          harga: 5000,
          qty: 1,
          diskon: 0,
          total: 5000
        },
        {
          nama: 'Teh Manis Panas',
          harga: 4000,
          qty: 1,
          diskon: 0,
          total: 5000
        }
      ],
      makanan: [
        {
          nama: 'Seblak',
          harga: 10000,
          qty: 1,
          diskon: 0,
          total: 10000
        },
        {
          nama: 'Batagor',
          harga: 12000,
          qty: 1,
          diskon: 0,
          total: 12000
        }
      ],
      coffee: [],
      jus: [],
      ayam: [],
      dessert: [],
      headers: [
        { text: 'Produk', value: 'nama', sortable: false },        
        { text: 'Harga', value: 'harga', sortable: false },
        { text: 'Qty', value: 'qty', sortable: false },
        { text: 'Diskon', value: 'diskon', sortable: false },
        { text: 'Total', value: 'total', sortable: false },
        { text: 'Aksi', value: 'actions', sortable: false }
      ],
      selectedMenu: []
    }
  },
  computed: {
    resultSearch(){
      if(this.search){
        return this.listView.filter((item) => {
          return this.search.toLowerCase().split(' ').every(v => item.nama.toLowerCase().includes(v))
        })
      } else {
        return this.listView;
      }
    },
    total() {
      const totalHarga = this.selectedMenu.map(tot => tot.total)
      let totalAll = 0
      totalHarga.forEach(element => {
        totalAll += element
      });
      return totalAll
    },
    kembali() {
      if (this.tunai === 0) {
        return 0
      } else {
        return this.tunai - this.total
      }
    }
  },
  watch: {
    activeView(val) {
      if (val === 'minuman') {
        this.listView = this.minuman
      } else if (val === 'makanan') {
        this.listView = this.makanan
      } else if (val === 'jus') {
        this.listView = this.jus
      } else if (val === 'coffee') {
        this.listView = this.coffee
      } else if (val === 'ayam') {
        this.listView = this.ayam
      } else {
        this.listView = []
      }
    }
  },
  methods: {
    closeDialogSuccess() {
      this.dialogSuccess = false
      this.selectedMenu = []
      this.tunai = 0
    },
    changeView(val) {
      this.activeView = val
    },
    addMenu(item) {
      const found = this.selectedMenu.some(el => el.nama === item.nama);
      if (!found) {
        this.selectedMenu.push(item)
      } else {
        alert('Menu sudah ditambahkan')
      }
    },
    deleteMenu(item) {
      this.selectedMenu.splice(this.selectedMenu.indexOf(item), 1)
    },
    goToEdit(item) {
      this.dialogEdit = true
      this.selectedItem = item
    },
    editQty() {
      const dataEdit = {
        nama: this.selectedItem.nama,
        harga: this.selectedItem.harga,
        qty: this.selectedItem.qty,
        diskon: this.selectedItem.diskon,
        total: this.selectedItem.harga * this.selectedItem.qty
      }
      
      this.selectedMenu.forEach((element) => {
        if (element.nama === dataEdit.nama) {
          element['qty'] = dataEdit.qty
          element['total'] = dataEdit.total
        }
      });

      this.dialogEdit = false
    },
    submitTransaksi() {
      this.dialogSuccess = true
    },    
    createStore() {
      openDB('vue-pos', 1, {
        upgrade(db) {
          db.createObjectStore('product', { keyPath: 'id' });
          db.createObjectStore('category', { keyPath: 'id' });
        },
      });
    }
  },
  created() {
    this.createStore()
  }
}
</script>

<style scoped lang="scss">
.app-content {
  min-height: 100vh;
}

.total {
  background-color: #2B81D6;
  color: white;
}

.kembali {
  background-color:#FF4F4F;
  color: white;
}

.dialog {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .paragraph-3 {
    font-weight: bold;
    font-size: 25px;
    line-height: 18px;
  }
  .paragraph-4 {
    font-weight: bold;
    font-size: 18px;
    line-height: 25px;
    text-align: center;
  }
}
</style>
