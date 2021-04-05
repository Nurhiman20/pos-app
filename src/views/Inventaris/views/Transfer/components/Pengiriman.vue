<template>
  <div>
    <v-card flat class="pa-4 mt-3">
      <div class="d-flex flex-row justify-space-between">
        <v-row no-gutters>
          <v-col cols="12" md="4" lg="4">
            <v-autocomplete
              v-model="select"
              :items="itemOrder"
              :search-input.sync="search"
              cache-items
              class="mt-n3"
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
        <v-btn class="ml-2 align-center" color="primary" small>Tambah Pengiriman</v-btn>
      </div>
      <v-data-table
        :headers="headers"
        :items="listOrder"
        :search="search"
        class="elevation-1 scrollbar-custom mt-3"
        hide-default-footer
      >
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: null,
      select: null,
      itemOrder: [],
      listOrder: [],
      headers: [
        { text: 'ID Pesanan', value: 'id', sortable: false },
        { text: 'Waktu', value: 'time', sortable: true },
        { text: 'Cabang Tujuan', value: 'outlet', sortable: true },
        { text: 'Bahan', value: 'ingredient', sortable: false }
      ],
    }
  },
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val);
    },
  },
  methods: {
    querySelections(v) {
      // let listOrder = this.$store.state.listOrder.map(item => item.supplier.name);
      let listOrder = this.listOrder;
      this.itemOrder = listOrder.filter(e => {
        return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1;
      });
    },
  },
}
</script>
