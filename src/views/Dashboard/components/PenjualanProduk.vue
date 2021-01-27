<template>
  <div>
    <v-card
      outlined
      flat
      min-height="90vh"
      class="d-flex align-start flex-column pb-8"
    >
      <div class="table mb-auto w-full">
        <v-data-table
          :headers="headers"
          :items="$store.state.selectedProduct"
          class="elevation-1 scrollbar-custom"
          hide-default-footer
          @click:row="goToEdit"
        ></v-data-table>
      </div>
      <div class="w-full px-3 mt-4">
        <v-row>
          <v-col cols="6" md="6" lg="6" class="py-0">
            Diskon
          </v-col>
          <v-col cols="6" md="6" lg="6" class="py-0">
            <div class="d-flex flex-row justify-end">
              <p class="text-bold mr-2">Rp. {{ formatCurrency(discount) }},00</p>
            </div>
          </v-col>
          <v-col cols="12" md="12" lg="12" class="py-0">
            <div class="d-flex flex-row justify-space-between pa-2 pb-0 total">
              <p>Total</p>
              <p class="text-bold">Rp. {{ formatCurrency(total) }},00</p>
            </div>
          </v-col>
          <v-col cols="12" md="6" lg="6" class="py-0">
            <p class="mt-2">Tunai</p>
          </v-col>
          <v-col cols="12" md="6" lg="6" class="py-0">
            <v-text-field
              v-model="cash"
              outlined
              dense
              class="mb-0 mt-2"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="12" lg="12" class="py-0">
            <div class="d-flex flex-row justify-space-between pa-2 pb-0 kembali">
              <p>Kembali</p>
              <p class="text-bold">Rp. {{ formatCurrency(moneyChange) }},00</p>
            </div>
          </v-col>
          <v-col cols="12" md="12" lg="12" class="py-0">
            <v-btn class="mt-3" block color="primary" dark @click="submitTransaction">Transaksi</v-btn>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cash: 0,
      headers: [
        { text: 'Produk', value: 'product.name', sortable: false },        
        { text: 'Harga', value: 'product.price', sortable: false },
        { text: 'Qty', value: 'qty', sortable: false },
        { text: 'Diskon', value: 'discount', sortable: false },
        { text: 'Total', value: 'total', sortable: false },
        { text: '', value: 'actions', sortable: false }
      ]
    }
  },
  computed: {
    total() {
      const totalAll = this.$store.state.selectedProduct.reduce((acc, prod) => acc + parseInt(prod.total), 0);
      return totalAll;
    },
    discount() {
      const disc = this.$store.state.selectedProduct.reduce((acc, prod) => acc + parseInt(prod.discount), 0);
      return disc
    },
    moneyChange() {
      if (this.cash === 0) {
        return 0;
      } else {
        return this.cash - this.total;
      }
    }
  },
  methods: {
    goToEdit(item) {
      this.$emit('editProduct', item);
    },
    formatCurrency(val) {
      return val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
    },
    randomId() {
      var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      var uniqid = 'tr-' + randLetter + Date.now();
      return uniqid
    },
    dateTime() {
      return new Date().toLocaleString();
    },
    submitTransaction() {
      let prod = this.$store.state.selectedProduct;
      prod.forEach(element => {
        element.stock -= element.qty
      });

      let dataForm = {
        id: this.randomId(),
        products_sold: prod,
        time: this.dateTime(),
        total_discount: this.discount,
        money_change: this.moneyChange,
        cash: this.cash,
        total: this.total
      }
      
      this.$emit('saveTransaction', dataForm)
    },
  },
  created() {
    if (this.$store.state.selectedTx.cash !== undefined) {
      this.cash = this.$store.state.selectedTx.cash;
    }
  },
}
</script>

<style lang="scss">
.total {
  background-color: #2B81D6;
  color: white;
}

.kembali {
  background-color:#FF4F4F;
  color: white;
}
</style>
