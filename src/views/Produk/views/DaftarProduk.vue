<template>
  <div>
    <div class="d-flex flex-row justify-space-between align-center">
      <h1>Daftar Produk</h1>
      <v-btn color="primary" small @click="dialogAddProduct = true">Tambah Produk</v-btn>
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
        :items="listProduct"
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
    ></add-product-dialog>

    <!-- dialog add product -->
    <edit-product-dialog 
      :show="dialogEditProduct"
      :selected="selectedProduct"
      @closeDialog="closeDialogEdit"
      @successDelete="getProduct"
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
      select: null,
      itemProducts: [],
      headers: [
        { text: 'ID', value: 'id', sortable: false },
        { text: 'Produk', value: 'name', sortable: true },
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
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val);
    },
  },
  methods: {
    ...product.mapActions(['getProduct', 'getCategory', 'postProduct']),
    querySelections(v) {
      let listProduct = this.listProduct.map(item => item.name);
      this.itemProducts = listProduct.filter(e => {
        return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1;
      });
    },
    showImage(item) {
      if (item !== null) {
        return URL.createObjectURL(item);
      } else {
        return null;
      }
    },
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
    }
  },
  created() {
    this.getCategory();
    this.getProduct();
  }
}
</script>
