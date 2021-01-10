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
    <v-dialog v-model="dialogAddProduct" persistent width="400">
      <v-card class="pa-3">
        <v-card-title class="ml-0">Tambah Produk</v-card-title>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(addProduct)">
            <ValidationProvider v-slot="{ errors }" name="Nama produk" rules="required">
              <v-text-field
                :error-messages="errors"
                v-model="nameProduct"
                label="Nama Produk"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Harga produk" rules="required|integer">
              <v-text-field
                :error-messages="errors"
                v-model="priceProduct"
                label="Harga Produk"
                placeholder="15000"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Kategori produk" rules="required">
              <v-select
                v-model="categoryProduct"
                :error-messages="errors"
                :items="listCategory"
                :item-text="textCategory"
                :item-value="valueCategory"
                label="Kategori Produk"
                class="mb-0 mt-2 px-4"
                outlined
              ></v-select>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Deskripsi produk" rules="required|max:200">
              <v-textarea
                v-model="descriptionProduct"
                :error-messages="errors"
                label="Deskripsi Produk"
                class="mb-0 mt-2 px-4"
                rows="3"
                outlined
                counter
                auto-grow
              ></v-textarea>
            </ValidationProvider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error darken-1" text @click="dialogAddProduct = false">Batal</v-btn>
              <v-btn color="primary" dark type="submit" :loading="loading">Tambahkan</v-btn>
            </v-card-actions>
          </v-form>
        </ValidationObserver>
      </v-card>
    </v-dialog>

    <!-- dialog add product -->
    <v-dialog v-model="dialogEditProduct" persistent width="400">
      <v-card class="pa-3">
        <v-card-title class="ml-0">Edit Produk</v-card-title>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(editProduct)">
            <ValidationProvider v-slot="{ errors }" name="Nama produk" rules="required">
              <v-text-field
                :error-messages="errors"
                v-model="selectedProduct.name"
                label="Nama Produk"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Harga produk" rules="required|integer">
              <v-text-field
                :error-messages="errors"
                v-model="selectedProduct.price"
                label="Harga Produk"
                placeholder="15000"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Kategori produk" rules="required">
              <v-select
                v-model="selectedProduct.category"
                :error-messages="errors"
                :items="listCategory"
                :item-text="textCategory"
                :item-value="valueCategory"
                label="Kategori Produk"
                class="mb-0 mt-2 px-4"
                outlined
              ></v-select>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Deskripsi produk" rules="required|max:50">
              <v-textarea
                v-model="selectedProduct.description"
                :error-messages="errors"
                label="Deskripsi Produk"
                class="mb-0 mt-2 px-4"
                rows="3"
                outlined
                counter
                auto-grow
              ></v-textarea>
            </ValidationProvider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error darken-1" text @click="dialogEditProduct = false">Batal</v-btn>
              <v-btn color="primary" dark type="submit" :loading="loading">Tambahkan</v-btn>
            </v-card-actions>
          </v-form>
        </ValidationObserver>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const product = createNamespacedHelpers("product");

export default {
  data() {
    return {
      selectedProduct: {},
      search: null,
      nameProduct: null,
      priceProduct: null,
      categoryProduct: null,
      descriptionProduct: null,
      imageProduct: 'https://picsum.photos/400/300?random',
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
    randomId() {
      var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      var uniqid = 'prod-' + randLetter + Date.now();
      return uniqid
    },
    textCategory(item) {
      return item.name
    },
    valueCategory(item) {
      return item
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
    },
    editProduct() {
      this.postProduct(this.selectedProduct)
        .then(result => {
          console.log(result);
          this.dialogEditProduct = false;
          this.getProduct()
        });
    },
    addProduct() {
      let dataForm = {
        id: this.randomId(),
        name: this.nameProduct,
        price: this.priceProduct,
        category: this.categoryProduct,
        description: this.descriptionProduct,
        image: this.imageProduct
      };
      this.postProduct(dataForm)
        .then(result => {
          console.log(result);
          this.dialogAddProduct = false;
          this.getProduct()
          this.nameProduct = null;
          this.priceProduct = null;
          this.categoryProduct = null;
          this.descriptionProduct = null;
        });
    }
  },
  created() {
    this.getCategory();
    this.getProduct();
  }
}
</script>
