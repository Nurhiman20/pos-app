<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <div class="d-flex flex-row justify-space-between align-center">
          <v-card-title class="ml-0">Edit Produk</v-card-title>
          <v-btn color="error" outlined @click="goDelete">
            <v-icon class="mr-1">mdi-delete</v-icon>Delete
          </v-btn>
        </div>
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
            <ValidationProvider v-slot="{ errors }" name="Stok produk" rules="required|integer">
              <v-text-field
                :error-messages="errors"
                v-model="selectedProduct.stock"
                label="Stok Produk"
                placeholder="150"
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
              <v-btn color="warning darken-1" text @click="closeDialog">Batal</v-btn>
              <v-btn color="primary" dark type="submit" :loading="loading">Perbarui</v-btn>
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
  props: ['show', 'selected'],
  data() {
    return {
      selectedProduct: {}
    }
  },
  computed: {
    ...product.mapState(['loading', 'listCategory'])
  },
  watch: {
    selected(val) {
      this.selectedProduct = val
    }
  },
  methods: {
    ...product.mapActions(['postProduct', 'deleteProduct']),
    closeDialog() {
      this.$emit('closeDialog', false);
    },
    textCategory(item) {
      return item.name
    },
    valueCategory(item) {
      return item
    },
    goDelete() {
      this.deleteProduct(this.selectedProduct)
        .then(() => {
          this.closeDialog();
          this.$emit('successDelete', true);
        })
    },
    editProduct() {
      this.postProduct(this.selectedProduct)
        .then(() => {
          this.closeDialog();
        });
    }
  }
}
</script>
