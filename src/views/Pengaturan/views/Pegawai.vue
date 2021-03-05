<template>
  <div>
    <div class="d-flex flex-row justify-space-between align-center">
      <h1>Pegawai</h1>
      <div class="d-flex flex-row flex-wrap justify-end">
        <download-excel
          :data="$store.state.listEmployee"
          :fields="jsonFields"
          worksheet="Pegawai"
          name="Pegawai.xls"
          class="mb-1"
        >
          <v-btn color="secondary" small>Export</v-btn>
        </download-excel>
        <v-btn class="ml-2" color="primary" small @click="dialogAddEmployee = true">Tambah Pegawai</v-btn>
      </div>
    </div>

    <v-card outlined flat class="pa-4 mt-3">
      <v-row>
        <v-col cols="12" md="4" lg="4">
          <v-autocomplete
            v-model="select"
            :items="itemEmployee"
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
        :items="$store.state.listEmployee"
        :search="search"
        class="elevation-1 scrollbar-custom"
        hide-default-footer
        @click:row="goToEdit"
      >
      </v-data-table>
    </v-card>

    <!-- dialog add employee -->
    <add-employee-dialog 
      :show="dialogAddEmployee"
      @closeDialog="closeDialogEmployee"
      @success="successPutEmployee"
      @error="failedPutEmployee"
    ></add-employee-dialog>

    <!-- dialog edit employee -->
    <edit-employee-dialog 
      :show="dialogEditEmployee"
      :selected.sync="selectedEmployee"
      @closeDialog="closeDialogEdit"
      @success="successPutEmployee"
      @error="failedPutEmployee"
      @delete="deleteEmployee"
      @successDelete="successDelete"
    ></edit-employee-dialog>
    
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
import addEmployeeDialog from '../components/TambahPegawai';
import editEmployeeDialog from '../components/EditPegawai';
import responseDialog from '../../../components/ResponseDialog';

export default {
  components: {
    addEmployeeDialog,
    editEmployeeDialog,
    responseDialog
  },
  data() {
    return {
      itemEmployee: [],
      selectedEmployee: {},
      selectedDelete: {},
      select: null,
      search: null,
      headers: [
        { text: 'ID', value: 'id', sortable: false },
        { text: 'Username', value: 'username', sortable: true },
        { text: 'Nama', value: 'name', sortable: true },
        { text: 'Jabatan', value: 'role', sortable: true },
        { text: 'Nomor HP', value: 'phone_number', sortable: false },
        { text: 'Cabang', value: 'outlet.name', sortable: true }
      ],      
      jsonFields: {
        ID: 'id',
        Username: 'username',
        Nama: 'name',
        Jabatan: 'role',
        'Nomor HP': 'phone_number',
        Cabang: 'outlet'
      },
      dialogAddEmployee: false,
      dialogEditEmployee: false,
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
      let listEmployee = this.$store.state.listEmployee.map(item => item.table_number);
      this.itemEmployee = listEmployee.filter(e => {
        return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1;
      });
    },
    closeDialogSuccess(e) {
      this.dialogAddEmployee = false;
      this.dialogEditEmployee = false;
      this.dialogSuccess = e;
    },
    closeDialogFailed(e) {
      this.dialogFailed = e;
    },
    closeDialogConfirm(e) {
      this.dialogConfirm = e;
    },
    closeDialogEdit(e) {
      this.dialogEditEmployee = e;
      this.$store.dispatch("getEmployee");
    },
    closeDialogEmployee(e) {
      this.dialogAddEmployee = e;
      this.$store.dispatch("getEmployee");
    },
    successDelete() {
      this.$store.dispatch("getEmployee");
    },
    successPutEmployee(e) {
      this.$store.dispatch("getEmployee");
      this.messageDialog = e;
      this.dialogSuccess = true;
    },
    failedPutEmployee(e) {
      this.messageDialog = e;
      this.dialogFailed = true;
    },
    deleteEmployee(e) {
      this.selectedDelete = e;
      this.messageDialog = "Kamu yakin akan menghapus pegawai ini?"
      this.dialogConfirm = true;
    },
    doDelete() {
      this.$store.dispatch("deleteEmployee", this.selectedDelete)
        .then(() => {          
          this.$store.dispatch("getEmployee");
          this.dialogConfirm = false;
          this.messageDialog = "Berhasil menghapus pegawai";
          this.dialogSuccess = true;
        })
        .catch(() => {
          this.dialogConfirm = false;
          this.messageDialog = "Terjadi kesalahan. Silahkan coba lagi nanti";
          this.dialogFailed = true;
        })
    },
    goToEdit(item) {
      this.selectedEmployee = item;
      this.dialogEditEmployee = true;
    }
  },
  created() {
    this.$store.dispatch("getEmployee");
    this.$store.dispatch("getOutlet");
  },
}
</script>
