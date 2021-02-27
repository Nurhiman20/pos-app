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
                v-model="withoutIngredient"
                label="Tanpa bahan"
                class="mb-0 mt-n3 px-4"
                :error-messages="errors"
              ></v-checkbox>
            </ValidationProvider>
            <div v-if="withoutIngredient === true">
              <ValidationProvider v-slot="{ errors }" name="Varian" rules="">
                <v-text-field
                  :error-messages="errors"
                  v-model="variantIngredient"
                  label="Varian"
                  outlined
                  dense
                  class="mb-0 mt-2 px-4"
                ></v-text-field>
              </ValidationProvider>
              <ValidationProvider v-slot="{ errors }" name="Stok awal" rules="integer">
                <v-text-field
                  :error-messages="errors"
                  v-model="stockIngredient"
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
                  v-model="unitIngredient"
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
            <ValidationProvider v-slot="{ errors }" name="Deskripsi produk" rules="required|max:200">
              <v-textarea
                v-model="descriptionProduct"
                :error-messages="errors"
                label="Deskripsi Produk"
                class="mb-0 mt-8 px-4"
                rows="3"
                outlined
                counter
                auto-grow
              ></v-textarea>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Foto produk" rules="required">
              <v-file-input
                v-model="imageProduct"
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
              <v-btn color="primary" dark type="submit" :loading="$store.state.loading">Tambahkan</v-btn>
            </v-card-actions>
          </v-form>
        </ValidationObserver>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ['show'],
  data() {
    return {
      nameProduct: null,
      priceProduct: null,
      categoryProduct: null,
      descriptionProduct: null,
      imageProduct: null,
      withoutIngredient: false,
      variantIngredient: null,
      stockIngredient: null,
      unitIngredient: null,
      rulesImage: [
        value => !value || value.size < 2000000 || 'Ukuran foto tidak boleh lebih dari 2 MB',
      ],
      listUnit: ['liter (l)', 'mililiter (ml)', 'kilogram (kg)', 'ons (ons)', 'gram (g)', 'miligram (mg)', 'centimeter (cm)', 'meter (m)', 'inch (in)', 'bungkus (bks)', 'botol (btl)', 'box (box)', 'butir (btr)', 'pieces (pcs)'],
      previewImage: null
    }
  },
  methods: {
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
    setPreviewImage(e) {
      if (e !== null) {
        this.previewImage = URL.createObjectURL(e);
      } else {
        this.previewImage = null;
      }
    },
    addProduct() {
      let dataForm = {
        id: this.randomId(),
        name: this.nameProduct,
        price: this.priceProduct,
        category: this.categoryProduct,
        description: this.descriptionProduct,
        without_ingredient: this.withoutIngredient,
        variant: this.variantIngredient,
        stock: this.stockIngredient,
        unit: this.unitIngredient,
        image: this.imageProduct
      };
      this.$store.dispatch("submitProduct", dataForm)
        .then(() => {
          this.nameProduct = null;
          this.priceProduct = null;
          this.categoryProduct = null;
          this.descriptionProduct = null;
          this.imageProduct = null;
          this.previewImage = null;
          this.withoutIngredient = false;
          this.$emit("success", "Produk telah disimpan");
        })
        .catch(() => {
          this.$emit("error", "Terjadi masalah. Silahkan coba lagi nanti");
        });
    }
  }
}
</script>
