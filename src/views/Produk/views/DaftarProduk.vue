<template>
  <div>
    <div class="d-flex flex-row justify-space-between align-center">
      <h1>Daftar Produk</h1>
      <div class="d-flex flex-row flex-wrap justify-end">
        <download-excel
          :data="$store.state.listProduct"
          :fields="jsonFields"
          worksheet="Product"
          name="Produk.xls"
          class="mb-1"
        >
          <v-btn color="success" small>Export</v-btn>
        </download-excel>
        <v-btn class="ml-2" color="primary" small @click="dialogAddProduct = true">Tambah Produk</v-btn>
      </div>
    </div>
    <v-card outlined flat class="pa-4 mt-3">
      <v-row>
        <v-col cols="12" md="4" lg="4">
          <v-autocomplete
            v-model="select"
            :items="itemProducts"
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
        :items="$store.state.listProduct"
        :search="search"
        class="elevation-1 scrollbar-custom"
        hide-default-footer
        @click:row="goToEdit"
      >
        <template v-slot:item.name="{item}">
          <div class="d-flex flex-row align-center py-2">
            <v-img :src="showImage(item.image)" max-width="60" :aspect-ratio="4/3"></v-img>
            <p class="ml-3 my-auto">{{ item.name }}</p>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- dialog add product -->
    <add-product-dialog
      :show="dialogAddProduct"
      @closeDialog="closeDialogAdd"
      @success="successAddProduct"
      @error="failedAddProduct"
    ></add-product-dialog>

    <!-- dialog add product -->
    <edit-product-dialog 
      :show="dialogEditProduct"
      :selected="selectedProduct"
      @closeDialog="closeDialogEdit"
      @success="successAddProduct"
      @error="failedAddProduct"
      @delete="deleteProduct"
      @successDelete="successDelete"
    ></edit-product-dialog>
    
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
import addProductDialog from '../components/TambahProduk';
import editProductDialog from '../components/EditProduk';
import responseDialog from '../../../components/ResponseDialog';

export default {
  components: {
    addProductDialog,
    editProductDialog,
    responseDialog
  },
  data() {
    return {
      selectedProduct: {},
      selectedDelete: {},
      search: null,
      select: null,
      itemProducts: [],
      headers: [
        { text: 'ID', value: 'id', sortable: false },
        { text: 'Produk', value: 'name', sortable: true },
        { text: 'Harga', value: 'price', sortable: false },
        { text: 'Kategori', value: 'category.name', sortable: false },
        { text: 'Deskripsi', value: 'description', sortable: false }
      ],
      jsonFields: {
        ID: 'id',
        Produk: 'name',
        Harga: 'price',
        Kategori: 'category.name',
        Deskripsi: 'description'
      },
      dialogAddProduct: false,
      dialogEditProduct: false,
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
      let listProduct = this.$store.state.listProduct.map(item => item.name);
      this.itemProducts = listProduct.filter(e => {
        return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1;
      });
    },
    closeDialogSuccess(e) {
      this.dialogAddProduct = false;
      this.dialogEditProduct = false;
      this.dialogSuccess = e;
    },
    closeDialogFailed(e) {
      this.dialogFailed = e;
    },
    closeDialogConfirm(e) {
      this.dialogConfirm = e;
    },
    showImage(item) {
      if (item !== null) {
        return URL.createObjectURL(item);
      } else {
        return null;
      }
    },
    successDelete() {
      this.$store.dispatch("getProduct");
    },
    closeDialogAdd(e) {
      this.$store.dispatch("getProduct");
      this.dialogAddProduct = e
    },
    closeDialogEdit(e) {
      this.$store.dispatch("getProduct");
      this.dialogEditProduct = e
    },
    successAddProduct(e) {
      this.$store.dispatch("getProduct");
      this.messageDialog = e;
      this.dialogSuccess = true;
    },
    failedAddProduct(e) {
      this.messageDialog = e;
      this.dialogFailed = true;
    },
    deleteProduct(e) {
      this.selectedDelete = e;
      this.messageDialog = "Kamu yakin akan menghapus produk ini?"
      this.dialogConfirm = true;
    },
    doDelete() {
      this.$store.dispatch("deleteProduct", this.selectedDelete)
        .then(() => {          
          this.$store.dispatch("getProduct");
          this.dialogConfirm = false;
          this.messageDialog = "Berhasil menghapus produk";
          this.dialogSuccess = true;
        })
        .catch(() => {
          this.dialogConfirm = false;
          this.messageDialog = "Terjadi kesalahan. Silahkan coba lagi nanti";
          this.dialogFailed = true;
        })
    },
    goToEdit(item) {
      this.selectedProduct = item;
      this.dialogEditProduct = true;
    }
  },
  created() {
    this.$store.dispatch("getCategory");
    this.$store.dispatch("getProduct");
  }
}
</script>
