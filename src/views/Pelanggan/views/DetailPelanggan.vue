<template>
  <div>
    <div class="d-flex flex-row justify-space-between mb-2">
      <h1>{{ this.$store.state.detailCustomer.name }}</h1>
    </div>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-3 mt-4">
          <div class="d-flex flex-row justify-space-between">
            <v-card-title>Tentang Pengguna</v-card-title>
          </div>
          <v-container>
            <v-row>
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-row no-gutters>
                  <v-col cols="4">
                    <p>ID</p>
                  </v-col>
                  <v-col cols="8">
                    <p class="text-bold">{{ this.$store.state.detailCustomer.id }}</p>
                  </v-col>
                  <v-col cols="4">
                    <p>Name</p>
                  </v-col>
                  <v-col cols="8">
                    <p class="text-bold">{{ this.$store.state.detailCustomer.name }}</p>
                  </v-col>
                  <v-col cols="4">
                    <p>Nomor HP</p>
                  </v-col>
                  <v-col cols="8">
                    <p class="text-bold">{{ this.$store.state.detailCustomer.phone_number }}</p>
                  </v-col>
                </v-row>
              </v-col>            
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-row no-gutters>
                  <v-col cols="4">
                      <p>Email</p>
                    </v-col>
                    <v-col cols="8">
                      <p class="text-bold">{{ this.$store.state.detailCustomer.email }}</p>
                    </v-col>
                    <v-col cols="4">
                      <p>Jumlah Transaksi</p>
                    </v-col>
                    <v-col cols="8">
                      <p class="text-bold">{{ this.$store.getters.countCustomerTx }}</p>
                    </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card class="pa-3 mt-4">
          <div class="d-flex flex-row justify-space-between">
            <v-card-title>Transaksi</v-card-title>
          </div>
          <v-data-table
            :headers="headersTransaction"
            :items="$store.getters.viewCustomerTx"
            class="elevation-1 scrollbar-custom"
            hide-default-footer
          >
            <template v-slot:item.products_sold="{item}">
              <div v-for="(prod, index) in item.products_sold" :key="index">
                <div class="d-flex flex-row align-center py-2">
                  <v-img :src="showImage(prod.image)" min-width="60" max-width="60" :aspect-ratio="4/3"></v-img>
                  <div class="ml-2 mt-4">
                    <p class="text-bold mb-0">{{ prod.name }} ({{ prod.qty }})</p>
                    <p class="app-subtitle">Rp{{ formatCurrency(prod.price) }},00</p>
                  </div>
                </div>
              </div>
            </template>
            <template v-slot:item.total="{item}">
              <p>Rp{{ formatCurrency(item.total) }},00</p>
            </template>
            <template v-slot:item.date="{item}">
              <p>{{ item.time }}</p>
            </template>
            <template v-slot:item.time="{item}">
              <p>{{ item.time }}</p>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      headersTransaction: [
        { text: 'Tanggal', value: 'date', sortable: true },
        { text: 'Waktu', value: 'time', sortable: true },
        { text: 'ID Transaksi', value: 'id', sortable: false },
        { text: 'Produk', value: 'products_sold', sortable: false },
        { text: 'Total Harga', value: 'total', sortable: false }
      ]
    }
  },
  methods: {
    formatCurrency(val) {
      return val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
    },    
    showImage(item) {
      if (item !== null) {
        return URL.createObjectURL(item);
      } else {
        return null;
      }
    },
    goToEdit() {}
  },
  created() {
    this.$store.dispatch("getCustomer");
    this.$store.dispatch("getCustomerById", this.$route.params.id);
    this.$store.dispatch("getTransaction");    
  }
}
</script>
