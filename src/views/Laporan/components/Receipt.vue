<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <v-card-title class="ml-0">E-Receipt</v-card-title>
        <div class="receipt pa-3 mb-3 pb-12">
          <div class="d-flex flex-column justify-center border-bottom">
            <h2 class="text-center">Lorem Ipsum</h2>
            <p class="app-subtitle text-center">Jl. Kalijati Indah 6, Antapani, Bandung<br>
              <v-icon class="" color="#9A9A9A" size="15">mdi-phone</v-icon>
              081234567
            </p>
          </div>
          <div class="d-flex flex-row justify-space-between mt-2">
            <p>Waktu</p>
            <p>{{ this.selected.time }}</p>
          </div>
          <div class="d-flex flex-row justify-space-between mt-n3">
            <p>ID Receipt</p>
            <p>{{ this.selected.id }}</p>
          </div>
          <div class="d-flex flex-row justify-space-between mt-n3 border-bottom">
            <p>Nomor Meja</p>
            <p>{{ this.selected.table_number }}</p>
          </div>
          <div class="mt-2 pb-2 product border-bottom">
            <v-row v-for="(prod, i) in this.selected.products_sold" :key="i" no-gutters>
              <v-col cols="4">
                <p class="mb-1 ">{{ prod.product.name }}</p>
              </v-col>
              <v-col cols="4">
                <p class="mb-1 text-center">x{{ prod.qty }}</p>
              </v-col>
              <v-col cols="4">
                <p class="mb-1 text-right">Rp{{ formatCurrency(prod.product.price) }},00</p>
              </v-col>
            </v-row>
          </div>
          <div class="mt-2 d-flex flex-row justify-space-between border-bottom">
            <p>Total Diskon</p>
            <p>Rp{{ formatCurrency(this.selected.total_discount) }},00</p>
          </div>
          <div class="mt-2 d-flex flex-row justify-space-between">
            <h3>Total</h3>
            <h3>Rp{{ formatCurrency(this.selected.total) }},00</h3>
          </div>
          <div class=" mt-2 d-flex flex-row justify-space-between">
            <p>Tunai</p>
            <p>Rp{{ formatCurrency(this.selected.cash) }},00</p>
          </div>
          <div class="mt-n3 d-flex flex-row justify-space-between border-bottom">
            <p>Change</p>
            <p>Rp{{ formatCurrency(this.selected.money_change) }},00</p>
          </div>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="warning darken-1" text @click="closeDialog">Tutup</v-btn>
          <v-btn color="success" dark :loading="$store.state.loading">
            <v-icon class="mr-2">mdi-printer</v-icon>
            Cetak
          </v-btn>
          <v-btn color="primary" dark @click="editTransaction" :loading="$store.state.loading">            
            <v-icon class="mr-2">mdi-pencil</v-icon>
            Edit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ['show', 'selected'],
  methods: {
    formatCurrency(val) {
      return val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
    },
    closeDialog() {
      this.$emit('closeDialog', false);
    },
    editTransaction() {
      this.$store.commit("SET_EDIT_TX", this.selected);
      this.$router.push('/dashboard');
    }
  },
}
</script>

<style lang="scss" scoped>
.receipt {
  width: 100%;
  background-color: #FFFFFF !important;
  color: rgb(22, 22, 22);
  .product {
    font-size: 1.3em;
  }
}
</style>
