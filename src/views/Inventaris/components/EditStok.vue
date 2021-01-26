<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <v-card-title class="ml-0">Edit Stok</v-card-title>
        <v-card-subtitle>{{ selectedProduct.product.name }}</v-card-subtitle>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(editStock)">
            <ValidationProvider v-slot="{ errors }" name="Stok" rules="required|integer">
              <v-text-field
                :error-messages="errors"
                v-model="selectedProduct.stock"
                label="Stok"
                outlined
                dense
                type="number" 
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="warning darken-1" text @click="closeDialog">Batal</v-btn>
              <v-btn color="primary" dark type="submit" :loading="$store.state.loading">Edit</v-btn>
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
  computed: {
    selectedProduct: {
      get() {
        return this.selected
      },
      set(val) {
        this.$emit('update:selected', val);
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog', false);
    },
    editStock() {
      this.$store.dispatch("submitInventory", this.selectedProduct)
        .then(() => {
          this.$emit("success", "Stok telah diperbarui");
        })
        .catch(() => {
          this.$emit("error", "Terjadi masalah. Silahkan coba lagi nanti");
        });
    },
  }
}
</script>
