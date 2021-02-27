<template>
  <div>
    <div class="d-flex flex-row justify-space-between align-center">
      <h1>Pegawai</h1>
      <div class="d-flex flex-row flex-wrap justify-end">
        <download-excel
          :data="$store.state.listCashier"
          :fields="jsonFields"
          worksheet="Kasir"
          name="Kasir.xls"
          class="mb-1"
        >
          <v-btn color="secondary" small>Export</v-btn>
        </download-excel>
        <v-btn class="ml-2" color="primary" small @click="dialogAddCashier = true">Tambah Pegawai</v-btn>
      </div>
    </div>

    <v-card outlined flat class="pa-4 mt-3">
      <v-row>
        <v-col cols="12" md="4" lg="4">
          <v-autocomplete
            v-model="select"
            :items="itemCashier"
            :search-input.sync="search"
            cache-items
            class="my-4"
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
      <v-data-table
        :headers="headers"
        :items="$store.state.listCashier"
        :search="search"
        class="elevation-1 scrollbar-custom"
        hide-default-footer
        @click:row="goToEdit"
      >
      </v-data-table>
    </v-card>

    <!-- dialog add cashier -->
    <add-cashier-dialog 
      :show="dialogAddCashier"
      @closeDialog="closeDialogCashier"
      @success="successPutCashier"
      @error="failedPutCashier"
    ></add-cashier-dialog>

    <!-- dialog edit cashier -->
    <edit-cashier-dialog 
      :show="dialogEditCashier"
      :selected.sync="selectedCashier"
      @closeDialog="closeDialogEdit"
      @success="successPutCashier"
      @error="failedPutCashier"
      @delete="deleteCashier"
      @successDelete="successDelete"
    ></edit-cashier-dialog>
    
    <!-- response dialog -->
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
import addCashierDialog from '../components/TambahKasir';
import editCashierDialog from '../components/EditKasir';
import responseDialog from '../../../components/ResponseDialog';

export default {
  components: {
    addCashierDialog,
    editCashierDialog,
    responseDialog
  },
  data() {
    return {
      itemCashier: [],
      selectedCashier: {},
      selectedDelete: {},
      select: null,
      search: null,
      headers: [
        { text: 'ID', value: 'id', sortable: false },
        { text: 'Username', value: 'username', sortable: true },
        { text: 'Nama', value: 'name', sortable: true },
        { text: 'Jabatan', value: 'role', sortable: true },
        { text: 'Nomor HP', value: 'phone_number', sortable: false },
        { text: 'Cabang', value: 'outlet', sortable: true }
      ],      
      jsonFields: {
        ID: 'id',
        Username: 'username',
        Nama: 'name',
        'Nomor HP': 'phone_number'
      },
      dialogAddCashier: false,
      dialogEditCashier: false,
      dialogSuccess: false,
      dialogFailed: false,
      dialogConfirm: false,
      messageDialog: null
    }
  },
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val);
    }
  },
  methods: {
    querySelections(v) {
      let listCashier = this.$store.state.listCashier.map(item => item.table_number);
      this.itemCashier = listCashier.filter(e => {
        return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1;
      });
    },
    closeDialogSuccess(e) {
      this.dialogAddCashier = false;
      this.dialogEditCashier = false;
      this.dialogSuccess = e;
    },
    closeDialogFailed(e) {
      this.dialogFailed = e;
    },
    closeDialogConfirm(e) {
      this.dialogConfirm = e;
    },
    closeDialogEdit(e) {
      this.dialogEditCashier = e;
      this.$store.dispatch("getCashier");
    },
    closeDialogCashier(e) {
      this.dialogAddCashier = e;
      this.$store.dispatch("getCashier");
    },
    successDelete() {
      this.$store.dispatch("getCashier");
    },
    successPutCashier(e) {
      this.$store.dispatch("getCashier");
      this.messageDialog = e;
      this.dialogSuccess = true;
    },
    failedPutCashier(e) {
      this.messageDialog = e;
      this.dialogFailed = true;
    },
    deleteCashier(e) {
      this.selectedDelete = e;
      this.messageDialog = "Kamu yakin akan menghapus kasir ini?"
      this.dialogConfirm = true;
    },
    doDelete() {
      this.$store.dispatch("deleteCashier", this.selectedDelete)
        .then(() => {          
          this.$store.dispatch("getCashier");
          this.dialogConfirm = false;
          this.messageDialog = "Berhasil menghapus kasir";
          this.dialogSuccess = true;
        })
        .catch(() => {
          this.dialogConfirm = false;
          this.messageDialog = "Terjadi kesalahan. Silahkan coba lagi nanti";
          this.dialogFailed = true;
        })
    },
    goToEdit(item) {
      this.selectedCashier = item;
      this.dialogEditCashier = true;
    }
  },
  created() {
    this.$store.dispatch("getCashier");
  },
}
</script>
