<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <v-card-title class="ml-0">Pilih Produk</v-card-title>
        <v-card-subtitle>{{ selectedProduct.name }}</v-card-subtitle>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(selectProduct)">
            <ValidationProvider v-slot="{ errors }" name="Varian" rules="">
              <v-select
                v-model="variant"
                :error-messages="errors"
                :items="selectedProduct.variant"
                :item-text="textVariant"
                :item-value="valueVariant"
                label="Varian"
                class="mb-0 mt-2 px-4"
                outlined
                dense
                v-if="selectedProduct.variant.length !== 0"
              ></v-select>
            </ValidationProvider>
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
      variant: null,
      quantity: 1,
      discount: 0
    }
  },
  methods: {
    formatCurrency(val) {
      return val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
    },
    textVariant(item) {
      return item.name + ' - ' + 'Rp' + this.formatCurrency(item.price) + ',00'
    },
    valueVariant(item) {
      return item
    },
    closeDialog() {
      this.variant = null;
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
      if (parseInt(this.selectedProduct.total) < 0) {
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
      this.selectedProduct.total = parseInt(this.quantity) * parseInt(this.selectedProduct.price) - parseInt(this.discount);

      let productData = {
        ...this.selectedProduct
      }

      if (this.variant !== null) {
        productData.name = this.variant.name;
        productData.price = this.variant.price;
        productData.ingredients = this.variant.ingredients;
        productData.total = parseInt(this.quantity) * parseInt(productData.price) - parseInt(this.discount);
      }
      if (this.checkDiscount()) {
        this.$store.commit("ADD_SELECTED_PRODUCT", productData);
        this.quantity = 1;
        this.discount = 0;
        this.closeDialog();
      }
    }
  },
}
</script>
