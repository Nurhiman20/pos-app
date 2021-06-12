<template>
  <div>
    <v-card
      outlined
      flat
      min-height="90vh"
      class="d-flex align-start flex-column pb-8"
    >
      <div class="mb-auto w-full">
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
          <v-col cols="12">
            <v-autocomplete
              v-model="customer"
              :items="$store.state.listCustomer"
              :item-text="textCustomer"
              :item-value="valueCustomer"
              label="Pelanggan"
              outlined
              dense
              hide-no-data
              hide-details
              :clearable="true"
            ></v-autocomplete>
            <v-autocomplete
              v-model="tableNumber"
              :items="$store.state.listTable"
              :item-text="textTable"
              :item-value="valueTable"
              label="Nomor Meja"
              class="mt-6"
              outlined
              dense
              hide-no-data
              hide-details
              :clearable="true"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="12" lg="12" class="py-0">
            <v-btn class="mt-3" block color="primary" @click="submitTransaction" v-if="Object.keys(this.$store.state.selectedTx).length === 0">Transaksi</v-btn>
            <v-btn class="mt-3" block color="secondary" @click="goToPayment" :disabled="$store.state.selectedProduct.length === 0" v-if="Object.keys(this.$store.state.selectedTx).length === 0">Lanjut Pembayaran</v-btn>
            <v-btn class="mt-3" block color="primary" @click="goEditPayment" :disabled="$store.state.selectedProduct.length === 0" v-if="Object.keys(this.$store.state.selectedTx).length !== 0">Edit Pembayaran</v-btn>
            <v-btn class="mt-3" block color="secondary" outlined dark @click="cancelEdit" v-if="Object.keys(this.$store.state.selectedTx).length !== 0">Batal Edit Transaksi</v-btn>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </div>
</template>

<script>
import * as moment from 'moment';

export default {
  data() {
    return {
      cash: 0,
      customer: null,
      tableNumber: null,
      toPayment: false,
      headers: [
        { text: 'Produk', value: 'name', sortable: false },        
        { text: 'Harga', value: 'price', sortable: false },
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
    textCustomer(item) {
      return item.name + ' - ' + item.phone_number
    },
    valueCustomer(item) {
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
    randomId() {
      var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      var uniqid = 'tr-' + randLetter + Date.now();
      return uniqid
    },
    dateTime() {
      return moment().format('DD/MM/YYYY, HH:mm:ss');
    },
    goToEdit(item) {
      this.$emit('editProduct', item);
    },
    cancelEdit() {
      this.$store.commit("SET_EDIT_TX", null);
      this.$router.push('/laporan/transaksi');
    },
    goEditPayment() {
      let editedTx = this.$store.state.selectedTx;
      if (this.customer !== editedTx.customer) {
        editedTx.customer = this.customer;
      }
      if (this.tableNumber !== editedTx.table_number) {
        editedTx.table_number = this.tableNumber;
      }
      editedTx.products_sold = this.$store.state.selectedProduct;

      this.$store.commit('SET_EDIT_TX', editedTx);
      this.$emit('goEditPayment', editedTx);
    },
    goToPayment() {
      this.toPayment = true;
      this.submitTransaction();
    },
    submitTransaction() {
      let prod = this.$store.state.selectedProduct;

      let dataForm = {
        id: this.randomId(),
        id_outlet: this.$store.state.account.id,
        products_sold: prod,
        time: this.dateTime(),
        total_discount: this.discount,
        tax: parseInt(this.$store.state.account.tax) * this.total / 100,
        total: this.total + (parseInt(this.$store.state.account.tax) * this.total / 100),
        status: 'Antre',
        queue: this.$store.getters.transactionQueue,
        payment: []
      }

      if (this.customer === null) {
        dataForm.customer = {
          id: 'default-customer-0000',
          name: 'Default',
          phone_number: '-',
          email: '-'
        }
      } else {
        dataForm.customer = this.customer;
      }

      if (this.tableNumber === null) {
        dataForm.table_number = {
          id: 'default-table-0000',
          table_number: 0,
          capacity: '-',
          id_outlet: this.$store.state.account.id,
          outlet: this.$store.state.account
        }
      } else {
        dataForm.table_number = this.tableNumber;
      }
      
      this.$store.dispatch("submitTransaction", dataForm)
        .then(() => {         
          this.$store.commit("SET_SELECTED_PRODUCT", []);     
          this.customer = null;
          this.tableNumber = null;          
          this.$emit("success", "Transaksi telah disimpan");
          if (this.toPayment === true) {
            this.$store.commit("SET_SELECTED_PRODUCT", dataForm.products_sold);   
            this.$emit("toPayment", dataForm);
          }
          this.toPayment = false;
        })
        .catch(() => {
          this.$emit("error", "Terjadi masalah. Silahkan coba lagi nanti");
        });
    },
  },
  created() {
    if (this.$store.state.selectedTx.customer !== undefined && this.$store.state.selectedTx.table_number !== undefined) {
      this.customer = this.$store.state.selectedTx.customer;
      this.tableNumber = this.$store.state.selectedTx.table_number;
    }
  },
}
</script>

<style lang="scss">
.total {
  background-color: var(--v-primary-base);
  color: var(--v-secondary-base);
}

.kembali {
  background-color:var(--v-secondary-base);
  color: var(--v-primary-base);
}
</style>
