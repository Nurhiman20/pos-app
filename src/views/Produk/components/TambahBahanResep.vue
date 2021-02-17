<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <v-card-title class="ml-0">Tambah Bahan</v-card-title>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(addIngredient)">
            <ValidationProvider v-slot="{ errors }" name="Nama bahan" rules="required">
              <v-autocomplete
                :error-messages="errors"
                v-model="ingredient"
                :items="$store.state.listIngredient"
                :item-text="textIngredient"
                :item-value="valueIngredient"
                label="Nama Bahan"
                cache-items
                class="mb-0 mt-2 px-4"
                outlined
                dense
                hide-no-data
                hide-details
                :clearable="true"
              ></v-autocomplete>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Kuantitas" rules="required">
              <v-text-field
                :error-messages="errors"
                v-model="qty"
                label="Kuantitas"
                placeholder="0.2"
                :suffix="unit"
                outlined
                dense
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
export default {
  props: ['show'],
  data() {
    return {
      ingredient: null,
      qty: null,
      unit: null
    }
  },
  watch: {
    ingredient(val) {
      if (val !== null) {
        this.inStock = val.stock;
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
    addIngredient() {
      let dataForm = {
        id_ingredient: this.ingredient.id,
        ingredient: this.ingredient,
        qty: this.qty
      }
      this.$emit('add', dataForm);
      this.ingredient = null;
      this.qty = null;
      this.unit = null;
    }
  },
}
</script>
