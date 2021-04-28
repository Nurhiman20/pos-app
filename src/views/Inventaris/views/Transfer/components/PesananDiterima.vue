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
      </div>
      <v-data-table
        :headers="headers"
        :items="$store.getters.listRvOrderTransfer"
        :search="search"
        class="elevation-1 scrollbar-custom mt-3"
        hide-default-footer
        @click:row="showDialogDetail"
      >
        <template v-slot:item.ingredients="{item}">
          <p class="my-auto">{{ item.ingredients.length }}</p>
        </template>
      </v-data-table>
    </v-card>

    <receive-order-dialog
      :show="dialogDetail"
      :selected="selectedOrder"
      @closeDialog="closeDialogDetail"
    ></receive-order-dialog>
  </div>
</template>

<script>
import receiveOrderDialog from './DetailPesananDiterima';

export default {
  components: {
    receiveOrderDialog
  },
  data() {
    return {
      search: null,
      select: null,
      itemOrder: [],
      listOrder: [],
      selectedOrder: {},
      headers: [
        { text: 'ID Pesanan', value: 'id', sortable: false },
        { text: 'Waktu', value: 'time', sortable: true },
        { text: 'Cabang Pengirim', value: 'outlet.name', sortable: true },
        { text: 'Bahan', value: 'ingredients', sortable: false }
      ],
      dialogDetail: false
    }
  },
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val);
    },
  },
  methods: {
    querySelections(v) {
      let listOrder = this.$store.getters.listRvOrderTransfer.map(item => item.outlet.name);
      this.itemOrder = listOrder.filter(e => {
        return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1;
      });
    },
    closeDialogDetail(e) {
      this.dialogDetail = e;
    },
    showDialogDetail(e) {
      this.selectedOrder = e;
      this.dialogDetail = true;
    }
  },
}
</script>
