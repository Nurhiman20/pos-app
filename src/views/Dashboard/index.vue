<template>
  <div>
    <div class="d-flex flex-row justify-space-between align-center">
      <h1>Dashboard</h1>
    </div>
    <div class="mt-3">
      <v-row justify="center">
        <v-col cols="12" md="3" lg="3">
          <v-card
            outlined
            flat
            class="pa-4"
          >
            <p class="app-subtitle text-center">Total Transaksi (Hari ini)</p>
            <div class="d-flex flex-column align-center mt-n2">
              <h1 class="secondary--text font-weight-bold">{{ $store.getters.totalTransactionToday }}</h1>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3" lg="3">
          <v-card
            outlined
            flat
            class="pa-4"
          >
            <p class="app-subtitle text-center">Total Transaksi (Month to Date)</p>
            <div class="d-flex flex-column align-center mt-n2">
              <h1 class="secondary--text font-weight-bold">{{ $store.getters.totalTransactionMonth }}</h1>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3" lg="3">
          <v-card
            outlined
            flat
            class="pa-4"
          >
            <p class="app-subtitle text-center">Total Pemasukan (Hari ini)</p>
            <div class="d-flex flex-column align-center mt-n2">
              <h1 class="success--text font-weight-bold">Rp{{ formatCurrency($store.getters.totalAmountToday) }},00</h1>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3" lg="3">
          <v-card
            outlined
            flat
            class="pa-4"
          >
            <p class="app-subtitle text-center">Total Pemasukan (Month to Date)</p>
            <div class="d-flex flex-column align-center mt-n2">
              <h1 class="success--text font-weight-bold">Rp{{ formatCurrency($store.getters.totalAmountMonth) }},00</h1>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3" lg="3">
          <v-card
            outlined
            flat
            class="pa-4"
          >
            <p class="app-subtitle text-center">Profit (Hari ini)</p>
            <div class="d-flex flex-column align-center mt-n2">
              <h1 class="primary--text font-weight-bold">Rp{{ formatCurrency($store.getters.totalProfitToday) }},00</h1>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3" lg="3">
          <v-card
            outlined
            flat
            class="pa-4"
          >
            <p class="app-subtitle text-center">Profit (Month to Date)</p>
            <div class="d-flex flex-column align-center mt-n2">
              <h1 class="primary--text font-weight-bold">Rp{{ formatCurrency($store.getters.totalProfitMonth) }},00</h1>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedDate: [],
      filterDate: false
    }
  },
  methods: {    
    formatCurrency(val) {
      return val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
    }
  },
  created() {
    this.$store.dispatch("getTransaction");
  },
}
</script>
