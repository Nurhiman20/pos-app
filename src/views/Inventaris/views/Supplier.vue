<template>
  <div>
    <div class="d-flex flex-row justify-space-between align-center">
      <h1>Daftar Supplier</h1>
      <div class="d-flex flex-row flex-wrap justify-end">
        <download-excel
          :data="$store.state.listSupplier"
          :fields="jsonFields"
          worksheet="Category"
          name="Supplier.xls"
          class="mb-1"
        >
          <v-btn color="success" small>Export</v-btn>
        </download-excel>
        <v-btn class="ml-2" color="primary" small @click="dialogAddSupplier = true">Tambah Supplier</v-btn>
      </div>
    </div>
    <v-card outlined flat class="pa-4 mt-3">
      <v-row>
        <v-col cols="12" md="4" lg="4">
          <v-autocomplete
            v-model="select"
            :items="itemSupplier"
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
        :items="$store.state.listSupplier"
        :search="search"
        class="elevation-1 scrollbar-custom"
        hide-default-footer
        @click:row="goToEdit"
      ></v-data-table>
    </v-card>
    
    <!-- dialog add category -->
    <add-category-dialog
      :show="dialogAddSupplier"
      @closeDialog="closeDialogAdd"
      @success="successPutCategory"
      @error="failedAddCategory"
    ></add-category-dialog>

    <!-- dialog edit category -->
    <edit-category-dialog 
      :show="dialogEditSupplier"
      :selected="selectedSupplier"
      @closeDialog="closeDialogEdit"
      @success="successPutCategory"
      @error="failedAddCategory"
      @delete="deleteCategory"
      @successDelete="successDelete"
    ></edit-category-dialog>

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
import addSupplierDialog from '../components/TambahSupplier';
import editSupplierDialog from '../components/EditSupplier';
import responseDialog from '../../../components/ResponseDialog';

export default {
  components: {
    addSupplierDialog,
    editSupplierDialog,
    responseDialog
  },
  data() {
    return {
      search: null,
      select: null,
      itemSupplier: [],
      selectedSupplier: {
        id: null,
        name: null
      },
      selectedDelete: {},
      headers: [
        { text: 'Nama', value: 'name', sortable: true },
        { text: 'Alamat', value: 'address', sortable: false },
        { text: 'No. HP', value: 'phone_number', sortable: false },
        { text: 'Email', value: 'email', sortable: false }
      ],
      jsonFields: {
        ID: 'id',
        Nama: 'name',
        Alamat: 'address',
        'No. HP': 'phone_number',
        Email: 'email'
      },
      dialogAddSupplier: false,
      dialogEditSupplier: false,
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
      let listSupplier = this.$store.state.listSupplier.map(item => item.name);
      this.itemSupplier = listSupplier.filter(e => {
        return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1;
      });
    },
    closeDialogSuccess(e) {
      this.dialogAddSupplier = false;
      this.dialogEditSupplier = false;
      this.dialogSuccess = e;
    },
    closeDialogFailed(e) {
      this.dialogFailed = e;
    },
    closeDialogConfirm(e) {
      this.dialogConfirm = e;
    },
    successDelete() {
      this.$store.dispatch("getSupplier");
    },
    closeDialogAdd(e) {
      this.$store.dispatch("getSupplier")
      this.dialogAddSupplier = e
    },
    closeDialogEdit(e) {
      this.$store.dispatch("getSupplier")
      this.dialogEditSupplier = e
    },
    successPutCategory(e) {
      this.$store.dispatch("getSupplier");
      this.messageDialog = e;
      this.dialogSuccess = true;
    },
    failedAddCategory(e) {
      this.messageDialog = e;
      this.dialogFailed = true;
    },
    deleteCategory(e) {
      this.selectedDelete = e;
      this.messageDialog = "Kamu yakin akan menghapus supplier ini?"
      this.dialogConfirm = true;
    },
    doDelete() {
      this.$store.dispatch("deleteCategory", this.selectedDelete)
        .then(() => {          
          this.$store.dispatch("getSupplier");
          this.dialogConfirm = false;
          this.messageDialog = "Berhasil menghapus supplier";
          this.dialogSuccess = true;
        })
        .catch(() => {
          this.dialogConfirm = false;
          this.messageDialog = "Terjadi kesalahan. Silahkan coba lagi nanti";
          this.dialogFailed = true;
        })
    },
    randomId() {
      var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      var uniqid = 'cat-' + randLetter + Date.now();
      return uniqid
    },
    goDelete(item) {
      this.deleteCategory(item)
        .then(result => {
          console.log(result);
          this.$store.dispatch("getSupplier")
        })
    },
    goToEdit(item) {
      this.selectedSupplier = item;
      this.dialogEditSupplier = true;
    }
  },
  created() {
    this.$store.dispatch("getSupplier");
  },
}
</script>
