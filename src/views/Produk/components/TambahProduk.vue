<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
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
              <v-btn color="error darken-1" text @click="closeDialog">Batal</v-btn>
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
  props: ['show'],
  data() {
    return {
      nameProduct: null,
      priceProduct: null,
      categoryProduct: null,
      descriptionProduct: null,
      imageProduct: 'https://picsum.photos/400/300?random',
    }
  },
  computed: {
    ...product.mapState(['loading', 'listCategory'])
  },
  methods: {
    ...product.mapActions(['postProduct']),
    closeDialog() {
      this.$emit('closeDialog', false);
    },
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
          this.nameProduct = null;
          this.priceProduct = null;
          this.categoryProduct = null;
          this.descriptionProduct = null;
          this.closeDialog()
        });
    }
  }
}
</script>
