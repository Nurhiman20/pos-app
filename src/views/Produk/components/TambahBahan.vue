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
            <!-- <ValidationProvider v-slot="{ errors }" name="Varian" rules="">
              <v-text-field
                :error-messages="errors"
                v-model="variantIngredient"
                label="Varian"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider> -->
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
            <ValidationProvider v-slot="{ errors }" name="Stok awal" rules="required|integer">
              <v-text-field
                :error-messages="errors"
                v-model="stockIngredient"
                label="Stok Awal"
                outlined
                dense
                type="number" 
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Satuan" rules="required">
              <v-autocomplete
                :error-messages="errors"
                v-model="unitIngredient"
                :items="listUnit"
                label="Satuan"
                cache-items
                class="mb-0 mt-2 px-4"
                outlined
                dense
                hide-no-data
                hide-details
                :clearable="true"
              ></v-autocomplete>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Harga per satuan" rules="required|integer">
              <v-text-field
                :error-messages="errors"
                v-model="pricePerUnit"
                label="Harga per Satuan"
                outlined
                dense
                type="number" 
                class="mb-0 mt-8 px-4"
              ></v-text-field>
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
import * as moment from 'moment';

export default {
  props: ['show'],
  data() {
    return {
      nameIngredient: null,
      // variantIngredient: null,
      categoryIngredient: {},
      stockIngredient: null,
      unitIngredient: null,
      pricePerUnit: null,
      listUnit: ['liter (l)', 'mililiter (ml)', 'kilogram (kg)', 'ons (ons)', 'gram (g)', 'miligram (mg)', 'centimeter (cm)', 'meter (m)', 'inch (in)', 'bungkus (bks)', 'botol (btl)', 'box (box)', 'butir (btr)', 'pieces (pcs)']
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
        // variant: this.variantIngredient,
        category: this.categoryIngredient,
        stock: this.stockIngredient,
        unit: this.unitIngredient,
        price: this.pricePerUnit,
        time: moment().format('DD/MM/YYYY, HH:mm:ss')
      };
      this.$store.dispatch("submitIngredient", dataForm)
        .then(() => {
          this.nameIngredient = null;
          this.categoryIngredient = null;
          this.stockIngredient = null;
          this.unitIngredient = null;
          this.pricePerUnit = null;   
          this.$emit("success", "Bahan telah disimpan");
        })
        .catch(() => {
          this.$emit("error", "Terjadi masalah. Silahkan coba lagi nanti");
        });
    }
  }
}
</script>
