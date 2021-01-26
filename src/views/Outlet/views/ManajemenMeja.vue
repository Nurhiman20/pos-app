<template>
  <div>
    <div class="d-flex flex-row justify-space-between align-center">
      <h1>Manajemen Meja</h1>
      <v-btn color="primary" small @click="dialogAddTable = true">Tambah Meja</v-btn>
    </div>

    <v-card outlined flat class="pa-4 mt-3">
      <v-row>
        <v-col cols="12" md="4" lg="4">
          <v-autocomplete
            v-model="select"
            :items="itemTable"
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
        :items="$store.state.listTable"
        :search="search"
        class="elevation-1 scrollbar-custom"
        hide-default-footer
        @click:row="goToEdit"
      >
      </v-data-table>
    </v-card>

    <!-- dialog add table -->
    <add-table-dialog 
      :show="dialogAddTable"
      @closeDialog="closeDialogTable"
      @success="successPutTable"
      @error="failedPutTable"
    ></add-table-dialog>

    <!-- dialog edit table -->
    <edit-table-dialog 
      :show="dialogEditTable"
      :selected.sync="selectedTable"
      @closeDialog="closeDialogEdit"
      @success="successPutTable"
      @error="failedPutTable"
      @delete="deleteTable"
      @successDelete="successDelete"
    ></edit-table-dialog>
    
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
import addTableDialog from '../components/TambahMeja';
import editTableDialog from '../components/EditMeja';
import responseDialog from '../../../components/ResponseDialog';

export default {
  components: {
    addTableDialog,
    editTableDialog,
    responseDialog
  },
  data() {
    return {
      itemTable: [],
      selectedTable: {},
      selectedDelete: {},
      select: null,
      search: null,
      headers: [
        { text: 'ID', value: 'id', sortable: false },
        { text: 'Nomor Meja', value: 'table_number', sortable: true },
        { text: 'Kapasitas', value: 'capacity', sortable: true }
      ],
      dialogAddTable: false,
      dialogEditTable: false,
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
      let listTable = this.$store.state.listTable.map(item => item.table_number);
      this.itemTable = listTable.filter(e => {
        return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1;
      });
    },
    closeDialogSuccess(e) {
      this.dialogAddTable = false;
      this.dialogEditTable = false;
      this.dialogSuccess = e;
    },
    closeDialogFailed(e) {
      this.dialogFailed = e;
    },
    closeDialogConfirm(e) {
      this.dialogConfirm = e;
    },
    closeDialogEdit(e) {
      this.dialogEditTable = e;
      this.$store.dispatch("getTable");
    },
    closeDialogTable(e) {
      this.dialogAddTable = e;
      this.$store.dispatch("getTable");
    },
    successDelete() {
      this.$store.dispatch("getTable");
    },
    successPutTable(e) {
      this.$store.dispatch("getTable");
      this.messageDialog = e;
      this.dialogSuccess = true;
    },
    failedPutTable(e) {
      this.messageDialog = e;
      this.dialogFailed = true;
    },
    deleteTable(e) {
      this.selectedDelete = e;
      this.messageDialog = "Kamu yakin akan menghapus meja ini?"
      this.dialogConfirm = true;
    },
    doDelete() {
      this.$store.dispatch("deleteTable", this.selectedDelete)
        .then(() => {          
          this.$store.dispatch("getTable");
          this.dialogConfirm = false;
          this.messageDialog = "Berhasil menghapus meja";
          this.dialogSuccess = true;
        })
        .catch(() => {
          this.dialogConfirm = false;
          this.messageDialog = "Terjadi kesalahan. Silahkan coba lagi nanti";
          this.dialogFailed = true;
        })
    },
    goToEdit(item) {
      this.selectedTable = item;
      this.dialogEditTable = true;
    }
  },
  created() {
    this.$store.dispatch("getTable");
  },
}
</script>
