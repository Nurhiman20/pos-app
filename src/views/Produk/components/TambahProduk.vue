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
      rulesImage: [
        value => !value || value.size < 2000000 || 'Ukuran foto tidak boleh lebih dari 2 MB',
      ],
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
          this.$emit("success", "Produk telah disimpan");
        })
        .catch(() => {
          this.$emit("error", "Terjadi masalah. Silahkan coba lagi nanti");
        });
    }
  }
}
</script>
