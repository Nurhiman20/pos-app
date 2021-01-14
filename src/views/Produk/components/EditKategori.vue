<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <div class="d-flex flex-row justify-space-between align-center">
          <v-card-title class="ml-0">Edit Kategori</v-card-title>
          <v-btn color="error" outlined @click="goDelete">
            <v-icon class="mr-1">mdi-delete</v-icon>Delete
          </v-btn>
        </div>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(editCategory)">
            <ValidationProvider v-slot="{ errors }" name="Nama kategori" rules="required">
              <v-text-field
                :error-messages="errors"
                v-model="selectedCategory.name"
                label="Nama Kategori"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error darken-1" text @click="closeDialog">Batal</v-btn>
              <v-btn color="primary" dark type="submit" :loading="loading">Edit</v-btn>
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
      selectedCategory: {}
    }
  },
  computed: {
    ...product.mapState(['loading'])
  },
  watch: {
    selected(val) {
      this.selectedCategory = val
    }
  },
  methods: {
    ...product.mapActions(['postCategory', 'deleteCategory']),
    closeDialog() {
      this.$emit('closeDialog', false);
    },
    goDelete() {
      this.deleteCategory(this.selectedCategory)
        .then(() => {
          this.closeDialog();
          this.$emit('successDelete', true);
        })
    },
    editCategory() {
      this.postCategory(this.selectedCategory)
        .then(() => {
          this.closeDialog();
        })
    }
  }
}
</script>
