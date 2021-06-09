<template>
  <div>
    <div class="d-flex flex-row justify-space-between mb-2">
      <h1>{{ this.$store.state.detailInventory.name }}</h1>
    </div>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-3 mt-4">
          <div class="d-flex flex-row justify-space-between">
            <v-card-title>Stok Saat Ini</v-card-title>
          </div>
          <v-container>
            <v-row>
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-row no-gutters>
                  <v-col cols="4">
                    <p>ID</p>
                  </v-col>
                  <v-col cols="8">
                    <p class="text-bold">{{ this.$store.state.detailInventory.id }}</p>
                  </v-col>
                  <v-col cols="4">
                    <p>Cabang</p>
                  </v-col>
                  <v-col cols="8">
                    <p class="text-bold">{{ this.$store.state.account.name }}</p>
                  </v-col>
                  <v-col cols="4">
                    <p>Waktu Stok Awal</p>
                  </v-col>
                  <v-col cols="8">
                    <p class="text-bold" v-if="this.$store.state.detailInventory.tx !== undefined">{{ this.$store.state.detailInventory.tx[0].time }}</p>
                  </v-col>
                  <v-col cols="4">
                    <p>Waktu Terakhir Transaksi</p>
                  </v-col>
                  <v-col cols="8">
                    <p class="text-bold" v-if="this.$store.state.detailInventory.tx !== undefined">{{ this.$store.state.detailInventory.tx[this.$store.state.detailInventory.tx.length - 1].time }}</p>
                  </v-col>
                </v-row>
              </v-col>            
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-row no-gutters>
                  <v-col cols="4">
                      <p>Stok Awal</p>
                    </v-col>
                    <v-col cols="8">
                      <p class="text-bold" v-if="this.$store.state.detailInventory.tx !== undefined">{{ this.$store.state.detailInventory.tx[0].qty }}</p>
                    </v-col>
                    <v-col cols="4">
                      <p>Stok Akhir</p>
                    </v-col>
                    <v-col cols="8">
                      <p class="text-bold">{{ this.$store.state.detailInventory.ending_stock }}</p>
                    </v-col>
                    <v-col cols="4">
                      <p>Harga Beli Tertinggi</p>
                    </v-col>
                    <v-col cols="8">
                      <p class="text-bold" v-if="this.$store.state.detailInventory.tx !== undefined">Rp{{ formatCurrency(this.$store.getters.viewHighestCost) }},00</p>
                    </v-col>
                    <v-col cols="4">
                      <p v-if="this.$store.state.detailInventory.tx !== undefined && this.$store.state.detailInventory.id.indexOf('prod') !== -1">Profit</p>
                    </v-col>
                    <v-col cols="8">
                      <p class="text-bold" v-if="this.$store.state.detailInventory.tx !== undefined && this.$store.state.detailInventory.id.indexOf('prod') !== -1">Rp{{ formatCurrency(this.$store.getters.profitInventory) }},00</p>
                    </v-col>                    
                    <v-col cols="4">
                      <p v-if="this.$store.state.detailInventory.tx !== undefined">Value</p>
                    </v-col>
                    <v-col cols="8">
                      <p class="text-bold" v-if="this.$store.state.detailInventory.tx !== undefined">Rp{{ formatCurrency(this.$store.getters.valueInventory) }},00</p>
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
            <v-card-title>Riwayat</v-card-title>
          </div>
          <v-data-table
            :headers="headersHistory"
            :items="$store.state.detailInventory.tx"
            class="elevation-1 scrollbar-custom"
          >
            <template v-slot:item.qty="{item}">
              <p class="my-auto">{{ parseFloat(item.qty).toFixed(2) }}</p>
            </template>
            <template v-slot:item.unit_cost="{item}">
              <p class="my-auto" v-if="(item.id.indexOf('rv') !== -1 && item.id.indexOf('tf') === -1) || item.id.indexOf('first') !== -1">Rp{{ formatCurrency(item.unit_cost) }},00</p>
            </template>
            <template v-slot:item.total_price="{item}">
              <p class="my-auto" v-if="(item.id.indexOf('rv') !== -1 && item.id.indexOf('tf') === -1) || item.id.indexOf('first') !== -1">Rp{{ formatCurrency(parseFloat(item.unit_cost) * parseFloat(item.qty)) }},00</p>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="6" xl="6">
        <v-card class="pa-3 mt-4">          
          <div class="d-flex flex-row justify-space-between">
            <v-card-title>Pemesanan</v-card-title>
          </div>
          <v-data-table
            :headers="headersOrder"
            :items="$store.getters.orderOnDetail"
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
            :items="$store.getters.receiveOnDetail"
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
            :items="$store.getters.adjustmentOnDetail"
            class="elevation-1 scrollbar-custom"
            hide-default-footer
            @click:row="goToEdit"
          >
            <template v-slot:item.expense_income="{item}">
              <p class="text-bold success--text my-auto" v-if="parseFloat(item.in_stock) - parseFloat(item.actual_stock) > 0">Rp{{ formatCurrency(countExIn(item)) }},00</p>
              <p class="text-bold error--text my-auto" v-else>- Rp{{ formatCurrency(countExIn(item) * (-1)) }},00</p>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card class="pa-3 mt-4">
          <div class="d-flex flex-row justify-space-between">
            <v-card-title>Transaksi</v-card-title>
          </div>
          <v-data-table
            :headers="headersTransaction"
            :items="$store.getters.transactionOnDetail"
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
      headersHistory: [
        { text: 'ID', value: 'id', sortable: false },
        { text: 'Waktu', value: 'time', sortable: true },
        { text: 'Jenis', value: 'type', sortable: true },
        { text: 'Qty', value: 'qty', sortable: true },
        { text: 'Harga Satuan', value: 'unit_cost', sortable: true },
        { text: 'Total Harga', value: 'total_price', sortable: true }
      ],
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
    this.$store.dispatch("getInventory");
    this.$store.dispatch("getInventoryById", this.$route.params.id);
    this.$store.dispatch("getOrder");
    this.$store.dispatch("getReceive");
    this.$store.dispatch("getAdjustment");
    this.$store.dispatch("getTransaction");    
  }
}
</script>
