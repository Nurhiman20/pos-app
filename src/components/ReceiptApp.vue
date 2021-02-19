<template>
  <div>
    <div class="receipt pa-3 mb-3 pb-12" id="receipt">
      <div class="d-flex flex-column justify-center justify-content-start border-bottom">
        <h2 class="text-center">21FACTORY</h2>
        <p class="app-subtitle text-center">Jl. Veteran I No.21, RT.4/RW.2, Jakarta Pusat, DKI Jakarta 10110<br>
          <v-icon class="" color="#9A9A9A" size="15">mdi-phone</v-icon>
          081234567
        </p>
      </div>
      <div class="d-flex flex-row justify-space-between justify-content-between mt-2">
        <p>Waktu</p>
        <p>{{ this.selected.time }}</p>
      </div>
      <div class="d-flex flex-row justify-space-between justify-content-between mt-n3 border-bottom">
        <p>ID Receipt</p>
        <p>{{ this.selected.id }}</p>
      </div>
      <!-- <div class="d-flex flex-row justify-space-between mt-n3 border-bottom">
        <p>Nomor Meja</p>
        <p>{{ this.selected.table_number }}</p>
      </div> -->
      <div class="mt-2 pb-2 product border-bottom">
        <v-row v-for="(prod, i) in this.selected.products_sold" :key="i" no-gutters>
          <v-col cols="4">
            <p class="mb-1">{{ prod.name }}</p>
          </v-col>
          <v-col cols="4">
            <p class="mb-1 text-center">{{ prod.qty }} x {{ formatCurrency(prod.price) }}</p>
          </v-col>
          <v-col cols="4">
            <p class="mb-1 text-right">Rp{{ formatCurrency(prod.price*prod.qty) }},00</p>
          </v-col>
        </v-row>
      </div>
      <div class="mt-2 d-flex flex-row justify-space-between justify-content-between border-bottom">
        <p>Total Diskon</p>
        <p>Rp{{ formatCurrency(this.selected.total_discount) }},00</p>
      </div>
      <div class="mt-2 d-flex flex-row justify-space-between justify-content-between">
        <h3>Total</h3>
        <h3>Rp{{ formatCurrency(this.selected.total) }},00</h3>
      </div>
      <div class=" mt-2 d-flex flex-row justify-space-between justify-content-between">
        <p>Tunai</p>
        <p>Rp{{ formatCurrency(this.selected.cash) }},00</p>
      </div>
      <div class="mt-n3 d-flex flex-row justify-space-between justify-content-between border-bottom">
        <p>Change</p>
        <p>Rp{{ formatCurrency(this.selected.money_change) }},00</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['selected', 'print'],
  watch: {
    print(val) {
      if (val === true) {
        this.$htmlToPaper('receipt', null, () => {
          this.$emit('receiptPrinted', false);
        });
      }
    }
  },
  methods: {    
    formatCurrency(val) {
      return val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
    },
  },
}
</script>

<style lang="scss">
.receipt {
  width: 100%;
  background-color: #FFFFFF !important;
  color: rgb(22, 22, 22);
}
</style>