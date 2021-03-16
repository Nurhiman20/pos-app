<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <div class="d-flex flex-row justify-space-between align-center">
          <v-card-title class="ml-0">Edit Produk</v-card-title>
          <v-btn color="error" outlined @click="removeFromCart" v-if="Object.keys(this.$store.state.selectedTx).length === 0">
            <v-icon class="mr-1">mdi-delete</v-icon>Hapus
          </v-btn>
        </div>
        <v-card-subtitle class="mt-n4">{{ selectedProduct.name }}</v-card-subtitle>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(selectProduct)">
            <v-row no-gutters>
              <v-col cols="6">
                <ValidationProvider v-slot="{ errors }" name="Kuantitas" rules="required|integer">
                  <v-text-field
                    :error-messages="errors"
                    v-model="selectedProduct.qty"
                    label="Kuantitas"
                    outlined
                    dense
                    type="number"
                    class="mb-0 mt-2 px-4"
                    persistent-hint
                  ></v-text-field>
                </ValidationProvider>
              </v-col>
            </v-row>
            <ValidationProvider v-slot="{ errors }" name="Diskon" rules="required|integer">
              <v-text-field
                :error-messages="errors"
                v-model="selectedProduct.discount"
                label="Diskon"
                placeholder="1000"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="warning darken-1" text @click="closeDialog">Batal</v-btn>
              <v-btn color="primary" dark type="submit">Edit</v-btn>
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
    },
  },
  methods: {
    closeDialog() {
      this.$emit('close', false);
    },
    checkQuantity() {
      if (this.selectedProduct.qty > parseInt(this.selectedProduct.stock)) {
        this.$refs.form.setErrors({
          Kuantitas: "Kuantitas yang diinput melebihi stok"
        });
        return false;
      } else if (this.selectedProduct.qty < 1) {
        this.$refs.form.setErrors({
          Kuantitas: "Kuantitas yang diinput tidak sesuai"
        });
        return false;
      } else {
        return true;
      }
    },
    checkDiscount() {
      if (parseInt(this.selectedProduct.total) < 0) {
        this.$refs.form.setErrors({
          Diskon: "Diskon yang diinput melebihi total harga produk"
        });
        return false;
      } else {
        return true;
      }
    },
    removeFromCart() {
      this.$store.commit("REMOVE_SELECTED_PRODUCT", this.selectedProduct);
      this.closeDialog();
    },
    selectProduct() {
      this.selectedProduct.total = parseInt(this.selectedProduct.qty) * parseInt(this.selectedProduct.price) - parseInt(this.selectedProduct.discount);
      if (this.checkDiscount()) {
        this.$store.commit("EDIT_SELECTED_PRODUCT", this.selectedProduct)
        this.closeDialog();
      }
    }
  },
}
</script>
