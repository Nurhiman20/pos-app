<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <v-card-title class="ml-0">Tambah Kategori</v-card-title>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(addCategory)">
            <ValidationProvider v-slot="{ errors }" name="Nama kategori" rules="required">
              <v-text-field
                :error-messages="errors"
                v-model="nameCategory"
                label="Nama Kategori"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
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
      nameCategory: null
    }
  },
  computed: {
    ...product.mapState(['loading'])
  },
  methods: {
    ...product.mapActions(['postCategory']),
    closeDialog() {
      this.$emit('closeDialog', false);
    },
    randomId() {
      var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      var uniqid = 'cat-' + randLetter + Date.now();
      return uniqid
    },
    addCategory() {
      let dataForm = {
        id: this.randomId(),
        name: this.nameCategory
      };
      this.postCategory(dataForm)
        .then(result => {
          console.log(result);
          this.nameCategory = null
          this.closeDialog();
        });
    }
  }
}
</script>
