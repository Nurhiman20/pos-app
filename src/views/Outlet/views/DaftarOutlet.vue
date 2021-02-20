<template>
  <div>
    <div class="d-flex flex-row justify-space-between align-center">
      <h1>Daftar Outlet</h1>
      <div class="d-flex flex-row flex-wrap justify-end">
        <download-excel
          :data="$store.state.listOutlet"
          :fields="jsonFields"
          worksheet="Outlet"
          name="Outlet.xls"
          class="mb-1"
        >
          <v-btn color="secondary" small>Export</v-btn>
        </download-excel>
        <v-btn class="ml-2" color="primary" small @click="dialogAddOutlet = true">Tambah Outlet</v-btn>
      </div>
    </div>

    <v-card outlined flat class="pa-4 mt-3">
      <v-row>
        <v-col cols="12" md="4" lg="4">
          <v-autocomplete
            v-model="select"
            :items="itemOutlet"
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
        :items="$store.state.listOutlet"
        :search="search"
        class="elevation-1 scrollbar-custom"
        hide-default-footer
        @click:row="goToEdit"
      >
      </v-data-table>
    </v-card>

    <!-- dialog add outlet -->
    <add-outlet-dialog 
      :show="dialogAddOutlet"
      @closeDialog="closeDialogOutlet"
      @success="successPutOutlet"
      @error="failedPutOutlet"
    ></add-outlet-dialog>

    <!-- dialog edit outlet -->
    <edit-outlet-dialog 
      :show="dialogEditOutlet"
      :selected.sync="selectedOutlet"
      @closeDialog="closeDialogEdit"
      @success="successPutOutlet"
      @error="failedPutOutlet"
      @delete="deleteOutlet"
      @successDelete="successDelete"
    ></edit-outlet-dialog>
    
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
import addOutletDialog from '../components/TambahOutlet';
import editOutletDialog from '../components/EditOutlet';
import responseDialog from '../../../components/ResponseDialog';

export default {
  components: {
    addOutletDialog,
    editOutletDialog,
    responseDialog
  },
  data() {
    return {
      itemOutlet: [],
      selectedOutlet: {},
      selectedDelete: {},
      select: null,
      search: null,
      headers: [
        { text: 'ID', value: 'id', sortable: false },
        { text: 'Nama', value: 'name', sortable: true },
        { text: 'Nomor Telepon', value: 'phone', sortable: false },
        { text: 'Alamat', value: 'address', sortable: false }
      ],      
      jsonFields: {
        ID: 'id',
        Nama: 'name',
        Telepon: 'phone',
        Alamat: 'address'
      },
      dialogAddOutlet: false,
      dialogEditOutlet: false,
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
      let listOutlet = this.$store.state.listOutlet.map(item => item.table_number);
      this.itemOutlet = listOutlet.filter(e => {
        return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1;
      });
    },
    closeDialogSuccess(e) {
      this.dialogAddOutlet = false;
      this.dialogEditOutlet = false;
      this.dialogSuccess = e;
    },
    closeDialogFailed(e) {
      this.dialogFailed = e;
    },
    closeDialogConfirm(e) {
      this.dialogConfirm = e;
    },
    closeDialogEdit(e) {
      this.dialogEditOutlet = e;
      this.$store.dispatch("getOutlet");
    },
    closeDialogOutlet(e) {
      this.dialogAddOutlet = e;
      this.$store.dispatch("getOutlet");
    },
    successDelete() {
      this.$store.dispatch("getOutlet");
    },
    successPutOutlet(e) {
      this.$store.dispatch("getOutlet");
      this.messageDialog = e;
      this.dialogSuccess = true;
    },
    failedPutOutlet(e) {
      this.messageDialog = e;
      this.dialogFailed = true;
    },
    deleteOutlet(e) {
      this.selectedDelete = e;
      this.messageDialog = "Kamu yakin akan menghapus outlet ini?"
      this.dialogConfirm = true;
    },
    doDelete() {
      this.$store.dispatch("deleteOutlet", this.selectedDelete)
        .then(() => {          
          this.$store.dispatch("getOutlet");
          this.dialogConfirm = false;
          this.messageDialog = "Berhasil menghapus outlet";
          this.dialogSuccess = true;
        })
        .catch(() => {
          this.dialogConfirm = false;
          this.messageDialog = "Terjadi kesalahan. Silahkan coba lagi nanti";
          this.dialogFailed = true;
        })
    },
    goToEdit(item) {
      this.selectedOutlet = item;
      this.dialogEditOutlet = true;
    }
  },
  created() {
    this.$store.dispatch("getOutlet");
  },
}
</script>
