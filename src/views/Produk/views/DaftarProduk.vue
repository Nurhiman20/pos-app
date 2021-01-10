<template>
  <div>
    <div class="d-flex flex-row justify-space-between align-center">
      <h1>Daftar Produk</h1>
      <v-btn color="primary" small @click="dialogAddProduct = true">Tambah Produk</v-btn>
    </div>
    <v-card outlined flat class="pa-4 mt-3">
      <v-row>
        <v-col cols="12" md="4" lg="4">
          <v-text-field
            v-model="search"
            outlined
            dense
            append-icon="mdi-magnify"
            label="Cari..."
            class="mb-0 mt-4"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-data-table
        :headers="headers"
        :items="listProduct"
        :search="search"
        class="elevation-1 scrollbar-custom"
        hide-default-footer
      >
        <template v-slot:item.actions="{item}">
          <div class="d-flex flex-row align-center justify-end">
            <v-btn icon color="success" @click="goToEdit(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon color="error" @click="goDelete(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- dialog add product -->
    <add-product-dialog
      :show="dialogAddProduct"
      @closeDialog="closeDialogAdd"
    ></add-product-dialog>

    <!-- dialog add product -->
    <edit-product-dialog 
      :show="dialogEditProduct"
      :selected="selectedProduct"
      @closeDialog="closeDialogEdit"
    ></edit-product-dialog>
  </div>
</template>

<script>
import addProductDialog from '../components/TambahProduk';
import editProductDialog from '../components/EditProduk';
import { createNamespacedHelpers } from "vuex";
const product = createNamespacedHelpers("product");

export default {
  components: {
    addProductDialog,
    editProductDialog
  },
  data() {
    return {
      selectedProduct: {},
      search: null,
      headers: [
        { text: 'ID', value: 'id', sortable: false },
        { text: 'Nama', value: 'name', sortable: true },
        { text: 'Harga', value: 'price', sortable: false },
        { text: 'Kategori', value: 'category.name', sortable: false },
        { text: 'Deskripsi', value: 'description', sortable: false },
        { text: '', value: 'actions', sortable: false }
      ],
      dialogAddProduct: false,
      dialogEditProduct: false
    }
  },
  computed: {
    ...product.mapState(['loading', 'listProduct', 'listCategory'])
  },
  methods: {
    ...product.mapActions(['getProduct', 'getCategory', 'postProduct', 'deleteProduct']),
    closeDialogAdd(e) {
      this.getProduct()
      this.dialogAddProduct = e
    },
    closeDialogEdit(e) {
      this.getProduct()
      this.dialogEditProduct = e
    },
    goToEdit(item) {
      this.selectedProduct = item;
      this.dialogEditProduct = true;
    },
    goDelete(item) {
      this.deleteProduct(item)
        .then(result => {
          console.log(result);
          this.getProduct()
        })
    }
  },
  created() {
    this.getCategory();
    this.getProduct();
  }
}
</script>
