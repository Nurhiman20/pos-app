<template>
  <div>
    <div class="d-flex flex-row justify-space-between mb-2">
      <h1>{{ this.$store.state.detailInventory.name }}</h1>
    </div>
    <v-row>
      <v-col cols="12" md="6" lg="6" xl="6">
        <v-card class="pa-3 mt-4">          
          <div class="d-flex flex-row justify-space-between">
            <v-card-title>Pemesanan</v-card-title>
          </div>
          <v-data-table
            :headers="headersOrder"
            :items="$store.state.listOrder"
            class="elevation-1 scrollbar-custom"
            hide-default-footer
            @click:row="goToEdit"
          >
            <template v-slot:item.supplier="{item}">
              <p class="my-auto">Rp{{ countTotalOrder(item) }},00</p>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="6" xl="6">
        <v-card class="pa-3 mt-4">
          <div class="d-flex flex-row justify-space-between">
            <v-card-title>Penerimaan</v-card-title>
          </div>
          <v-data-table
            :headers="headersReceive"
            :items="$store.state.listReceive"
            class="elevation-1 scrollbar-custom"
            hide-default-footer
            @click:row="goToEdit"
          >
            <template v-slot:item.supplier="{item}">
              <p class="my-auto">Rp{{ countTotalCost(item) }},00</p>
            </template>
            <template v-slot:item.status="{item}">
              <div class="d-flex flex-row">
                <v-icon color="success" v-if="item.status === 'Terpenuhi'">mdi-check-decagram</v-icon>
                <v-icon color="error" v-else>mdi-alert-decagram</v-icon>
                <p class="my-auto ml-1">{{ item.status }}</p>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="6" xl="6">
        <v-card class="pa-3 mt-4">
          <div class="d-flex flex-row justify-space-between">
            <v-card-title>Transfer</v-card-title>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="6" xl="6">
        <v-card class="pa-3 mt-4">
          <div class="d-flex flex-row justify-space-between">
            <v-card-title>Adjustment</v-card-title>
          </div>
          <v-data-table
            :headers="headersAdjustment"
            :items="$store.state.listAdjustment"
            class="elevation-1 scrollbar-custom"
            hide-default-footer
            @click:row="goToEdit"
          >
            <template v-slot:item.expense_income="{item}">
              <p class="text-bold success--text my-auto" v-if="parseFloat(item.in_stock) - parseFloat(item.actual_stock) > 0">Rp{{ formatCurrency(countExIn(item)) }},00</p>
              <p class="text-bold error--text my-auto" v-else>- Rp{{ countExIn(item) * (-1) }},00</p>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card class="pa-3 mt-4">
          <div class="d-flex flex-row justify-space-between">
            <v-card-title>Transaction</v-card-title>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {      
      headersOrder: [
        { text: 'ID Order', value: 'id', sortable: false },
        { text: 'Waktu', value: 'time', sortable: true },
        { text: 'Supplier', value: 'supplier.name', sortable: true },
        { text: 'Total', value: 'supplier', sortable: false }
      ],
      headersReceive: [
        { text: 'ID', value: 'id', sortable: false },
        { text: 'ID Order', value: 'id_order', sortable: false },
        { text: 'Waktu', value: 'time', sortable: true },
        { text: 'Supplier', value: 'supplier.name', sortable: true },
        { text: 'Total', value: 'supplier', sortable: false },
        { text: 'Status', value: 'status', sortable: false }
      ],
      headersAdjustment: [
        { text: 'Waktu', value: 'time', sortable: false },
        { text: 'Bahan', value: 'ingredient.name', sortable: true },
        { text: 'Adjustment', value: 'adjustment', sortable: true },
        { text: 'Expense/Income', value: 'expense_income', sortable: true },
        { text: 'Keterangan', value: 'notes', sortable: true }
      ],
    }
  },
  methods: {
    formatCurrency(val) {
      return val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
    },
    countTotalOrder(item) {
      const total = item.ingredients.reduce((acc, ing) => acc + (ing.order * ing.unit_cost), 0);

      return this.formatCurrency(total)
    },
    countTotalCost(item) {
      const total = item.ingredients.reduce((acc, ing) => acc + (ing.order * ing.unit_cost), 0);

      return this.formatCurrency(total)
    },
    countExIn(item) {
      let count = (parseFloat(item.in_stock) - parseFloat(item.actual_stock)) * parseFloat(item.ingredient.price);
      return count.toFixed(0)
    },
    goToEdit() {}
  },
  created() {
    this.$store.dispatch("getInventoryById", this.$route.params.id);
    this.$store.dispatch("getOrder");
    this.$store.dispatch("getReceive");
  },
}
</script>
