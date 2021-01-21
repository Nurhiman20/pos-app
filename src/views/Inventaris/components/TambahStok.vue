<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <v-card-title class="ml-0">Tambah Stok</v-card-title>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(editStock)">
            <ValidationProvider v-slot="{ errors }" name="Produk" rules="required">
              <v-select
                v-model="product"
                :error-messages="errors"
                :items="$store.state.listProduct"
                :item-text="textProduct"
                :item-value="valueProduct"
                label="Produk"
                class="mb-0 mt-2 px-4"
                outlined
              ></v-select>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Stok" rules="required|integer">
              <v-text-field
                :error-messages="errors"
                v-model="stock"
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
              <v-btn color="primary" dark type="submit" :loading="$store.state.loading">Tambah</v-btn>
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
      product: null,
      stock: 0,
    }
  },
  methods: {
    textProduct(item) {
      return item.name
    },
    valueProduct(item) {
      return item
    },
    closeDialog() {
      this.$emit('closeDialog', false);
    },    
    randomId() {
      var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      var uniqid = 'inv-' + randLetter + Date.now();
      return uniqid
    },
    editStock() {
      let dataForm = {
        id: this.randomId(),
        id_product: this.product.id,
        product: this.product,
        stock: this.stock
      }
      this.$store.dispatch("submitInventory", dataForm)
        .then(() => {
          this.product = null;
          this.stock = 0;
          this.closeDialog();
        })
    },
  }
}
</script>
