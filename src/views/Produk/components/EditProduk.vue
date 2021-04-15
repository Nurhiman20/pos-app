<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <div class="d-flex flex-row justify-space-between align-center">
          <v-card-title class="ml-0">Edit Produk</v-card-title>
          <v-btn color="error" outlined @click="goDelete">
            <v-icon class="mr-1">mdi-delete</v-icon>Hapus
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
            <ValidationProvider v-slot="{ errors }" name="Kategori produk" rules="required">
              <v-select
                v-model="selectedProduct.category"
                :error-messages="errors"
                :items="$store.state.listCategory"
                :item-text="textCategory"
                :item-value="valueCategory"
                label="Kategori Produk"
                class="mb-0 mt-2 px-4"
                outlined
              ></v-select>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Tanpa bahan" rules="">
              <v-checkbox
                v-model="selectedProduct.without_ingredient"
                label="Tanpa bahan"
                class="mb-0 mt-n3 px-4"
                :error-messages="errors"
              ></v-checkbox>
            </ValidationProvider>
            <div v-if="selectedProduct.without_ingredient === true">
              <ValidationProvider v-slot="{ errors }" name="Harga beli" rules="integer">
                <v-text-field
                  :error-messages="errors"
                  v-model="selectedProduct.price_cost"
                  label="Harga Beli"
                  placeholder="15000"
                  outlined
                  dense
                  class="mb-0 mt-2 px-4"
                ></v-text-field>
              </ValidationProvider>
              <!-- <ValidationProvider v-slot="{ errors }" name="Varian" rules="">
                <v-text-field
                  :error-messages="errors"
                  v-model="selectedProduct.variant"
                  label="Varian"
                  outlined
                  dense
                  class="mb-0 mt-2 px-4"
                ></v-text-field>
              </ValidationProvider> -->
              <ValidationProvider v-slot="{ errors }" name="Stok awal" rules="">
                <v-text-field
                  :error-messages="errors"
                  v-model="selectedProduct.stock"
                  label="Stok Awal"
                  outlined
                  dense
                  type="number" 
                  class="mb-0 mt-2 px-4"
                ></v-text-field>
              </ValidationProvider>
              <ValidationProvider v-slot="{ errors }" name="Satuan" rules="">
                <v-autocomplete
                  :error-messages="errors"
                  v-model="selectedProduct.unit"
                  :items="listUnit"
                  label="Satuan"
                  cache-items
                  class="mb-4 mt-2 px-4"
                  outlined
                  dense
                  hide-no-data
                  hide-details
                  :clearable="true"
                ></v-autocomplete>
              </ValidationProvider>
            </div>
            <ValidationProvider v-slot="{ errors }" name="Deskripsi produk" rules="max:50">
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
            <div class="px-4 mt-2" v-if="selectedProduct.without_ingredient === false || selectedProduct.without_ingredient === undefined">
              <v-data-table
                :headers="headers"
                :items="selectedProduct.ingredients"
                class="elevation-1 scrollbar-custom"
                hide-default-footer
              ></v-data-table>
            </div>
            <div class="px-4 mt-3 mb-6" v-if="selectedProduct.without_ingredient === false || selectedProduct.without_ingredient === undefined">
              <v-btn color="secondary" dark block @click="$router.push('/produk/resep')">Edit Bahan</v-btn>
            </div>
            <ValidationProvider v-slot="{ errors }" name="Foto produk" rules="required">
              <v-file-input
                v-model="selectedProduct.image"
                label="Foto Produk"
                class="mb-0 mt-2 px-4"
                prepend-icon="mdi-camera"
                accept="image/*"
                ref="inputImage"
                outlined
                dense
                @change="setPreviewImage"
                :rules="rulesImage"
                :error-messages="errors"
              ></v-file-input>
            </ValidationProvider>
            <div class="px-4 mb-3" v-if="previewImage !== null">
              <p>Preview Foto</p>
              <v-img :src="previewImage" :aspect-ratio="4/3"></v-img>
            </div>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="warning darken-1" text @click="closeDialog">Batal</v-btn>
              <v-btn color="primary" dark type="submit" :loading="$store.state.loading">Perbarui</v-btn>
            </v-card-actions>
          </v-form>
        </ValidationObserver>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ['show', 'selected'],
  data() {
    return {
      selectedProduct: {},
      rulesImage: [
        value => !value || value.size < 2000000 || 'Ukuran foto tidak boleh lebih dari 2 MB',
      ],      
      headers: [
        { text: 'Bahan', value: 'ingredient.name', sortable: false },
        { text: 'Qty', value: 'qty', sortable: false },
        { text: 'Unit', value: 'ingredient.unit', sortable: false }
      ],
      previewImage: null,      
      listUnit: ['liter (l)', 'mililiter (ml)', 'kilogram (kg)', 'ons (ons)', 'gram (g)', 'miligram (mg)', 'centimeter (cm)', 'meter (m)', 'inch (in)', 'bungkus (bks)', 'botol (btl)', 'box (box)', 'butir (btr)', 'pieces (pcs)'],
    }
  },
  watch: {
    selected(val) {
      this.selectedProduct = val;
      this.previewImage = URL.createObjectURL(val.image);
    },
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog', false);
    },
    textCategory(item) {
      return item.name
    },
    valueCategory(item) {
      return item
    },
    setPreviewImage(e) {
      if (e !== null) {
        this.previewImage = URL.createObjectURL(e);
      } else {
        this.previewImage = null;
      }
    },
    goDelete() {
      this.$emit("delete", this.selectedProduct)
    },
    editProduct() {
      if (this.selectedProduct.without_ingredient === true) {
        delete this.selectedProduct["ingredients"];
      } else {
        this.selectedProduct.ingredients = [];
        delete this.selectedProduct["price_cost"];
        // delete this.selectedProduct["variant"];
        delete this.selectedProduct["stock"];
        delete this.selectedProduct["unit"];
      }
      this.$store.dispatch("updateProduct", this.selectedProduct)
        .then(() => {
          this.$emit("success", "Produk telah diedit");
        })
        .catch(() => {
          this.$emit("error", "Terjadi masalah. Silahkan coba lagi nanti");
        });
    }
  }
}
</script>
