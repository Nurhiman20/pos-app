<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <v-card-title class="ml-0">Tambah Adjustment</v-card-title>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(addAdjustment)">
            <ValidationProvider v-slot="{ errors }" name="Nama bahan" rules="required">
              <v-autocomplete
                :error-messages="errors"
                v-model="nameIngredient"
                :items="$store.getters.listViewInventory"
                :item-text="textIngredient"
                :item-value="valueIngredient"
                label="Nama Bahan"
                class="mb-0 mt-2 px-4"
                outlined
                dense
                hide-no-data
                hide-details
                :clearable="true"
              ></v-autocomplete>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="In stock" rules="">
              <v-text-field
                :error-messages="errors"
                v-model="inStock"
                label="In Stock"
                :suffix="unit"
                outlined
                dense
                disabled
                class="mb-0 mt-8 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Actual stock" rules="required|integer">
              <v-text-field
                :error-messages="errors"
                v-model="actualStock"
                label="Actual Stock"
                :suffix="unit"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Keterangan" rules="max:200">
              <v-textarea
                v-model="notes"
                :error-messages="errors"
                label="Keterangan"
                class="mb-0 mt-2 px-4"
                rows="3"
                outlined
                counter
                auto-grow
              ></v-textarea>
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
      inStock: null,
      unit: null,
      actualStock: null,
      notes: null
    }
  },
  watch: {
    nameIngredient(val) {
      if (val !== null) {
        this.inStock = val.ending_stock;
        this.unit = val.unit;
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog', false);
    },
    textIngredient(item) {
      return item.name
    },
    valueIngredient(item) {
      return item
    },
    randomId() {
      var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      var uniqid = 'adj-' + randLetter + Date.now();
      return uniqid
    },
    countAdjustment(inStock, actualStock) {
      let count = parseFloat(inStock) - parseFloat(actualStock);
      return parseFloat(count.toFixed(2))
    },
    addAdjustment() {
      let dataForm = {
        id: this.randomId(),
        id_outlet: this.$store.state.account.id,
        id_ingredient: this.nameIngredient.id,
        ingredient: this.nameIngredient,
        in_stock: this.inStock,
        actual_stock: this.actualStock,
        adjustment: this.countAdjustment(this.inStock, this.actualStock),
        notes: this.notes,
        time: moment().format('DD/MM/YYYY, HH:mm:ss')
      };
      this.$store.dispatch("submitAdjustment", dataForm)
        .then(() => {
          this.nameIngredient = null;
          this.inStock = null;
          this.actualStock = null;
          this.unit = null;
          this.notes = null;        
          this.$emit("success", "Adjustment telah disimpan");
        })
        .catch(() => {
          this.$emit("error", "Terjadi masalah. Silahkan coba lagi nanti");
        });
    }
  },
}
</script>
