<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <v-card-title class="ml-0">Pilih Produk</v-card-title>
        <v-card-subtitle>{{ selectedProduct.name }}</v-card-subtitle>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(addProduct)">
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
                  color="success"
                  @click="minQuantity"
                >
                  <v-icon dark>
                    mdi-minus
                  </v-icon>
                </v-btn>
                <v-btn
                  class="mx-2 mt-3"
                  fab
                  x-small
                  color="success"
                  @click="addQuantity"
                  :disabled="quantity === selectedProduct.stock ? true : false"
                  :dark="quantity === selectedProduct.stock ? false : true"
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
              <v-btn color="error darken-1" text @click="closeDialog">Batal</v-btn>
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
      this.$emit('close', false)
    },
    minQuantity() {
      this.quantity -= 1
    },
    addQuantity() {
      this.quantity += 1
    }
  },
}
</script>
