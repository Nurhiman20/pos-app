<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <v-card-title class="ml-0">Pilih Produk</v-card-title>
        <v-card-subtitle>{{ selectedProduct.product.name }}</v-card-subtitle>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(selectProduct)">
            <v-row no-gutters>
              <v-col cols="6">
                <ValidationProvider v-slot="{ errors }" name="Kuantitas" rules="required|integer">
                  <v-text-field
                    :error-messages="errors"
                    v-model="quantity"
                    label="Kuantitas"
                    outlined
                    dense
                    class="mb-0 mt-2 px-4"
                    :hint="'Jumlah stok: ' + selectedProduct.stock"
                    persistent-hint
                  ></v-text-field>
                </ValidationProvider>
              </v-col>
              <v-col cols="6">
                <v-btn
                  class="mx-2 mt-3"
                  fab
                  x-small
                  color="secondary"
                  @click="minQuantity"
                  :disabled="quantity < 2 ? true : false"
                  :dark="quantity < 2 ? false : true"
                >
                  <v-icon dark>
                    mdi-minus
                  </v-icon>
                </v-btn>
                <v-btn
                  class="mx-2 mt-3"
                  fab
                  x-small
                  color="secondary"
                  @click="addQuantity"
                  :disabled="quantity > parseInt(selectedProduct.stock) - 1 ? true : false"
                  :dark="quantity > parseInt(selectedProduct.stock) - 1 ? false : true"
                >
                  <v-icon dark>
                    mdi-plus
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <ValidationProvider v-slot="{ errors }" name="Diskon" rules="required|integer">
              <v-text-field
                :error-messages="errors"
                v-model="discount"
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
              <v-btn color="primary" dark type="submit">Tambahkan</v-btn>
            </v-card-actions>
          </v-form>
        </ValidationObserver>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ['show', 'selectedProduct'],
  data() {
    return {
      quantity: 1,
      discount: 0
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close', false);
    },
    minQuantity() {
      this.quantity = parseInt(this.quantity) - 1;
    },
    addQuantity() {
      this.quantity = parseInt(this.quantity) + 1;
    },
    checkQuantity() {
      if (this.quantity > parseInt(this.selectedProduct.stock)) {
        this.$refs.form.setErrors({
          Kuantitas: "Kuantitas yang diinput melebihi stok"
        });
        return false;
      } else if (this.quantity < 1) {
        this.$refs.form.setErrors({
          Kuantitas: "Kuantitas yang diinput tidak sesuai"
        });
        return false;
      } else {
        return true;
      }
    },
    checkDiscount() {
      if (parseInt(this.selectedProduct.product.total) < 0) {
        this.$refs.form.setErrors({
          Diskon: "Diskon yang diinput melebihi total harga produk"
        });
        return false;
      } else {
        return true;
      }
    },
    selectProduct() {
      this.selectedProduct.qty = this.quantity;
      this.selectedProduct.discount = this.discount;
      this.selectedProduct.total = parseInt(this.quantity) * parseInt(this.selectedProduct.product.price) - parseInt(this.discount);
      if (this.checkQuantity() && this.checkDiscount()) {
        this.$store.commit("ADD_SELECTED_PRODUCT", this.selectedProduct);
        this.quantity = 1;
        this.discount = 0;
        this.closeDialog();
      }
    }
  },
}
</script>
