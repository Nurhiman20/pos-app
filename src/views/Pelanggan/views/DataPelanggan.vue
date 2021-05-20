<template>
  <div>
    <div class="d-flex flex-row justify-space-between align-center">
      <h1>Data Pelanggan</h1>
      <div class="d-flex flex-row flex-wrap justify-end">
        <download-excel
          :data="$store.state.listCustomer"
          :fields="jsonFields"
          worksheet="Customer"
          name="Pelanggan.xls"
          class="mb-1"
        >
          <v-btn color="secondary" small>Export</v-btn>
        </download-excel>
        <v-btn class="ml-2" color="primary" small @click="dialogAddCustomer = true">Tambah Pelanggan</v-btn>
      </div>
    </div>

    <v-card outlined flat class="pa-4 mt-3">
      <v-row>
        <v-col cols="12" md="4" lg="4">
          <v-autocomplete
            v-model="select"
            :items="itemCustomers"
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
        :items="$store.state.listCustomer"
        :search="search"
        class="elevation-1 scrollbar-custom"
        hide-default-footer
        @click:row="goToDetail"
      >
      </v-data-table>
    </v-card>

    <!-- dialog add customer -->
    <add-customer-dialog 
      :show="dialogAddCustomer"
      @closeDialog="closeDialogCustomer"
      @success="successPutCustomer"
      @error="failedPutCustomer"
    ></add-customer-dialog>

    <!-- dialog edit customer -->
    <edit-customer-dialog 
      :show="dialogEditCustomer"
      :selected.sync="selectedCustomer"
      @closeDialog="closeDialogEdit"
      @success="successPutCustomer"
      @error="failedPutCustomer"
      @delete="deleteCustomer"
      @successDelete="successDelete"
    ></edit-customer-dialog>

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
import addCustomerDialog from '../components/TambahPelanggan';
import editCustomerDialog from '../components/EditPelanggan';
import responseDialog from '../../../components/ResponseDialog';

export default {
  components: {
    addCustomerDialog,
    editCustomerDialog,
    responseDialog
  },
  data() {
    return {
      itemCustomers: [],
      selectedCustomer: {},
      selectedDelete: {},
      select: null,
      search: null,
      headers: [
        { text: 'ID', value: 'id', sortable: false },
        { text: 'Nama', value: 'name', sortable: false },
        { text: 'Nomor HP', value: 'phone_number', sortable: false },
        { text: 'Email', value: 'email', sortable: false }
      ],
      jsonFields: {
        ID: 'id',
        'Nama Pelanggan': 'name',
        'Nomor HP': 'phone_number',
        Email: 'email'
      },
      dialogAddCustomer: false,
      dialogEditCustomer: false,
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
      let listCustomer = this.$store.state.listCustomer.map(item => item.name);
      this.itemCustomers = listCustomer.filter(e => {
        return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1;
      });
    },
    closeDialogSuccess(e) {
      this.dialogAddCustomer = false;
      this.dialogEditCustomer = false;
      this.dialogSuccess = e;
    },
    closeDialogFailed(e) {
      this.dialogFailed = e;
    },
    closeDialogConfirm(e) {
      this.dialogConfirm = e;
    },
    closeDialogCustomer(e) {
      this.dialogAddCustomer = e;
      this.$store.dispatch("getCustomer");
    },
    closeDialogEdit(e) {
      this.dialogEditCustomer = e;
      this.$store.dispatch("getCustomer");
    },
    successDelete() {
      this.$store.dispatch("getCustomer");
    },
    successPutCustomer(e) {
      this.$store.dispatch("getCustomer");
      this.messageDialog = e;
      this.dialogSuccess = true;
    },
    failedPutCustomer(e) {
      this.messageDialog = e;
      this.dialogFailed = true;
    },
    deleteCustomer(e) {
      this.selectedDelete = e;
      this.messageDialog = "Kamu yakin akan menghapus pelanggan ini?"
      this.dialogConfirm = true;
    },
    doDelete() {
      this.$store.dispatch("deleteCustomer", this.selectedDelete)
        .then(() => {          
          this.$store.dispatch("getCustomer");
          this.dialogConfirm = false;
          this.messageDialog = "Berhasil menghapus pelanggan";
          this.dialogSuccess = true;
        })
        .catch(() => {
          this.dialogConfirm = false;
          this.messageDialog = "Terjadi kesalahan. Silahkan coba lagi nanti";
          this.dialogFailed = true;
        })
    },
    goToDetail(e) {
      this.$router.push('list/detail/' + e.id);
    }
  },
  created() {
    this.$store.dispatch("getCustomer");
  },
}
</script>
