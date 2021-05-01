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
        <v-btn class="ml-2 align-center" color="primary" small @click="showDialogAdd">Tambah Pengiriman</v-btn>
      </div>
      <v-data-table
        :headers="headers"
        :items="$store.getters.listDeliveryTransfer"
        :search="search"
        class="elevation-1 scrollbar-custom mt-3"
        hide-default-footer
        @click:row="goToDetail"
      >
        <template v-slot:item.ingredients="{item}">
          <p class="my-auto">{{ item.ingredients.length }}</p>
        </template>
        <template v-slot:item.delivery_status="{item}">
          <div class="d-flex flex-row">
            <v-icon color="success" v-if="item.delivery_status === 'Terpenuhi'">mdi-check-decagram</v-icon>
            <v-icon color="error" v-else>mdi-alert-decagram</v-icon>
            <p class="my-auto ml-1">{{ item.delivery_status }}</p>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <add-delivery-dialog
      :show="dialogAdd"      
      @closeDialog="closeDialogAdd"
      @success="successPutDeliv"
      @error="failedPutDeliv"
    ></add-delivery-dialog>

    <detail-delivery-dialog
      :show="dialogDetail"
      :selected="selectedDelivery"
      :type="'edit'"
      @close="closeDialogDetail"
      @success="successPutDeliv"
      @error="failedPutDeliv"
      @delete="deleteDelivery"
    ></detail-delivery-dialog>

    <response-dialog 
      :success="dialogSuccess"
      :failed="dialogFailed"
      :confirm="dialogConfirm"
      :message="messageDialog"
      @closeSuccess="closeDialogSuccess"
      @closeFailed="closeDialogFailed"
      @closeConfirm="closeDialogConfirm"
      @deleteConfirmed="doDelete"
    ></response-dialog>
  </div>
</template>

<script>
import addDeliveryDialog from './Dialog/TambahPengiriman';
import detailDeliveryDialog from './Dialog/DetailPengiriman';
import responseDialog from '@/components/ResponseDialog';

export default {
  components: {
    addDeliveryDialog,
    detailDeliveryDialog,
    responseDialog
  },
  data() {
    return {
      search: null,
      select: null,
      itemOrder: [],
      listOrder: [],
      selectedDelivery: {},
      selectedDelete: {},
      headers: [
        { text: 'ID Pesanan', value: 'id', sortable: false },
        { text: 'Waktu', value: 'time', sortable: true },
        { text: 'Cabang Tujuan', value: 'outlet.name', sortable: true },
        { text: 'Bahan', value: 'ingredients', sortable: false },
        { text: 'Status', value: 'delivery_status', sortable: false }
      ],
      dialogAdd: false,
      dialogDetail: false,
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
      // let listOrder = this.$store.state.listOrder.map(item => item.supplier.name);
      let listOrder = this.listOrder;
      this.itemOrder = listOrder.filter(e => {
        return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1;
      });
    },
    showDialogAdd() {
      this.dialogAdd = true;
    },
    closeDialogAdd(e) {
      this.dialogAdd = e;
    },
    closeDialogDetail(e) {
      this.dialogDetail = e;
    },
    closeDialogSuccess(e) {
      this.dialogAdd = false;
      this.dialogDetail = false;
      this.dialogSuccess = e;
    },
    closeDialogFailed(e) {
      this.dialogFailed = e;
    },
    closeDialogConfirm(e) {
      this.dialogConfirm = e;
    },
    successPutDeliv(e) {
      this.$store.dispatch("getTransfer");
      this.messageDialog = e;
      this.dialogSuccess = true;
    },
    failedPutDeliv(e) {
      this.messageDialog = e;
      this.dialogFailed = true;
    },
    deleteDelivery(e) {
      this.selectedDelete = e;
      this.messageDialog = "Kamu yakin akan menghapus pengiriman ini?"
      this.dialogConfirm = true;
    },
    doDelete() {
      this.$store.dispatch("deleteDeliveryTransfer", this.selectedDelete)
        .then(() => {          
          this.$store.dispatch("getTransfer");
          this.dialogConfirm = false;
          this.messageDialog = "Berhasil menghapus pengiriman";
          this.dialogSuccess = true;
        })
        .catch(() => {
          this.dialogConfirm = false;
          this.messageDialog = "Terjadi kesalahan. Silahkan coba lagi nanti";
          this.dialogFailed = true;
        })
    },
    goToDetail(e) {
      this.selectedDelivery = e;
      this.dialogDetail = true;
    }
  }
}
</script>
