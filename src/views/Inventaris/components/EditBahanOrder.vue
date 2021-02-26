<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <div class="d-flex flex-row justify-space-between align-center">
          <div class="d-flex flex-column">
            <v-card-title class="ml-0">Edit Bahan</v-card-title>
            <v-card-subtitle>{{ selectedIngredient.ingredient.name }}</v-card-subtitle>
          </div>
          <v-btn color="error" outlined @click="goDelete">
            <v-icon class="mr-1">mdi-delete</v-icon>Hapus
          </v-btn>
        </div>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(editIngredient)">
            <ValidationProvider v-slot="{ errors }" name="In stock" rules="integer">
              <v-text-field
                :error-messages="errors"
                v-model="selectedIngredient.ingredient.ending_stock"
                label="In Stock"
                :suffix="selectedIngredient.ingredient.unit"
                outlined
                dense
                disabled
                class="mb-0 mt-8 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Order" rules="required">
              <v-text-field
                :error-messages="errors"
                v-model="selectedIngredient.order"
                label="Order"
                :suffix="selectedIngredient.ingredient.unit"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Unit cost" rules="required|integer">
              <v-text-field
                :error-messages="errors"
                v-model="selectedIngredient.unit_cost"
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
                v-model="selectedIngredient.received"
                label="Diterima"
                :suffix="selectedIngredient.ingredient.unit"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider> -->
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="warning darken-1" text @click="closeDialog">Batal</v-btn>
              <v-btn color="primary" dark type="submit" :loading="$store.state.loading">Edit</v-btn>
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
  data() {
    return {
      selectedIngredient: {}
    }
  },
  watch: {
    selected(val) {
      this.selectedIngredient = val
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
    goDelete() {
      this.$emit("delete", this.selectedIngredient)
    },
    editIngredient() {
      this.$emit('edit', this.selectedIngredient);
    }
  },
}
</script>
