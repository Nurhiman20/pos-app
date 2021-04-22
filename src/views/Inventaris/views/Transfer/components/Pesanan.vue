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
        <v-btn class="ml-2 align-center" color="primary" small @click="showDialogAdd">Tambah Pesanan</v-btn>
      </div>
      <v-data-table
        :headers="headers"
        :items="$store.getters.listOrderTransfer"
        :search="search"
        class="elevation-1 scrollbar-custom mt-3"
        hide-default-footer
      >
      </v-data-table>
    </v-card>

    <add-order-dialog
      :show="dialogAdd"
      @success="successPutOrder"
      @error="failedAddOrder"
      @closeDialog="closeDialogAdd"
    ></add-order-dialog>

    <!-- response dialog -->
    <response-dialog 
      :success="dialogSuccess"
      :failed="dialogFailed"
      :message="messageDialog"
      @closeSuccess="closeDialogSuccess"
      @closeFailed="closeDialogFailed"
    ></response-dialog>
  </div>
</template>

<script>
import addOrderDialog from './TambahPesanan';
import responseDialog from '@/components/ResponseDialog';

export default {
  components: {
    addOrderDialog,
    responseDialog
  },
  data() {
    return {
      search: null,
      select: null,
      itemOrder: [],
      headers: [
        { text: 'ID Pesanan', value: 'id', sortable: false },
        { text: 'Waktu', value: 'time', sortable: true },
        { text: 'Cabang Tujuan', value: 'destination_outlet.name', sortable: true },
        { text: 'Bahan', value: 'ingredient', sortable: false }
      ],
      dialogAdd: false,
      dialogSuccess: false,
      dialogFailed: false,
      dialogConfirm: false,
      messageDialog: null
    }
  },
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val);
    },
  },
  methods: {
    querySelections(v) {
      let listOrder = this.$store.getters.listOrderTransfer.map(item => item.destination_outlet);
      this.itemOrder = listOrder.filter(e => {
        return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1;
      });
    },
    closeDialogAdd(e) {
      this.dialogAdd = e;
    },
    showDialogAdd() {
      this.dialogAdd = true;
    },
    closeDialogSuccess(e) {
      this.dialogAdd = false;
      // this.dialogEditOrder = false;
      this.dialogSuccess = e;
    },
    closeDialogFailed(e) {
      this.dialogFailed = e;
    },
    closeDialogConfirm(e) {
      this.dialogConfirm = e;
    },
    successPutOrder(e) {
      this.$store.dispatch("getTransfer");
      this.messageDialog = e;
      this.dialogSuccess = true;
    },
    failedAddOrder(e) {
      this.messageDialog = e;
      this.dialogFailed = true;
    },
    successDelete() {
      this.$store.dispatch("getTransfer");
    },
  },
}
</script>
