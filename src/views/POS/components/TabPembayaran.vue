<template>
  <div>
    <v-card class="pa-3" outlined>
      <ValidationObserver ref="form" v-slot="{ handleSubmit }">
        <v-form @submit.prevent="handleSubmit(saveTransaction)">
          <ValidationProvider v-slot="{ errors }" name="Nomor meja" rules="">
            <v-autocomplete
              :error-messages="errors"
              v-model="tableNumber"
              :items="$store.state.listTable"              
              :item-text="textTable"
              :item-value="valueTable"
              label="Nomor Meja"
              class="mt-6 px-4"
              outlined
              dense
              hide-no-data
              hide-details
              :clearable="true"
            ></v-autocomplete>
          </ValidationProvider>
          <ValidationProvider v-slot="{ errors }" name="Pilih transaksi" rules="required">
            <v-autocomplete
              :error-messages="errors"
              v-model="tx"
              :items="$store.getters.listQueueTransaction"
              :item-text="textTx"
              :item-value="valueTx"
              label="Pilih Transaksi"
              class="mt-6 px-4"
              outlined
              dense
              hide-no-data
              hide-details
              :clearable="true"
            ></v-autocomplete>
          </ValidationProvider>
          <div class="px-4 mt-6" v-if="tx.products_sold !== undefined">
            <p>Produk Dibeli</p>
            <v-data-table
              :headers="headers"
              :items="tx.products_sold"
              class="elevation-1 scrollbar-custom"
              hide-default-footer
            ></v-data-table>
            <div class="d-flex flex-row justify-space-between mt-6">
              <p>Diskon</p>
              <p class="text-bold mr-2">Rp. {{ formatCurrency(discount) }},00</p>
            </div>
            <div class="d-flex flex-row justify-space-between pa-2 pb-0 total">
              <p>Total</p>
              <p class="text-bold">Rp. {{ formatCurrency(total) }},00</p>
            </div>
          </div>
          <ValidationProvider v-slot="{ errors }" name="Metode pembayaran" rules="required">
            <v-select
              v-model="paymentMethod"
              :error-messages="errors"
              :items="paymentMethods"
              label="Metode Pembayaran"
              class="mb-0 mt-6 px-4"
              outlined
              dense
            ></v-select>
          </ValidationProvider>
          <ValidationProvider v-slot="{ errors }" name="Tunai" rules="">
            <v-text-field
              v-model="cash"
              :error-messages="errors"
              label="Tunai"
              outlined
              dense
              class="mb-0 mt-2 px-4"
              v-if="paymentMethod === 'Tunai'"
            ></v-text-field>
          </ValidationProvider>
          <div class="px-4 mb-4" v-if="paymentMethod === 'Tunai'">            
            <div class="d-flex flex-row justify-space-between pa-2 pb-0 kembali">
              <p>Kembali</p>
              <p class="text-bold">Rp. {{ formatCurrency(moneyChange) }},00</p>
            </div>
          </div>
          <div class="px-4 pb-3">
            <v-btn class="mt-3" block color="primary" dark>Simpan Transaksi</v-btn>
          </div>
        </v-form>
      </ValidationObserver>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableNumber: null,
      tx: {},
      paymentMethod: null,
      cash: 0,
      paymentMethods: ['Tunai'],
      headers:  [
        { text: 'Produk', value: 'name', sortable: false },        
        { text: 'Harga', value: 'price', sortable: false },
        { text: 'Qty', value: 'qty', sortable: false },
        { text: 'Diskon', value: 'discount', sortable: false },
        { text: 'Total', value: 'total', sortable: false }
      ]
    }
  },
  computed: {
    total() {
      const totalAll = this.tx.products_sold.reduce((acc, prod) => acc + parseInt(prod.total), 0);
      return totalAll;
    },
    discount() {
      const disc = this.tx.products_sold.reduce((acc, prod) => acc + parseInt(prod.discount), 0);
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
  watch: {
    tableNumber(val) {
      this.$store.commit('SET_TABLE_TX', val);
    }
  },
  methods: {    
    textTx(item) {
      if (item.table_number !== undefined) {
        return item.id + ' | ' + item.time + ' | ' + item.table_number.table_number
      } else {
        return ''
      }
      
    },
    valueTx(item) {
      return item
    },
    textTable(item) {
      return item.table_number
    },
    valueTable(item) {
      return item
    },
    formatCurrency(val) {
      return val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
    },
    // submitTransaction() {
    //   let prod = this.$store.state.selectedProduct;

    //   let dataForm = {
    //     id: this.randomId(),
    //     id_outlet: this.$store.state.account.id,
    //     products_sold: prod,
    //     time: this.dateTime(),
    //     total_discount: this.discount,
    //     money_change: this.moneyChange,
    //     cash: this.cash,
    //     total: this.total
    //   }
      
    //   this.$emit('saveTransaction', dataForm)
    // }
  },
}
</script>