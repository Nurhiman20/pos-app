<template>
  <div>
    <div class="d-flex flex-row justify-space-between align-center">
      <h1>Daftar Kategori</h1>
      <v-btn color="primary" small @click="dialogAddCategory = true">Tambah Kategori</v-btn>
    </div>
    <v-card outlined flat class="pa-4 mt-3">
      <v-row>
        <v-col cols="12" md="4" lg="4">
          <v-autocomplete
            v-model="select"
            :items="itemCategories"
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
        :items="$store.state.listCategory"
        :search="search"
        class="elevation-1 scrollbar-custom"
        hide-default-footer
        @click:row="goToEdit"
      ></v-data-table>
    </v-card>
    
    <!-- dialog add category -->
    <add-category-dialog
      :show="dialogAddCategory"
      @closeDialog="closeDialogAdd"
      @success="successPutCategory"
      @error="failedAddCategory"
    ></add-category-dialog>

    <!-- dialog edit category -->
    <edit-category-dialog 
      :show="dialogEditCategory"
      :selected="selectedCategory"
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
import addCategoryDialog from '../components/TambahKategori';
import editCategoryDialog from '../components/EditKategori';
import responseDialog from '../../../components/ResponseDialog';

export default {
  components: {
    addCategoryDialog,
    editCategoryDialog,
    responseDialog
  },
  data() {
    return {
      search: null,
      select: null,
      itemCategories: [],
      selectedCategory: {
        id: null,
        name: null
      },
      selectedDelete: {},
      headers: [
        { text: 'ID', value: 'id', sortable: false },
        { text: 'Nama', value: 'name', sortable: true },
        { text: '', value: 'actions', sortable: false }
      ],
      dialogAddCategory: false,
      dialogEditCategory: false,
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
      let listCategory = this.$store.state.listCategory.map(item => item.name);
      this.itemCategories = listCategory.filter(e => {
        return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1;
      });
    },
    closeDialogSuccess(e) {
      this.dialogAddCategory = false;
      this.dialogEditCategory = false;
      this.dialogSuccess = e;
    },
    closeDialogFailed(e) {
      this.dialogFailed = e;
    },
    closeDialogConfirm(e) {
      this.dialogConfirm = e;
    },
    successDelete() {
      this.$store.dispatch("getCategory");
    },
    closeDialogAdd(e) {
      this.$store.dispatch("getCategory")
      this.dialogAddCategory = e
    },
    closeDialogEdit(e) {
      this.$store.dispatch("getCategory")
      this.dialogEditCategory = e
    },
    successPutCategory(e) {
      this.$store.dispatch("getCategory");
      this.messageDialog = e;
      this.dialogSuccess = true;
    },
    failedAddCategory(e) {
      this.messageDialog = e;
      this.dialogFailed = true;
    },
    deleteCategory(e) {
      this.selectedDelete = e;
      this.messageDialog = "Kamu yakin akan menghapus kategori ini?"
      this.dialogConfirm = true;
    },
    doDelete() {
      this.$store.dispatch("deleteCategory", this.selectedDelete)
        .then(() => {          
          this.$store.dispatch("getCategory");
          this.dialogConfirm = false;
          this.messageDialog = "Berhasil menghapus kategori";
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
          this.$store.dispatch("getCategory")
        })
    },
    goToEdit(item) {
      this.selectedCategory = item;
      this.dialogEditCategory = true;
    }
  },
  created() {
    this.$store.dispatch("getCategory");
  },
}
</script>
