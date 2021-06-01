<template>
  <div>
    <div class="receipt pa-3 mb-3 pb-12" id="receipt">
      <div class="d-flex flex-column justify-center justify-content-start border-bottom">
        <div class="d-flex">
          <!-- <v-img :src="showImage" max-width="150" :aspect-ratio="4/3" class="mx-auto"></v-img> -->
          <img :src="showImage" style="max-width: 150px; margin: auto;">
        </div>
        <h2 class="text-center">{{ $store.state.account.receipt.outlet_name }}</h2>
        <p class="app-subtitle text-center">{{ $store.state.account.receipt.address }}<br>
          <v-icon class="" color="#9A9A9A" size="15">mdi-phone</v-icon>
          {{ $store.state.account.receipt.phone_number }}
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
          <v-col cols="4" v-if="prod.qty != 0">
            <p class="mb-1">{{ prod.name }}</p>
          </v-col>
          <v-col cols="4" v-if="prod.qty != 0">
            <p class="mb-1 text-center">{{ prod.qty }} x {{ formatCurrency(prod.price) }}</p>
          </v-col>
          <v-col cols="4" v-if="prod.qty != 0">
            <p class="mb-1 text-right">Rp{{ formatCurrency(prod.price*prod.qty) }},00</p>
          </v-col>
        </v-row>
      </div>
      <div class="mt-2 d-flex flex-row justify-space-between justify-content-between">
        <p>Total Diskon</p>
        <p>Rp{{ formatCurrency(this.selected.total_discount) }},00</p>
      </div>
      <div class="mt-n2 d-flex flex-row justify-space-between justify-content-between border-bottom">
        <p>Pajak ({{ this.$store.state.account.tax }}%)</p>
        <p>Rp{{ formatCurrency(this.selected.tax) }},00</p>
      </div>
      <div class="mt-2 d-flex flex-row justify-space-between justify-content-between">
        <h3>Total</h3>
        <h3>Rp{{ formatCurrency(this.selected.total) }},00</h3>
      </div>
      <div class=" mt-2 d-flex flex-row justify-space-between justify-content-between">
        <p>Tunai</p>
        <p v-if="this.selected.payment.length !== 0">Rp{{ formatCurrency(this.selected.payment[0].cash) }},00</p>
      </div>
      <div class="mt-n3 d-flex flex-row justify-space-between justify-content-between border-bottom">
        <p>Kembali</p>
        <p v-if="this.selected.payment.length !== 0">Rp{{ formatCurrency(this.selected.payment[0].moneyChange) }},00</p>
      </div>
      <div class="d-flex flex-row align-center mt-2" v-if="$store.state.account.receipt.website !== null">
        <img src="../assets/img/web.png" style="width: 18px; height: 18px; margin: auto 0;">
        <p class="my-auto ml-1">{{ $store.state.account.receipt.website }}</p>
      </div>
      <div class="d-flex flex-row align-center mt-2" v-if="$store.state.account.receipt.ig !== null">
        <img src="../assets/img/instagram.png" style="width: 18px; height: 18px; margin: auto 0;">
        <p class="my-auto ml-1">{{ $store.state.account.receipt.ig }}</p>
      </div>
      <div class="d-flex flex-row align-center mt-2" v-if="$store.state.account.receipt.fb !== null">
        <img src="../assets/img/facebook.png" style="width: 18px; height: 18px; margin: auto 0;">
        <p class="my-auto ml-1">{{ $store.state.account.receipt.fb }}</p>
      </div>
      <div class="d-flex flex-row align-center mt-2" v-if="$store.state.account.receipt.twitter !== null">
        <img src="../assets/img/twitter.png" style="width: 18px; height: 18px; margin: auto 0;">
        <p class="my-auto ml-1">{{ $store.state.account.receipt.twitter }}</p>
      </div>
      <div class="d-flex flex-row mt-2">
        <p class="mx-auto">{{ $store.state.account.receipt.notes }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['selected', 'print'],
  computed: {
    showImage() {
      let logo = null;
      if (this.$store.state.account.receipt.logo !== undefined) {
        logo = URL.createObjectURL(this.$store.state.account.receipt.logo);
      }
      return logo
    }
  },
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
    }
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