<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <v-card-title class="ml-0">Tambah Bahan</v-card-title>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(addIngredient)">
            <ValidationProvider v-slot="{ errors }" name="Nama bahan" rules="required">
              <v-text-field
                :error-messages="errors"
                v-model="nameIngredient"
                label="Nama Bahan"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Kategori bahan" rules="required">
              <v-select
                v-model="categoryIngredient"
                :error-messages="errors"
                :items="$store.state.listCategory"
                :item-text="textCategory"
                :item-value="valueCategory"
                label="Kategori Bahan"
                class="mb-0 mt-2 px-4"
                outlined
              ></v-select>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Stok" rules="required|integer">
              <v-text-field
                :error-messages="errors"
                v-model="stockIngredient"
                label="Stok"
                outlined
                dense
                type="number" 
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Satuan" rules="required">
              <v-select
                v-model="unitIngredient"
                :error-messages="errors"
                :items="listUnit"
                label="Satuan"
                class="mb-0 mt-2 px-4"
                outlined
              ></v-select>
            </ValidationProvider>
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
      nameIngredient: null,
      categoryIngredient: {},
      stockIngredient: null,
      unitIngredient: null,
      listUnit: ['botol (btl)', 'bungkus (bks)', 'box (box)', 'centimeter (cm)', 'gram (g)']
    }
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog', false);
    },
    randomId() {
      var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      var uniqid = 'ing-' + randLetter + Date.now();
      return uniqid
    },
    textCategory(item) {
      return item.name
    },
    valueCategory(item) {
      return item
    },
    addIngredient() {
      let dataForm = {
        id: this.randomId(),
        name: this.nameIngredient,
        category: this.categoryIngredient,
        stock: this.stockIngredient,
        unit: this.unitIngredient
      };
      this.$store.dispatch("submitIngredient", dataForm)
        .then(() => {
          this.nameIngredient = null;          
          this.$emit("success", "Bahan telah disimpan");
        })
        .catch(() => {
          this.$emit("error", "Terjadi masalah. Silahkan coba lagi nanti");
        });
    }
  }
}
</script>
