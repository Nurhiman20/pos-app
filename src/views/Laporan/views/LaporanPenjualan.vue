<template>
  <div>
    <div class="d-flex flex-row justify-space-between align-center">
      <h1>Laporan Penjualan</h1>
    </div>

    <v-card outlined flat class="pa-4 mt-3">
      <v-row>
        <v-col cols="12" md="4" lg="4">
          <v-autocomplete
            v-model="select"
            :items="itemTransaction"
            :search-input.sync="search"
            cache-items
            class="my-4"
            outlined
            dense
            hide-no-data
            hide-details
            :clearable="true"
            label="Cari..."
            append-icon="mdi-magnify"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-data-table
        :headers="headers"
        :items="$store.state.listTransaction"
        :search="search"
        class="elevation-1 scrollbar-custom"
        hide-default-footer
        @click:row="goToEdit"
      >
        <template v-slot:item.products_sold="{item}">
          <div v-for="(prod, index) in item.products_sold" :key="index">
            <div class="d-flex flex-row align-center py-2">
              <v-img :src="showImage(prod.product.image)" min-width="60" max-width="60" :aspect-ratio="4/3"></v-img>
              <div class="ml-2 mt-4">
                <p class="text-bold mb-0">{{ prod.product.name }} ({{ prod.qty }})</p>
                <p class="app-subtitle">Rp{{ formatCurrency(prod.product.price) }},00</p>
              </div>
            </div>
          </div>
        </template>
        <template v-slot:item.customer_name="{item}">
          <p class="mb-0 mt-4">{{ item.customer_name }}</p>
          <p class="app-subtitle">{{ item.phone_number }}</p>
        </template>
        <template v-slot:item.total_discount="{item}">
          <p>Rp{{ formatCurrency(item.total_discount) }},00</p>
        </template>
        <template v-slot:item.total="{item}">
          <p>Rp{{ formatCurrency(item.total) }},00</p>
        </template>
        <template v-slot:item.cash="{item}">
          <p>Rp{{ formatCurrency(item.cash) }},00</p>
        </template>
        <template v-slot:item.money_change="{item}">
          <p>Rp{{ formatCurrency(item.money_change) }},00</p>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      itemTransaction: [],
      select: null,
      search: null,
      headers: [
        { text: 'Waktu', value: 'time', sortable: true },
        { text: 'ID Transaksi', value: 'id', sortable: false },
        { text: 'Pelanggan', value: 'customer_name', sortable: false },
        { text: 'Nomor Meja', value: 'table_number', sortable: false },
        { text: 'Produk', value: 'products_sold', sortable: false },
        { text: 'Diskon', value: 'total_discount', sortable: false },
        { text: 'Total Harga', value: 'total', sortable: false },
        { text: 'Tunai', value: 'cash', sortable: false },
        { text: 'Kembali', value: 'money_change', sortable: false },
      ],
    }
  },
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val);
    }
  },
  methods: {
    querySelections(v) {
      let listTransaction = this.$store.state.listTransaction.map(item => item.id);
      this.itemTransaction = listTransaction.filter(e => {
        return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1;
      });
    },
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
    goToEdit(e) {
      this.$store.commit("SET_EDIT_TX", e);
      this.$router.push('/dashboard');
    }
  },
  created() {
    this.$store.dispatch("getTransaction");
  },
}
</script>
