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
            <ValidationProvider v-slot="{ errors }" name="Order" rules="required">
              <v-text-field
                :error-messages="errors"
                v-model="order"
                label="Order"
                :suffix="unit"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Unit cost" rules="required|integer">
              <v-text-field
                :error-messages="errors"
                v-model="unitCost"
                label="Unit Cost"
                prefix="Rp"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <!-- <ValidationProvider v-slot="{ errors }" name="Diterima" rules="required">
              <v-text-field
                :error-messages="errors"
                v-model="received"
                label="Diterima"
                :suffix="unit"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider> -->
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
      inStock: null,
      unit: null,
      order: null,
      received: 0,
      unitCost: null
    }
  },
  watch: {
    ingredient(val) {
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
    addIngredient() {
      let dataForm = {
        id_ingredient: this.ingredient.id,
        ingredient: this.ingredient,
        in_stock: this.inStock,
        order: this.order,
        unit_cost: this.unitCost
      }
      this.$emit('add', dataForm);
      this.ingredient = null;
      this.inStock = null;
      this.order = null;
      this.unitCost = null;
      this.unit = null;
    }
  },
}
</script>
