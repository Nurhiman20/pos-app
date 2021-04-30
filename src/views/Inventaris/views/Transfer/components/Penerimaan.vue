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
        <v-btn class="ml-2 align-center" color="primary" small @click="showDialogAdd">Tambah Penerimaan</v-btn>
      </div>
      <v-data-table
        :headers="headers"
        :items="$store.getters.listRvTransfer"
        :search="search"
        class="elevation-1 scrollbar-custom mt-3"
        hide-default-footer
      >
        <template v-slot:item.ingredients="{item}">
          <p class="my-auto">{{ item.ingredients.length }}</p>
        </template>
        <template v-slot:item.receive_status="{item}">
          <div class="d-flex flex-row">
            <v-icon color="success" v-if="item.receive_status === 'Terpenuhi'">mdi-check-decagram</v-icon>
            <v-icon color="error" v-else>mdi-alert-decagram</v-icon>
            <p class="my-auto ml-1">{{ item.receive_status }}</p>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <add-receive-tf-dialog
      :show="dialogAdd"      
      @closeDialog="closeDialogAdd"
      @success="successPutOrder"
      @error="failedPutOrder"
    ></add-receive-tf-dialog>

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
import addReceiveTfDialog from './Dialog/TambahPenerimaan';
import responseDialog from '@/components/ResponseDialog';

export default {
  components: {
    addReceiveTfDialog,
    responseDialog
  },
  data() {
    return {
      search: null,
      select: null,
      itemOrder: [],
      listOrder: [],
      headers: [
        { text: 'ID Pesanan', value: 'id', sortable: false },
        { text: 'Waktu', value: 'time', sortable: true },
        { text: 'Cabang Pengirim', value: 'outlet.name', sortable: true },
        { text: 'Bahan', value: 'ingredients', sortable: false },
        { text: 'Status', value: 'receive_status', sortable: false }
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
    closeDialogSuccess(e) {
      this.dialogAdd = false;
      // this.dialogEdit = false;
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
    failedPutOrder(e) {
      this.messageDialog = e;
      this.dialogFailed = true;
    },
    deleteOrder(e) {
      this.selectedDelete = e;
      this.messageDialog = "Kamu yakin akan menghapus penerimaan ini?"
      this.dialogConfirm = true;
    },
    doDelete() {
      this.$store.dispatch("deleteTransfer", this.selectedDelete)
        .then(() => {          
          this.$store.dispatch("getTransfer");
          this.dialogConfirm = false;
          this.messageDialog = "Berhasil menghapus penerimaan";
          this.dialogSuccess = true;
        })
        .catch(() => {
          this.dialogConfirm = false;
          this.messageDialog = "Terjadi kesalahan. Silahkan coba lagi nanti";
          this.dialogFailed = true;
        })
    }
  },
}
</script>
